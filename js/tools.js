/* The study tools: glossary, abbreviations, concept map, flashcards,
   self-tests, the hormone comparison table and the essay-question review.
   Each export builds one page; app.js routes to them. */

import { pick, t } from './i18n.js';
import { el, loadData } from './content.js';
import { scoreQuiz, questionsFor, cardsFor } from './quiz.js';
import { s } from './widgets/kit.js';
import * as prefs from './prefs.js';

const cid = n => `ch${String(n).padStart(2, '0')}`;
const page = (title, ...kids) => el('div', { class: 'page page-tool' }, el('p', { class: 'kicker' }, el('a', { href: '#/tools' }, t('tools'))), el('h1', {}, title), ...kids);

const TOOLS = [
  ['glossary', 'glossary'], ['abbr', 'abbr'], ['map', 'conceptMap'], ['cards', 'flashcards'],
  ['quiz', 'quiz'], ['hormones', 'hormones'], ['essays', 'essays'],
];

export function toolsIndex(lang) {
  return el('div', { class: 'page' }, el('h1', {}, t('tools', null, lang)),
    el('ul', { class: 'tool-list' },
      el('li', {}, el('a', { href: '#/notes' }, t('notes', null, lang))),
      TOOLS.map(([route, key]) => el('li', {}, el('a', { href: `#/tools/${route}` }, t(key, null, lang))))));
}

/* ---------- Glossary ---------- */
function termRow(term, lang, { showAbbr = false } = {}) {
  return el('li', { class: 'gloss-item', id: `term-${term.id}` },
    el('div', { class: 'gloss-head' },
      el('span', { class: 'gloss-name' }, showAbbr && term.abbr ? term.abbr : pick(term.name, lang)),
      showAbbr && term.abbr ? el('span', { class: 'muted' }, pick(term.name, lang)) : term.abbr ? el('span', { class: 'muted' }, term.abbr) : null,
      el('a', { class: 'gloss-ch', href: `#/ch/${cid(term.chapter)}` }, t('chapterN', { n: term.chapter }, lang))),
    el('p', {}, pick(term.short, lang)));
}

export async function glossary(lang, { abbrOnly = false } = {}) {
  let terms = await loadData('terms');
  if (abbrOnly) terms = terms.filter(x => x.abbr);
  const key = x => (abbrOnly ? x.abbr : pick(x.name, lang));
  // Chinese has no alphabet order a reader would scan; keep the teaching order there.
  const sorted = [...terms].sort((a, b) => (lang === 'zh' && !abbrOnly ? a.chapter - b.chapter : key(a).localeCompare(key(b), lang)));
  const list = el('ul', { class: 'gloss-list' }, sorted.map(x => termRow(x, lang, { showAbbr: abbrOnly })));
  const filter = el('input', { type: 'search', class: 'field', placeholder: t('search', null, lang), 'aria-label': t('search', null, lang) });
  filter.addEventListener('input', () => {
    const q = filter.value.trim().toLowerCase();
    for (const li of list.children) li.hidden = q && !li.textContent.toLowerCase().includes(q);
  });
  return page(t(abbrOnly ? 'abbr' : 'glossary', null, lang), filter, terms.length ? list : el('p', { class: 'muted' }, '—'));
}

