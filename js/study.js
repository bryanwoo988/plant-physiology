/* The reader's own study layer: favourite chapters and a free note per
   chapter. Highlights, underlines, notes on passages and bookmarks live in
   reader.js (shared with OPWiki and Oil Palm Basics).

   Owns its storage and nothing else — no DOM. Everything stays on this
   device (localStorage), so it works offline; if storage is unavailable it
   runs in memory and forgets on reload, like prefs.js.

   Before 1.2.0 this layer also kept word marks and section bookmarks:
     marks: [{ id, ch, lang, blk: 's3:2', start, end, text, style, note, at }]
     bm:    { 'ch03/s2': time }
   They stay in storage until legacy() has handed them to reader.js and
   dropLegacy() is called. */

const KEY = 'pphys.study.v1';
const STYLES = ['yellow', 'green', 'pink', 'blue', 'underline'];

const EMPTY = () => ({ fav: {}, notes: {}, marks: [], bm: {} });
let state = EMPTY();
let store = null;

const isObj = v => v && typeof v === 'object' && !Array.isArray(v);

function sanitiseMark(m) {
  if (!isObj(m)) return null;
  const start = Number(m.start), end = Number(m.end);
  if (!/^ch\d\d$/.test(m.ch) || !['zh', 'en', 'ms'].includes(m.lang) || typeof m.blk !== 'string') return null;
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start) return null;
  if (typeof m.text !== 'string' || !m.text.trim()) return null;
  return {
    ch: m.ch, lang: m.lang, blk: m.blk.slice(0, 40), start, end, text: m.text.slice(0, 4000),
    style: STYLES.includes(m.style) ? m.style : 'yellow',
    note: typeof m.note === 'string' ? m.note.slice(0, 4000) : '', at: Number.isFinite(m.at) ? m.at : 0,
  };
}

export function sanitise(raw) {
  const d = EMPTY();
  if (!isObj(raw)) return d;
  if (isObj(raw.fav)) for (const [k, v] of Object.entries(raw.fav)) if (/^ch\d\d$/.test(k) && Number.isFinite(v)) d.fav[k] = v;
  if (isObj(raw.notes)) for (const [k, v] of Object.entries(raw.notes)) if (/^ch\d\d$/.test(k) && typeof v === 'string' && v.trim()) d.notes[k] = v.slice(0, 20000);
  if (Array.isArray(raw.marks)) d.marks = raw.marks.map(sanitiseMark).filter(Boolean);
  if (isObj(raw.bm)) for (const [k, v] of Object.entries(raw.bm)) if (/^ch\d\d\/s\d+$/.test(k) && Number.isFinite(v)) d.bm[k] = v;
  return d;
}

function load() { try { return JSON.parse(store?.getItem(KEY) || '{}'); } catch { return {}; } }
function save() { try { store?.setItem(KEY, JSON.stringify(state)); } catch { /* not persisted */ } }

export function init(storage = globalThis.localStorage) {
  store = storage ?? null;
  state = sanitise(load());
  return get();
}
export const get = () => JSON.parse(JSON.stringify({ fav: state.fav, notes: state.notes }));

/* Favourites (whole chapters) */
export const isFav = ch => ch in state.fav;
export function toggleFav(ch, now = Date.now()) {
  if (isFav(ch)) delete state.fav[ch]; else state.fav[ch] = now;
  save();
  return isFav(ch);
}

/* Chapter notes */
export const chapterNote = ch => state.notes[ch] ?? '';
export function setChapterNote(ch, text) {
  const t = String(text ?? '');
  if (t.trim()) state.notes[ch] = t.slice(0, 20000); else delete state.notes[ch];
  save();
}

/* Marks and section bookmarks from before 1.2.0, still waiting to move. */
export const legacy = () => JSON.parse(JSON.stringify({ marks: state.marks, bm: state.bm }));
export function dropLegacy() {
  if (!state.marks.length && !Object.keys(state.bm).length) return;
  // Kept aside, untouched, in case a mark could not be placed.
  try { store?.setItem(`${KEY}.before-1.2`, JSON.stringify({ marks: state.marks, bm: state.bm })); } catch { /* ignore */ }
  state.marks = [];
  state.bm = {};
  save();
}
