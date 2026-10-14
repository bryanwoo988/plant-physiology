/* One-off move of marks and section bookmarks made before 1.2.0 into
   reader.js storage, so nothing a reader saved is lost with the new tools.

   Old marks were character offsets into a whole block (a list, a note box),
   counted in annotate.js's own way. reader.js keeps offsets into one
   paragraph, list item, table row or pair (data-rk). So each old mark is
   turned back into a DOM range in the chapter as it renders today, then
   measured again unit by unit. A mark whose words are gone is left out, as
   annotate.js already did. A section bookmark becomes a bookmark on the
   section's first block.

   Runs before Reader.init, which reads the storage this writes. */

const COLOUR = { yellow: 'yellow', green: 'green', pink: 'pink', blue: 'blue' };

let seq = 0;
const newId = () => Date.now().toString(36) + (seq++).toString(36) + Math.random().toString(36).slice(2, 5);

/* The old text model (annotate.js): a block's text nodes in order, with a
   "\n" wherever it moves to a new list item, table cell or definition, and
   the label of a note box left out. */
const CELL = 'li, dt, dd, th, td, figcaption, p';
function segments(block) {
  const segs = [];
  let text = '', lastCell = null;
  const w = block.ownerDocument.createTreeWalker(block, 4 /* SHOW_TEXT */);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    if (n.parentElement.closest('.note-label')) continue;
    let cell = n.parentElement.closest(CELL);
    if (!cell || !block.contains(cell)) cell = block;
    if (segs.length && cell !== lastCell) text += '\n';
    segs.push({ node: n, at: text.length });
    text += n.data;
    lastCell = cell;
  }
  return { segs, text };
}

// Where the old mark's words sit in the block now: its stored place, else the nearest copy.
function locate(text, m) {
  if (text.slice(m.start, m.end) === m.text) return m.start;
  let best = -1;
  for (let i = text.indexOf(m.text); i >= 0; i = text.indexOf(m.text, i + 1)) {
    if (best < 0 || Math.abs(i - m.start) < Math.abs(best - m.start)) best = i;
  }
  return best;
}

// Offset of (node, off) within unit u, counted the way reader.js counts.
function offsetIn(u, node, off) {
  const r = u.ownerDocument.createRange();
  r.setStart(u, 0);
  r.setEnd(node, off);
  return r.toString().length;
}

/* The pieces of an old mark, one per unit it covers: [{ u, s, e, q }], or
   null when its words are no longer in the block. */
export function place(block, m) {
  const { segs, text } = segments(block);
  const start = locate(text, m);
  if (start < 0) return null;
  const end = start + m.text.length;
  // Old offsets → DOM points. "\n" is not in any text node, so a point there
  // snaps to the next node.
  const point = (pos, isEnd) => {
    for (const x of segs) {
      const a = x.at, b = x.at + x.node.length;
      if (isEnd ? pos > a && pos <= b : pos >= a && pos < b) return [x.node, pos - a];
    }
    return null;
  };
  const from = point(start, false), to = point(end, true);
  if (!from || !to) return null;
  const range = block.ownerDocument.createRange();
  range.setStart(...from);
  range.setEnd(...to);
  const units = block.matches('[data-rk]') ? [block] : [...block.querySelectorAll('[data-rk]')];
  const out = [];
  for (const u of units) {
    if (!range.intersectsNode(u)) continue;
    const s = u.contains(range.startContainer) ? offsetIn(u, range.startContainer, range.startOffset) : 0;
    const e = u.contains(range.endContainer) ? offsetIn(u, range.endContainer, range.endOffset) : u.textContent.length;
    const q = u.textContent.slice(s, e);
    if (e > s && q.trim()) out.push({ u, s, e, q });
  }
  return out.length ? out : null;
}

/* legacy: { marks, bm } from study.legacy()
   chapter(id, lang): Promise<Element> — the chapter rendered off screen
   where(unitEl): location label, as given to Reader.init
   lang: the reader's language, for section bookmarks */
export async function migrate({ legacy, chapter, where, lang, storage = globalThis.localStorage, key = 'pphys.reader' }) {
  const { marks, bm } = legacy;
  const bms = Object.entries(bm);
  if (!marks.length && !bms.length) return { moved: 0, lost: 0 };

  let data = {};
  try { data = JSON.parse(storage.getItem(key) || '{}') || {}; } catch { data = {}; }
  for (const bag of ['marks', 'notes', 'bookmarks', 'ranges', 'rnotes']) data[bag] = data[bag] || {};

  const rendered = new Map();
  const host = (ch, l) => {
    const k = `${ch}:${l}`;
    if (!rendered.has(k)) rendered.set(k, chapter(ch, l).catch(() => null));
    return rendered.get(k);
  };

  let moved = 0, lost = 0;
  for (const m of marks) {
    const root = await host(m.ch, m.lang);
    const block = root?.querySelector(`[data-blk="${m.blk}"]`);
    const parts = block ? place(block, m) : null;
    if (!parts) { lost++; continue; }
    const g = newId(), t = m.at || Date.now();
    parts.forEach((p, i) => {
      data.ranges[newId()] = {
        k: p.u.dataset.rk, lang: m.lang, s: p.s, e: p.e, q: p.q, w: where(p.u),
        g, last: i === parts.length - 1, t: t + i,
        ...(m.style === 'underline' ? { ul: 'pink' } : { hl: COLOUR[m.style] || 'yellow' }),
      };
    });
    if (m.note && m.note.trim()) data.rnotes[g] = { text: m.note.trim(), t };
    moved++;
  }

  for (const [k, t] of bms) {
    const [ch, sec] = k.split('/');
    const root = await host(ch, lang);
    const u = root?.querySelector(`#${sec} [data-rk]`);
    if (!u) { lost++; continue; }
    if (!data.bookmarks[u.dataset.rk]) {
      data.bookmarks[u.dataset.rk] = { t, q: u.textContent.replace(/\s+/g, ' ').trim().slice(0, 240), w: where(u) };
    }
    moved++;
  }

  try { storage.setItem(key, JSON.stringify(data)); } catch { return { moved: 0, lost: marks.length + bms.length }; }
  return { moved, lost };
}