/* ---------- Concept map ---------- */
export async function conceptMap(lang, { openSheet }) {
  const terms = await loadData('terms');
  const byChapter = new Map();
  for (const x of terms) (byChapter.get(x.chapter) ?? byChapter.set(x.chapter, []).get(x.chapter)).push(x);
  const cols = [...byChapter.keys()].sort((a, b) => a - b);
  const CW = 150, RH = 34, PAD = 20;
  const W = Math.max(320, cols.length * CW + PAD * 2), H = Math.max(...cols.map(c => byChapter.get(c).length)) * RH + 60;
  const pos = new Map();
  cols.forEach((c, i) => byChapter.get(c).forEach((x, j) => pos.set(x.id, [PAD + i * CW, 50 + j * RH])));
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'cmap-svg', role: 'img', 'aria-label': t('conceptMap', null, lang) });
  cols.forEach((c, i) => svg.append(s('text', { x: PAD + i * CW, y: 24, class: 'cmap-col' }, t('chapterN', { n: c }, lang))));
  const edges = s('g', { class: 'cmap-edges' });
  const nodes = s('g', { class: 'cmap-nodes' });
  for (const x of terms) for (const to of x.see ?? []) {
    const a = pos.get(to), b = pos.get(x.id);
    if (a && b) edges.append(s('path', { d: `M${a[0] + 120},${a[1]} C${a[0] + 140},${a[1]} ${b[0] - 20},${b[1]} ${b[0]},${b[1]}`, 'data-from': to, 'data-to': x.id }));
  }
  const prereqs = id => { const out = new Set(); const walk = k => { for (const p of terms.find(x => x.id === k)?.see ?? []) if (!out.has(p)) { out.add(p); walk(p); } }; walk(id); return out; };
  for (const x of terms) {
    const [px, py] = pos.get(x.id);
    const g = s('g', { class: 'cmap-node', tabindex: '0', 'data-id': x.id, transform: `translate(${px},${py})` },
      s('rect', { x: 0, y: -13, width: 124, height: 26, rx: 13 }),
      s('text', { x: 62, y: 4, 'text-anchor': 'middle' }, pick(x.name, lang)));
    const select = () => {
      const need = prereqs(x.id);
      for (const n of nodes.children) n.classList.toggle('is-on', n.dataset.id === x.id || need.has(n.dataset.id));
      for (const e of edges.children) e.classList.toggle('is-on', need.has(e.dataset.from) && (need.has(e.dataset.to) || e.dataset.to === x.id));
      openSheet(el('div', {}, el('h3', {}, pick(x.name, lang)), el('p', {}, pick(x.short, lang)),
        el('a', { class: 'button', href: `#/ch/${cid(x.chapter)}` }, t('openChapter', null, lang))));
    };
    g.addEventListener('click', select);
    g.addEventListener('keydown', e => { if (e.key === 'Enter') select(); });
    nodes.append(g);
  }
  svg.append(edges, nodes);
  return page(t('conceptMap', null, lang), el('div', { class: 'cmap' }, svg));
}

/* ---------- Flashcards ---------- */
export async function flashcards(lang, { stage }) {
  const [terms, index] = await Promise.all([loadData('terms'), loadData('index')]);
  const n = stage || index.stages.find(st => cardsFor(terms, index.stages, st.n).length)?.n || 1;
  const cards = cardsFor(terms, index.stages, n);
  let i = 0;
  const card = el('button', { type: 'button', class: 'flashcard' });
  const counter = el('p', { class: 'muted fc-count' });
  const show = () => {
    const x = cards[i];
    card.classList.remove('is-flipped');
    card.replaceChildren(el('span', { class: 'fc-front' }, pick(x.name, lang)), el('span', { class: 'fc-back' }, pick(x.short, lang)));
    counter.textContent = `${i + 1} / ${cards.length}`;
  };
  card.addEventListener('click', () => card.classList.toggle('is-flipped'));
  const nav = el('div', { class: 'fc-nav' },
    el('button', { type: 'button', class: 'button button-quiet', onclick: () => { i = (i - 1 + cards.length) % cards.length; show(); } }, t('prev', null, lang)),
    el('button', { type: 'button', class: 'button', onclick: () => { i = (i + 1) % cards.length; show(); } }, t('next', null, lang)));
  const chips = el('div', { class: 'stage-chips' }, index.stages.map(st => {
    const has = cardsFor(terms, index.stages, st.n).length > 0;
    return has ? el('a', { class: `chip${st.n === n ? ' is-on' : ''}`, href: `#/tools/cards/${st.n}` }, t('stageN', { n: st.n }, lang)) : null;
  }));
  if (cards.length) show();
  return page(t('flashcards', null, lang), chips, cards.length ? el('div', { class: 'fc-wrap' }, card, counter, nav) : el('p', { class: 'muted' }, '—'));
}

