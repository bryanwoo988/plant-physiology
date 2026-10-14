/* Loading chapters and turning their blocks into DOM.

   Knows nothing about routing. Charts, widgets, maps and dataset cards are
   drawn by their own modules, passed in through `ctx`, so this file stays
   a plain renderer. */

import { pick, t } from './i18n.js';
import { parseInline } from './markup.js';

const cache = new Map();
// Resolved against this module, not the page, so it works from any route or test page.
const DATA = new URL('../data/', import.meta.url);

async function json(name) {
  const path = new URL(name, DATA).href;
  if (!cache.has(path)) {
    cache.set(path, fetch(path).then(r => {
      if (!r.ok) throw new Error(`${path}: ${r.status}`);
      return r.json();
    }).catch(e => { cache.delete(path); throw e; }));
  }
  return cache.get(path);
}

export const loadIndex = () => json('index.json');
export const loadChapter = id => json(`${id}.json`);
export const loadData = name => json(`${name}.json`);

export function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(Infinity)) if (k != null) n.append(k instanceof Node ? k : String(k));
  return n;
}

// Text with {{t:…}} terms turned into buttons that open the term sheet.
export function inline(value, ctx) {
  const frag = document.createDocumentFragment();
  for (const piece of parseInline(pick(value, ctx.lang))) {
    if (piece.text !== undefined) { frag.append(piece.text); continue; }
    if (piece.chapter) { frag.append(el('a', { class: 'ch-link', href: `#/ch/${piece.chapter}` }, piece.label)); continue; }
    const term = ctx.terms?.get(piece.term);
    const label = piece.label ?? (term ? pick(term.name, ctx.lang) : piece.term);
    frag.append(el('button', { class: 'term', type: 'button', 'data-term': piece.term, onclick: () => ctx.onTerm?.(piece.term) }, label));
  }
  // Each markable block gets a key that is the same in every language:
  // chapter, section, place in the section.
  for (const sec of frag.children) {
    sec.querySelectorAll(UNITS).forEach((u, i) => { u.dataset.rk = `${chapter.id}/${sec.id}#${i}`; });
  }
  return frag;
}

const MARKABLE = new Set(['p', 'list', 'keyval', 'table', 'note']);

const NOTE_LABEL = { tip: 'noteTip', warn: 'noteWarn', key: 'noteKey', myth: 'noteMyth' };

function sourceTag(b, ctx) {
  if (!b.src?.length || !ctx.sourceLabel) return null;
  return el('p', { class: 'block-src' }, `${t('source', null, ctx.lang)}: `, b.src.map(ctx.sourceLabel).join(' · '));
}

function block(b, ctx) {
  switch (b.type) {
    case 'p': return el('p', {}, inline(b.text, ctx));
    case 'list': {
      const tag = b.ordered ? 'ol' : 'ul';
      return el(tag, {}, b.items.map(i => el('li', {}, inline(i, ctx))));
    }
    case 'keyval':
      // Each pair in its own <div> (valid inside <dl>; display: contents in the
      // stylesheet keeps the grid) so a pair can be marked as one block.
      return el('dl', { class: 'keyval' }, b.rows.map(r => el('div', { class: 'keyval-row' }, el('dt', {}, inline(r.k, ctx)), el('dd', {}, inline(r.v, ctx)))));
    case 'table':
      return el('figure', { class: 'table-wrap' },
        b.caption ? el('figcaption', {}, inline(b.caption, ctx)) : null,
        el('div', { class: 'table-scroll', tabindex: '0' },
          el('table', {},
            el('thead', {}, el('tr', {}, b.headers.map(h => el('th', { scope: 'col' }, inline(h, ctx))))),
            el('tbody', {}, b.rows.map(r => el('tr', {}, r.map(c => el('td', {}, inline(c, ctx)))))))));
    case 'note':
      return el('aside', { class: `note note-${b.kind}` },
        el('p', { class: 'note-label' }, t(NOTE_LABEL[b.kind] ?? 'noteKey', null, ctx.lang)),
        el('p', {}, inline(b.text, ctx)));
    case 'figure':
      return el('figure', { class: 'figure' },
        el('img', { src: b.src, alt: pick(b.alt ?? b.caption, ctx.lang), loading: 'lazy' }),
        b.caption ? el('figcaption', {}, inline(b.caption, ctx)) : null);
    case 'chart': return ctx.renderChart?.(b.chart, ctx) ?? null;
    case 'widget':
    case 'map': {
      const host = el('div', { class: `widget widget-${b.type}`, 'data-widget': b.id });
      ctx.mountWidget?.(host, b.id, { lang: ctx.lang, opts: b.opts ?? {} });
      return host;
    }
    case 'dataset': {
      const host = el('div', { class: 'dataset-host' });
      ctx.renderDataset?.(host, b.id, ctx);
      return host;
    }
    default:
      console.warn('[content] unknown block type', b.type);
      return null;
  }
}

/* What a reader can mark, bookmark or have read aloud (reader.js), in
   reading order within a section. */
const UNITS = ':scope > p[data-blk], :scope > ul[data-blk] > li, :scope > ol[data-blk] > li, '
  + ':scope > dl[data-blk] > .keyval-row, :scope > aside[data-blk], :scope > figure[data-blk] tbody tr';

export function renderSections(chapter, ctx) {
  const frag = document.createDocumentFragment();
  for (const sec of chapter.sections) {
    const body = sec.blocks.map((b, i) => {
      const node = block(b, ctx);
      // Section id + block index: where marks made before 1.2.0 were anchored.
      if (node && MARKABLE.has(b.type)) node.dataset.blk = `${sec.id}:${i}`;
      const src = ['chart', 'widget', 'map', 'dataset'].includes(b.type) ? null : sourceTag(b, ctx);
      return src && node ? [node, src] : node;
    }).flat().filter(Boolean);
    if (sec.level === 'advanced') {
      frag.append(el('details', { class: 'section advanced', id: sec.id },
        el('summary', {}, el('span', { class: 'adv-tag' }, t('advanced', null, ctx.lang)), ' ', inline(sec.heading, ctx)),
        ...body));
    } else {
      frag.append(el('section', { class: 'section', id: sec.id }, el('h2', {}, inline(sec.heading, ctx)), ...body));
    }
  }
  // Each markable block gets a key that is the same in every language:
  // chapter, section, place in the section.
  for (const sec of frag.children) {
    sec.querySelectorAll(UNITS).forEach((u, i) => { u.dataset.rk = `${chapter.id}/${sec.id}#${i}`; });
  }
  return frag;
}
