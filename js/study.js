/* The reader's own study layer: favourite chapters, bookmarked sections,
   highlights and underlines (each optionally carrying a note), and a free
   note per chapter.

   Owns its storage and nothing else — no DOM. Everything stays on this
   device (localStorage), so it works offline; if storage is unavailable it
   runs in memory and forgets on reload, like prefs.js.

   A mark is anchored to one rendered block of one chapter in one language:
   { id, ch, lang, blk: 's3:2', start, end, text, style, note, at }
   start/end are character offsets into that block's text. `text` is kept
   so a mark whose wording has since changed can be detected and dropped. */

const KEY = 'pphys.study.v1';
export const STYLES = ['yellow', 'green', 'pink', 'blue', 'underline'];

const EMPTY = () => ({ fav: {}, bm: {}, marks: [], notes: {} });
let state = EMPTY();
let store = null;
const listeners = new Set();

const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
const str = (v, max = 4000) => (typeof v === 'string' ? v.slice(0, max) : '');

function sanitiseMark(m) {
  if (!isObj(m)) return null;
  const start = Number(m.start), end = Number(m.end);
  if (!/^ch\d\d$/.test(m.ch) || !['zh', 'en', 'ms'].includes(m.lang) || typeof m.blk !== 'string') return null;
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start) return null;
  return {
    id: str(m.id, 40) || newId(), ch: m.ch, lang: m.lang, blk: m.blk.slice(0, 40), start, end,
    text: str(m.text, 2000), style: STYLES.includes(m.style) ? m.style : 'yellow',
    note: str(m.note), at: Number.isFinite(m.at) ? m.at : 0,
  };
}

export function sanitise(raw) {
  const d = EMPTY();
  if (!isObj(raw)) return d;
  if (isObj(raw.fav)) for (const [k, v] of Object.entries(raw.fav)) if (/^ch\d\d$/.test(k) && Number.isFinite(v)) d.fav[k] = v;
  if (isObj(raw.bm)) for (const [k, v] of Object.entries(raw.bm)) if (/^ch\d\d\/s\d+$/.test(k) && Number.isFinite(v)) d.bm[k] = v;
  if (Array.isArray(raw.marks)) d.marks = raw.marks.map(sanitiseMark).filter(Boolean);
  if (isObj(raw.notes)) for (const [k, v] of Object.entries(raw.notes)) if (/^ch\d\d$/.test(k) && typeof v === 'string' && v.trim()) d.notes[k] = v.slice(0, 20000);
  return d;
}

function load() { try { return JSON.parse(store?.getItem(KEY) || '{}'); } catch { return {}; } }
function save() { try { store?.setItem(KEY, JSON.stringify(state)); } catch { /* not persisted */ } }
function change(what) { save(); for (const fn of listeners) fn(what); }

let seq = 0;
function newId() { return `m${Date.now().toString(36)}${(seq++).toString(36)}`; }

export function init(storage = globalThis.localStorage) {
  store = storage ?? null;
  state = sanitise(load());
  return get();
}
export const get = () => JSON.parse(JSON.stringify(state));
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

/* Favourites (whole chapters) */
export const isFav = ch => ch in state.fav;
export function toggleFav(ch, now = Date.now()) {
  if (isFav(ch)) delete state.fav[ch]; else state.fav[ch] = now;
  change('fav');
  return isFav(ch);
}

/* Bookmarks (sections) */
export const bmKey = (ch, sec) => `${ch}/${sec}`;
export const isBookmarked = (ch, sec) => bmKey(ch, sec) in state.bm;
export function toggleBookmark(ch, sec, now = Date.now()) {
  const k = bmKey(ch, sec);
  if (k in state.bm) delete state.bm[k]; else state.bm[k] = now;
  change('bm');
  return k in state.bm;
}

/* Marks */
const overlaps = (a, b) => a.ch === b.ch && a.lang === b.lang && a.blk === b.blk && a.start < b.end && b.start < a.end;

// A new mark replaces any it overlaps in the same block, so marks never nest.
export function addMark(m, now = Date.now()) {
  const mark = sanitiseMark({ ...m, id: newId(), at: now });
  if (!mark) return null;
  const notes = state.marks.filter(x => overlaps(x, mark) && x.note).map(x => x.note);
  if (notes.length && !mark.note) mark.note = notes.join('\n');
  state.marks = state.marks.filter(x => !overlaps(x, mark)).concat(mark);
  change('marks');
  return mark.id;
}
export function updateMark(id, patch) {
  const m = state.marks.find(x => x.id === id);
  if (!m) return false;
  if (patch.style && STYLES.includes(patch.style)) m.style = patch.style;
  if (typeof patch.note === 'string') m.note = patch.note.slice(0, 4000);
  change('marks');
  return true;
}
export function removeMark(id) {
  const n = state.marks.length;
  state.marks = state.marks.filter(x => x.id !== id);
  if (state.marks.length !== n) change('marks');
}
export const marksFor = (ch, lang) => state.marks.filter(m => m.ch === ch && m.lang === lang).map(m => ({ ...m }));
export const markById = id => { const m = state.marks.find(x => x.id === id); return m ? { ...m } : null; };

/* Chapter notes */
export const chapterNote = ch => state.notes[ch] ?? '';
export function setChapterNote(ch, text) {
  const t = String(text ?? '');
  if (t.trim()) state.notes[ch] = t.slice(0, 20000); else delete state.notes[ch];
  change('notes');
}

export function isEmpty() {
  return !Object.keys(state.fav).length && !Object.keys(state.bm).length && !state.marks.length && !Object.keys(state.notes).length;
}

/* Plain-text export, grouped by chapter. `label(ch)` and `secLabel(ch, sec)`
   give display titles in the reader's language. */
export function exportText({ chapters, label, secLabel, headings }) {
  const out = [];
  for (const ch of chapters) {
    const fav = isFav(ch);
    const bms = Object.keys(state.bm).filter(k => k.startsWith(`${ch}/`)).sort();
    const marks = state.marks.filter(m => m.ch === ch).sort((a, b) => a.blk.localeCompare(b.blk, 'en', { numeric: true }) || a.start - b.start);
    const note = state.notes[ch];
    if (!fav && !bms.length && !marks.length && !note) continue;
    out.push(`## ${label(ch)}${fav ? ' ★' : ''}`);
    for (const k of bms) out.push(`🔖 ${secLabel(ch, k.split('/')[1])}`);
    for (const m of marks) {
      out.push(`${m.style === 'underline' ? '＿' : '▍'} “${m.text}”`);
      if (m.note) out.push(`   ✎ ${m.note}`);
    }
    if (note) out.push(`${headings.note}: ${note}`);
    out.push('');
  }
  return out.join('\n').trim();
}