/* ---------- Self-test ---------- */
export async function quizPage(lang, { stage }) {
  const [quiz, index] = await Promise.all([loadData('quiz'), loadData('index')]);
  if (!stage) {
    const best = prefs.get().quiz;
    return page(t('quiz', null, lang), el('ul', { class: 'tool-list' }, index.stages.map(st => {
      const qs = questionsFor(quiz, st.n);
      if (!qs.length) return null;
      return el('li', {}, el('a', { href: `#/tools/quiz/${st.n}` }, `${t('stageN', { n: st.n }, lang)} · ${pick(st.title, lang)}`,
        el('span', { class: 'muted' }, best[st.n] != null ? ` — ${best[st.n]}/${qs.length}` : ` — ${qs.length}`)));
    })));
  }
  const qs = questionsFor(quiz, stage);
  const answers = new Array(qs.length);
  const result = el('div', { class: 'quiz-result', 'aria-live': 'polite' });
  const list = el('ol', { class: 'quiz-list' }, qs.map((q, qi) => {
    const why = el('p', { class: 'quiz-why', hidden: true }, pick(q.why, lang));
    const li = el('li', { class: 'quiz-q', 'data-answer': String(q.answer) }, el('p', { class: 'quiz-text' }, pick(q.q, lang)));
    const opts = el('div', { class: 'quiz-opts' }, q.options.map((o, oi) => el('button', {
      type: 'button', class: 'quiz-opt',
      onclick: e => {
        if (answers[qi] !== undefined) return;
        answers[qi] = oi;
        for (const [k, b] of [...opts.children].entries()) { b.disabled = true; if (k === q.answer) b.classList.add('is-right'); }
        if (oi !== q.answer) e.currentTarget.classList.add('is-wrong');
        why.hidden = false;
        if (answers.filter(a => a !== undefined).length === qs.length) {
          const { correct, total } = scoreQuiz(answers, qs);
          prefs.setQuizBest(stage, correct);
          result.replaceChildren(el('p', { class: 'quiz-score' }, `${correct}/${total}`),
            el('a', { class: 'button button-quiet', href: `#/stage/${stage}` }, t('stageN', { n: stage }, lang)));
        }
      },
    }, pick(o, lang))));
    li.append(opts, why);
    return li;
  }));
  return page(`${t('quiz', null, lang)} · ${t('stageN', { n: stage }, lang)}`, list, result);
}

/* ---------- Hormone comparison ---------- */
// data/hormones.json: { cols: [{key, label}], rows: [{id, name, chapter, cells: {key: {zh,en,ms}}}], src }
export async function hormoneTable(lang) {
  const data = await loadData('hormones');
  const cols = data.cols;
  const table = el('div', { class: 'table-scroll', tabindex: '0' }, el('table', { class: 'hormone-table' },
    el('thead', {}, el('tr', {}, el('th', { scope: 'col' }, pick(data.first, lang)), cols.map(c => el('th', { scope: 'col' }, pick(c.label, lang))))),
    el('tbody', {}, data.rows.map(r => el('tr', {},
      el('th', { scope: 'row' }, el('a', { href: `#/ch/${cid(r.chapter)}` }, pick(r.name, lang))),
      cols.map(c => el('td', {}, pick(r.cells[c.key], lang))))))));
  return page(t('hormones', null, lang), el('p', { class: 'lede' }, pick(data.intro, lang)), table,
    el('p', { class: 'muted' }, `${t('source', null, lang)}: ${data.src}`));
}

/* ---------- Essay-question review ---------- */
// data/essays.json: [{ id, chapter, q: {…}, points: [{…}], tip?: {…} }]
export async function essays(lang) {
  const list = await loadData('essays');
  return page(t('essays', null, lang),
    el('p', { class: 'lede' }, t('essaysHint', null, lang)),
    el('ol', { class: 'essay-list' }, list.map(e => el('li', { class: 'essay', id: `essay-${e.id}` },
      el('p', { class: 'essay-q' }, pick(e.q, lang)),
      el('details', {},
        el('summary', {}, t('showOutline', null, lang)),
        el('ol', { class: 'essay-points' }, e.points.map(x => el('li', {}, pick(x, lang)))),
        e.tip ? el('p', { class: 'muted' }, pick(e.tip, lang)) : null,
        el('a', { class: 'button button-quiet', href: `#/ch/${cid(e.chapter)}` }, t('chapterN', { n: e.chapter }, lang)))))));
}
