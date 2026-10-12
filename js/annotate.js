/* Highlighting, underlining and notes on chapter text — the DOM side of
   study.js.

   Every teaching block a chapter renders carries data-blk="<section>:<n>"
   (content.js). A mark is stored as character offsets into one block's
   text, so it survives re-renders; marks are only drawn in the language
   they were made in, since the words differ between languages.

   Selecting text inside a chapter brings up a bar at the bottom of the
   screen (where it cannot fight the phone's own copy/paste menu); tapping
   an existing mark brings up the same bar to recolour, annotate or remove
   it. */

import * as study from './study.js';
import { t } from './i18n.js';
import { el } from './content.js';

const COLOURS = ['yellow', 'green', 'pink', 'blue'];

function textNodes(root) {
  const out = [];
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) out.push(n);
  return out;
}

// Character offset of (node, offset) within block's text.
function offsetIn(block, node, offset) {
  if (node.nodeType !== Node.TEXT_NODE) {
    // Selection boundary on an element: convert to the text position before child[offset].
    const before = document.createRange();
    before.setStart(block, 0);
    before.setEnd(node, offset);
    return before.toString().length;
  }
  let n = 0;
  for (const tn of textNodes(block)) {
    if (tn === node) return n + offset;
    n += tn.length;
  }
  return n;
}

export const blockText = block => textNodes(block).map(n => n.data).join('');

/* Wrap [start, end) of a block's text in <mark> elements (one per text node
   crossed), all sharing data-mark. */
function wrap(block, m) {
  let pos = 0;
  const parts = [];
  for (const tn of textNodes(block)) {
    const a = pos, b = pos + tn.length;
    pos = b;
    if (b <= m.start || a >= m.end) continue;
    let node = tn;
    const s = Math.max(m.start - a, 0), e = Math.min(m.end - a, tn.length);
    if (e < node.length) node.splitText(e);
    if (s > 0) node = node.splitText(s);
    parts.push(node);
  }
  parts.forEach((node, i) => {
    const mk = el('mark', { class: `hl hl-${m.style}${m.note && i === parts.length - 1 ? ' has-note' : ''}`, 'data-mark': m.id, tabindex: i === 0 ? '0' : null });
    node.parentNode.insertBefore(mk, node);
    mk.append(node);
  });
}

export function clearMarks(root) {
  for (const mk of root.querySelectorAll('mark.hl')) {
    const parent = mk.parentNode;
    while (mk.firstChild) parent.insertBefore(mk.firstChild, mk);
    mk.remove();
    parent.normalize();
  }
}

export function applyMarks(root, ch, lang) {
  clearMarks(root);
  for (const m of study.marksFor(ch, lang)) {
    const block = root.querySelector(`[data-blk="${m.blk}"]`);
    if (!block) continue;
    // The wording changed since the mark was made: skip rather than mark the wrong words.
    if (blockText(block).slice(m.start, m.end) !== m.text) continue;
    wrap(block, m);
  }
}

/* ---------- The bar ---------- */
let bar = null, ctx = null, pending = null, editing = null;

function button(cls, label, onClick, extra = {}) {
  const b = el('button', { type: 'button', class: `mb-btn ${cls}`, 'aria-label': label, title: label, ...extra });
  // pointerdown would otherwise collapse the selection before click fires.
  b.addEventListener('pointerdown', e => e.preventDefault());
  b.addEventListener('mousedown', e => e.preventDefault());
  b.addEventListener('click', onClick);
  return b;
}

function buildBar() {
  bar = el('div', { id: 'markbar', class: 'markbar', role: 'toolbar', hidden: true });
  document.body.append(bar);
}

