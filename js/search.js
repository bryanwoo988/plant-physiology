/* Search across all three languages at once.

   A Malay reader who types 露点 or "dew point" still finds the dew-point
   section, and gets the result in Malay. Pure: built from chapter JSON and
   the glossary, no DOM. */

const LANGS = ['zh', 'en', 'ms'];
const MARK = /\{\{t:([a-z0-9-]+)(?:\|([^}]*))?\}\}/g;

export const normalise = str => String(str).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

function texts(value, lang, out = []) {
  if (Array.isArray(value)) value.forEach(v => texts(v, lang, out));
  else if (value && typeof value === 'object') {
    if (LANGS.some(l => typeof value[l] === 'string')) out.push(value[lang] ?? '');
    else for (const v of Object.values(value)) texts(v, lang, out);
  }
  return out;
}

export function buildIndex(chapters, terms) {
  const names = new Map(terms.map(t => [t.id, t.name]));
  const plain = (str, lang) => String(str).replace(MARK, (_, id, label) => label ?? names.get(id)?.[lang] ?? id);
  const entries = [];
  const cid = n => `ch${String(n).padStart(2, '0')}`;
  for (const ch of chapters) {
    for (const sec of ch.sections) {
      const e = { route: `#/ch/${ch.id}/${sec.id}`, kind: 'section', title: {}, body: {} };
      for (const l of LANGS) {
        e.title[l] = `${ch.title[l]} · ${plain(sec.heading[l], l)}`;
        e.body[l] = plain(texts(sec.blocks, l).join(' '), l);
      }
      entries.push(e);
    }
  }
  for (const t of terms) {
    const e = { route: `#/ch/${cid(t.chapter)}`, kind: 'term', title: {}, body: {} };
    for (const l of LANGS) { e.title[l] = t.name[l] + (t.abbr ? ` (${t.abbr})` : ''); e.body[l] = t.short[l]; }
    entries.push(e);
  }
  for (const e of entries) e.hay = { title: normalise(LANGS.map(l => e.title[l]).join(' ')), body: normalise(LANGS.map(l => e.body[l]).join(' ')) };
  return entries;
}

function snippet(text, words, max = 120) {
  const low = text.toLowerCase();
  const at = Math.max(0, ...words.map(w => low.indexOf(w)).filter(i => i >= 0).slice(0, 1));
  const start = Math.max(0, at - 30);
  return (start ? '…' : '') + text.slice(start, start + max) + (start + max < text.length ? '…' : '');
}

export function search(index, query, lang, limit = 40) {
  const q = normalise(query);
  if (!q) return [];
  const words = q.split(' ');
  const hits = [];
  for (const e of index) {
    const inTitle = words.every(w => e.hay.title.includes(w));
    const inAll = words.every(w => e.hay.title.includes(w) || e.hay.body.includes(w));
    if (!inAll) continue;
    const score = (inTitle ? 10 : 0) + (e.kind === 'term' ? 2 : 0);
    hits.push({ route: e.route, kind: e.kind, title: e.title[lang], snippet: snippet(e.body[lang], words), score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
