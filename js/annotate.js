/* Highlighting, underlining and notes on chapter text — the DOM side of
   study.js.

   Every teaching block a chapter renders carries data-blk="<section>:<n>"
   (content.js). A mark is stored as character offsets into one block's
   text, so it survives re-renders; marks are only drawn in the language
   they were made in, since the words differ between languages.

   A block's text is its text nodes in order, with a "\n" wherever it moves
   to a new list item, table cell or definition, so a mark that spans two
   items does not read as one run-on word. The label of a note box ("Key
   point") is not part of the text and cannot be marked.

   Selecting text inside a chapter brings up a bar at the bottom of the
   screen (where it cannot fight the phone's own copy/paste menu). The bar
   shows which colour already covers the selection; tapping that colour
   again, or the bin, removes the marking from just the selected words.
   Tapping an existing mark brings up the same bar for that whole mark. */

import * as study from './study.js';
import { t } from './i18n.js';
import { el } from './content.js';

const COLOURS = ['yellow', 'green', 'pink', 'blue'];
const CELL = 'li, dt, dd, th, td, figcaption, p';
const SKIP = '.note-label';
const MAX = 4000;

/* ---------- The text model ---------- */
export function segments(block) {
  const segs = [];
  let text = '', lastCell = null;
  const w = document.createTreeWalker(block, NodeFilter.SHOW_TEXT,
    { acceptNode: n => (n.parentElement?.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    let cell = n.parentElement.closest(CELL);
    if (!cell || !block.contains(cell)) cell = block;
    if (segs.length && cell !== lastCell) text += '\n';
    segs.push({ node: n, at: text.length });
    text += n.data;
    lastCell = cell;
  }
  return { segs, text };
}

export const blockText = block => segments(block).text;

// Character offset of the boundary point (node, offset) in the block's text.
function offsetIn(block, node, offset) {
  const { segs, text } = segments(block);
  const own = segs.find(x => x.node === node);
  if (own) return own.at + Math.min(offset, node.length);
  const r = document.createRange();
  r.setStart(node, offset);
  for (const x of segs) if (r.comparePoint(x.node, 0) >= 0) return x.at;
  return text.length;
}

/* Wrap [start, end) of a block's text in <mark> elements (one per text node
   crossed), all sharing data-mark. */
function wrap(block, m) {
  const parts = [];
  for (const { node: tn, at } of segments(block).segs) {
    const a = at, b = at + tn.length;
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
  const parents = new Set();
  for (const mk of root.querySelectorAll('mark.hl')) {
    const parent = mk.parentNode;
    while (mk.firstChild) parent.insertBefore(mk.firstChild, mk);
    mk.remove();
    parents.add(parent);
  }
  for (const p of parents) p.normalize();
}

// Where m.text now sits in this text: its stored place, else the nearest copy.
function locate(text, m) {
  if (text.slice(m.start, m.end) === m.text) return m.start;
  let best = -1;
  for (let i = text.indexOf(m.text); i >= 0; i = text.indexOf(m.text, i + 1)) {
    if (best < 0 || Math.abs(i - m.start) < Math.abs(best - m.start)) best = i;
  }
  return best;
}

export function applyMarks(root, ch, lang) {
  clearMarks(root);
  for (const m of study.marksFor(ch, lang)) {
    const block = root.querySelector(`[data-blk="${m.blk}"]`);
    if (!block || !m.text) continue;
    // The wording changed since the mark was made: follow the words, or skip
    // rather than mark the wrong ones.
    const at = locate(blockText(block), m);
    if (at < 0) continue;
    if (at !== m.start) study.moveMark(m.id, at, at + m.text.length);
    wrap(block, { ...m, start: at, end: at + m.text.length });
  }
}

/* ---------- The bar ---------- */
let bar = null, ctx = null, pending = null, editing = null;

function button(cls, label, onClick, pressed = null) {
  const b = el('button', { type: 'button', class: `mb-btn ${cls}`, 'aria-label': label, title: label, 'aria-pressed': pressed == null ? null : String(pressed) });
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

// The style already covering what the bar acts on, and whether anything is marked there.
function current() {
  if (editing) { const m = study.markById(editing); return { style: m?.style ?? null, any: !!m }; }
  if (!pending) return { style: null, any: false };
  const u = study.under(pending, pending.start, pending.end, pending.text);
  return { style: u.style, any: u.marks.length > 0 };
}

function paintBar() {
  const tr = k => t(k, null, ctx.lang);
  const { style: on, any } = current();
  const styleBtn = (cls, style, label, text) => {
    const b = button(cls, on === style ? tr('removeMark') : label, () => (on === style ? erase() : apply(style)), on === style);
    if (text) b.textContent = text;
    return b;
  };
  bar.replaceChildren(
    ...COLOURS.map(c => styleBtn(`mb-swatch mb-${c}`, c, `${tr('highlight')} · ${tr(`colour_${c}`)}`)),
    styleBtn('mb-underline', 'underline', tr('underline'), 'U'),
    button('mb-note', tr(noteTarget() && study.markById(noteTarget())?.note ? 'editNote' : 'addNote'), note),
    any ? button('mb-delete', tr('removeMark'), erase) : null,
    button('mb-close', tr('close'), hide));
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
function done() { getSelection()?.removeAllRanges(); hide(); }

function apply(style) {
  if (editing) { study.updateMark(editing, { style }); return hide(); }
  if (pending) study.addMark({ ...pending, style });
  done();
}

function erase() {
  if (editing) study.removeMark(editing);
  else if (pending) study.eraseRange(pending, pending.start, pending.end);
  done();
}

// The mark a note goes on: the tapped one, or the one mark wholly holding the selection.
function noteTarget() {
  if (editing) return editing;
  if (!pending) return null;
  const { marks } = study.under(pending, pending.start, pending.end, pending.text);
  return marks.length === 1 && marks[0].start <= pending.start && marks[0].end >= pending.end ? marks[0].id : null;
}

function note() {
  let id = noteTarget();
  if (!id && pending) id = study.addMark({ ...pending, style: 'yellow' });
  getSelection()?.removeAllRanges();
  hide();
  if (id) noteFor(id);
}

function noteFor(id) {
  const m = study.markById(id);
  if (!m) return;
  const lang = ctx.lang;
  const area = el('textarea', { class: 'field note-area', rows: '5', placeholder: t('notePlaceholder', null, lang), 'aria-label': t('noteOnMark', null, lang) });
  area.value = m.note;
  const save = el('button', { type: 'button', class: 'button', onclick: () => { study.updateMark(id, { note: area.value }); ctx.closeSheet(); } }, t('save', null, lang));
  ctx.openSheet(el('div', { class: 'note-sheet' },
    el('p', { class: 'kicker' }, t('noteOnMark', null, lang)),
    el('blockquote', { class: `note-quote hl-${m.style}` }, m.text),
    area,
    el('div', { class: 'fc-nav' }, save)));
  setTimeout(() => area.focus(), 50);
}

const blockOf = node => (node?.nodeType === 1 ? node : node?.parentElement)?.closest('[data-blk]');

function onSelection() {
  if (!ctx) return;
  const sel = getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) { if (!editing) hide(); return; }
  const range = sel.getRangeAt(0);
  const startBlk = blockOf(range.startContainer), endBlk = blockOf(range.endContainer);
  // A selection crossing blocks is clipped to the first block it marks.
  const blk = startBlk && ctx.root.contains(startBlk) ? startBlk : endBlk && ctx.root.contains(endBlk) ? endBlk : null;
  if (!blk) { hide(); return; }
  const full = blockText(blk);
  let start = blk === startBlk ? offsetIn(blk, range.startContainer, range.startOffset) : 0;
  let end = blk === endBlk ? offsetIn(blk, range.endContainer, range.endOffset) : full.length;
  end = Math.min(end, start + MAX);
  // Leave out edge spaces and line breaks, so a double-click or a drag past
  // the end of a line marks only the words.
  while (start < end && /\s/.test(full[start])) start++;
  while (end > start && /\s/.test(full[end - 1])) end--;
  if (end <= start) { hide(); return; }
  editing = null;
  pending = { ch: ctx.ch, lang: ctx.lang, blk: blk.dataset.blk, start, end, text: full.slice(start, end) };
  show();
}

let timer = 0;
const onSelectionSoon = () => { clearTimeout(timer); timer = setTimeout(onSelection, 180); };

function openMark(mk) {
  editing = mk.dataset.mark;
  pending = null;
  show();
}

function onClick(e) {
  if (!ctx) return;
  const mk = e.target.closest?.('mark.hl');
  if (!mk || !ctx.root.contains(mk)) return;
  if (!getSelection()?.isCollapsed) return;
  if (e.target.closest('button')) return;   // a glossary term inside a mark keeps its own tap
  openMark(mk);
}

function onKey(e) {
  if (!ctx) return;
  if (e.key === 'Escape' && bar && !bar.hidden) { hide(); return; }
  const mk = e.target.closest?.('mark.hl');
  if (mk && ctx.root.contains(mk) && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openMark(mk); }
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
    document.addEventListener('keydown', onKey);
    study.subscribe(what => { if (what === 'marks' && ctx?.root.isConnected) applyMarks(ctx.root, ctx.ch, ctx.lang); });
    wired = true;
  }
}

export function detach() { ctx = null; hide(); }