function paintBar() {
  const lang = ctx.lang;
  const tr = k => t(k, null, lang);
  const pick = style => () => (editing ? restyle(style) : create(style));
  bar.replaceChildren(
    ...COLOURS.map(c => button(`mb-swatch mb-${c}`, `${tr('highlight')} · ${tr(`colour_${c}`)}`, pick(c))),
    button('mb-underline', tr('underline'), pick('underline'), {}),
    button('mb-note', editing ? tr('editNote') : tr('addNote'), () => (editing ? noteFor(editing) : create('yellow', true))),
    editing ? button('mb-delete', tr('removeMark'), () => { study.removeMark(editing); hide(); }) : null,
    button('mb-close', tr('close'), hide));
  bar.querySelector('.mb-underline').textContent = 'U';
  bar.querySelector('.mb-note').textContent = '✎';
  bar.querySelector('.mb-close').textContent = '×';
  const del = bar.querySelector('.mb-delete');
  if (del) del.textContent = '🗑';
}

function show() { paintBar(); bar.hidden = false; document.body.classList.add('markbar-open'); }
function hide() {
  if (!bar) return;
  bar.hidden = true; pending = null; editing = null;
  document.body.classList.remove('markbar-open');
}

function create(style, withNote = false) {
  if (!pending) return hide();
  const id = study.addMark({ ...pending, style });
  getSelection()?.removeAllRanges();
  hide();
  if (withNote && id) noteFor(id);
}
function restyle(style) { study.updateMark(editing, { style }); hide(); }

function noteFor(id) {
  const m = study.markById(id);
  if (!m) return;
  const lang = ctx.lang;
  const area = el('textarea', { class: 'field note-area', rows: '5', placeholder: t('notePlaceholder', null, lang) });
  area.value = m.note;
  const save = el('button', { type: 'button', class: 'button', onclick: () => { study.updateMark(id, { note: area.value }); ctx.closeSheet(); } }, t('save', null, lang));
  ctx.openSheet(el('div', { class: 'note-sheet' },
    el('p', { class: 'kicker' }, t('noteOnMark', null, lang)),
    el('blockquote', { class: `note-quote hl-${m.style}` }, m.text),
    area,
    el('div', { class: 'fc-nav' }, save)));
  hide();
  setTimeout(() => area.focus(), 50);
}

function onSelection() {
  if (!ctx) return;
  const sel = getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) { if (!editing) hide(); return; }
  const range = sel.getRangeAt(0);
  const startBlk = (range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement)?.closest('[data-blk]');
  if (!startBlk || !ctx.root.contains(startBlk)) { hide(); return; }
  const endBlk = (range.endContainer.nodeType === 1 ? range.endContainer : range.endContainer.parentElement)?.closest('[data-blk]');
  const start = offsetIn(startBlk, range.startContainer, range.startOffset);
  // A selection running into the next block is clipped to the end of this one.
  const end = endBlk === startBlk ? offsetIn(startBlk, range.endContainer, range.endOffset) : blockText(startBlk).length;
  const text = blockText(startBlk).slice(start, end);
  if (!text.trim() || end <= start) { hide(); return; }
  editing = null;
  pending = { ch: ctx.ch, lang: ctx.lang, blk: startBlk.dataset.blk, start, end, text };
  show();
}

let timer = 0;
const onSelectionSoon = () => { clearTimeout(timer); timer = setTimeout(onSelection, 180); };

function onClick(e) {
  if (!ctx) return;
  const mk = e.target.closest?.('mark.hl');
  if (!mk || !ctx.root.contains(mk)) return;
  if (!getSelection()?.isCollapsed) return;
  if (e.target.closest('button')) return;   // a glossary term inside a mark keeps its own tap
  editing = mk.dataset.mark;
  pending = null;
  show();
}

let wired = false;
/* Called by app.js each time a chapter is rendered. */
export function attach({ root, ch, lang, openSheet, closeSheet }) {
  if (!bar) buildBar();
  ctx = { root, ch, lang, openSheet, closeSheet };
  hide();
  applyMarks(root, ch, lang);
  if (!wired) {
    document.addEventListener('selectionchange', onSelectionSoon);
    document.addEventListener('click', onClick);
    study.subscribe(what => { if (what === 'marks' && ctx?.root.isConnected) applyMarks(ctx.root, ctx.ch, ctx.lang); });
    wired = true;
  }
}

export function detach() { ctx = null; hide(); }
