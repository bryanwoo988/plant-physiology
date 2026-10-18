/* Boot, hash router, views. The only module that wires the others together.

   Routes (all in the fragment, so the service worker only ever serves the root):
     #/                     home: the five stages
     #/stage/N              one stage
     #/ch/chNN[/sID]        a chapter, optionally scrolled to a section
     #/notes  #/bookmarks  #/settings (#/info)  #/share  #/search  #/tools/<name>[/N]

   Highlights, notes on passages, bookmarks and read-aloud are reader.js
   (window.Reader, shared with OPWiki and Oil Palm Basics); the bottom bar
   below the page opens them. */

import * as prefs from './prefs.js';
import { t, pick, LANG_NATIVE } from './i18n.js';
import { loadIndex, loadChapter, loadData, renderSections, el } from './content.js';
import { loadTerms, openTermSheet, renderNewTerms } from './terms.js';
import { newerRevision, updateAction, mayAutoReload } from './updatelogic.js';
import { notesSince } from './releases.js';
import { APP_URL, AUTHOR } from './config.js';
import { renderShare } from './share.js';
import { render as renderChart } from './charts.js';
import { mountWidget } from './widgets/index.js';
import { buildIndex, search } from './search.js';
import * as tools from './tools.js';
import * as study from './study.js';
import { migrate } from './migrate.js';

const $ = sel => document.querySelector(sel);
const main = $('#main');

/* ---------- Icons (24px stroke, currentColor) ---------- */
const svg = d => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON = {
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>'),
  more: svg('<circle cx="5.5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18.5" cy="12" r="1.2" fill="currentColor"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  star: svg('<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z"/>'),
  starOn: svg('<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z" fill="currentColor"/>'),
};

/* ---------- State ---------- */
let index = null, terms = null, sources = null, releases = [];
let current = { route: null, chapterNum: null };
let visibleSince = performance.now();
let asked = false;

const lang = () => prefs.get().lang;
const tr = (k, v) => t(k, v, lang());
const cid = n => `ch${String(n).padStart(2, '0')}`;
const readyChapters = () => index.chapters.filter(c => c.ready !== false);

/* ---------- Header ---------- */
function paintHeader() {
  const set = (sel, html, label) => { const b = $(sel); b.innerHTML = html; b.setAttribute('aria-label', label); b.title = label; };
  set('[data-action="search"]', ICON.search, tr('search'));
  set('[data-action="more"]', ICON.more, tr('more'));
  $('#bottomnav').setAttribute('aria-label', tr('menu'));
  $('.sheet-close').innerHTML = ICON.close;
  $('.sheet-close').setAttribute('aria-label', tr('close'));
  for (const n of document.querySelectorAll('[data-ui]')) n.textContent = tr(n.dataset.ui);
  markNav();
}

let toastTimer = 0;
function toast(message) {
  const n = $('#toast');
  n.textContent = message;
  n.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { n.hidden = true; }, 1900);
}

/* ---------- Sheet ---------- */
function openSheet(content) {
  const body = $('.sheet-body');
  body.replaceChildren(content);
  $('#sheet').hidden = false;
  document.body.classList.add('sheet-open');
  $('.sheet-panel').focus?.();
}
function closeSheet() {
  $('#sheet').hidden = true;
  document.body.classList.remove('sheet-open');
}

/* ---------- Routing ---------- */
function parse(hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [a, b, c] = parts;
  if (!a) return { view: 'home' };
  if (a === 'stage') return { view: 'stage', n: Number(b) };
  if (a === 'ch') return { view: 'chapter', id: b, section: c };
  if (a === 'tools') return { view: 'tools', name: b, arg: c };
  if (a === 'info' || a === 'settings') return { view: 'settings' };
  if (a === 'notebook' || a === 'notes') return { view: 'notes' };
  if (['share', 'search', 'bookmarks'].includes(a)) return { view: a };
  return { view: 'home' };
}

const ctxFor = () => ({
  lang: lang(),
  terms,
  onTerm: id => openTermSheet(id, { lang: lang(), openSheet, currentChapter: current.chapterNum }),
  renderChart: (spec, c) => renderChart(spec, c),
  mountWidget: (host, id, c) => mountWidget(host, id, c),
  sourceLabel: s => {
    const [id, pages] = s.split(':');
    const src = sources.find(x => x.id === id);
    return `${src?.short ?? id}${pages ? `, ${pages.includes('-') ? 'pp.' : 'p.'} ${pages.replace('-', '–')}` : ''}`;
  },
});

// A render that is overtaken by a newer one (a quick second tap while a
// chapter loads) is dropped instead of replacing the newer page.
let renderSeq = 0;
let flushNote = null;

async function render({ keepAnchor = false } = {}) {
  const seq = ++renderSeq;
  const r = parse(location.hash);
  flushNote?.();
  flushNote = null;
  current = { route: r, chapterNum: null, after: null };
  closeSheet();
  const anchor = keepAnchor ? readingAnchor() : null;
  const y = window.scrollY;
  document.documentElement.dataset.view = r.view;
  try {
    const view = await VIEWS[r.view](r);
    if (seq !== renderSeq) return;
    // Reading aloud follows the chapter it started in. Going anywhere else
    // stops it, unless the reading itself turned the page (readerNext).
    if (!ttsTurningPage) window.Reader.stop();
    main.replaceChildren(view);
    current.after?.();
  } catch (e) {
    if (seq !== renderSeq) return;
    console.error(e);
    main.replaceChildren(el('div', { class: 'page' }, el('p', { class: 'error' }, tr('loadError'))));
  }
  window.Reader.refresh();
  markNav();
  const reveal = r.view === 'chapter' ? pendingReveal : null;
  pendingReveal = null;
  if (anchor) restoreAnchor(anchor);
  else if (reveal) requestAnimationFrame(() => window.Reader.reveal(reveal));
  else if (r.section) scrollToSection(r.section);
  else window.scrollTo(0, keepAnchor ? y : 0);
  if (r.view === 'chapter') prefs.setLastRoute(location.hash);
  for (const fn of afterRender.splice(0)) fn();
}

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  if (target.tagName === 'DETAILS') target.open = true;
  target.scrollIntoView({ block: 'start' });
}

// The section the reader is looking at, and where it sits on screen, so a
// language switch can put it back in the same place.
function readingAnchor() {
  const top = $('.topbar').getBoundingClientRect().bottom;
  for (const s of document.querySelectorAll('.section')) {
    const r = s.getBoundingClientRect();
    if (r.bottom > top + 8) return { id: s.id, offset: r.top };
  }
  return null;
}
function restoreAnchor({ id, offset }) {
  const s = document.getElementById(id);
  if (!s) return;
  window.scrollBy(0, s.getBoundingClientRect().top - offset);
}

/* ---------- Views ---------- */
const VIEWS = {
  async home() {
    const p = prefs.get();
    const last = p.lastRoute && parse(p.lastRoute).view === 'chapter' ? p.lastRoute : null;
    const first = readyChapters()[0];
    const hero = el('section', { class: 'hero' },
      el('h1', {}, tr('appName')),
      el('p', { class: 'lede' }, tr('tagline')),
      last ? el('a', { class: 'button', href: last }, tr('continueReading'))
        : first ? el('a', { class: 'button', href: `#/ch/${first.id}` }, tr('startHere')) : null);
    const stages = el('ol', { class: 'stage-list' }, index.stages.map(s => stageCard(s, p)));
    return el('div', { class: 'page page-home' }, hero, stages);
  },

  async stage({ n }) {
    const s = index.stages.find(x => x.n === n);
    if (!s) return VIEWS.home();
    const p = prefs.get();
    const chs = s.chapters.map(id => index.chapters.find(c => c.id === id));
    return el('div', { class: 'page' },
      el('p', { class: 'kicker' }, tr('stageN', { n })),
      el('h1', {}, pick(s.title, lang())),
      el('p', { class: 'lede' }, pick(s.blurb, lang())),
      s.exam ? el('p', { class: 'muted' }, tr('examUnit', { n: s.exam })) : null,
      el('ol', { class: 'chapter-list' }, chs.map(c => {
        const ready = c.ready !== false;
        const inner = [el('span', { class: 'ch-num' }, String(c.num)), el('span', { class: 'ch-title' }, pick(c.title, lang())),
          p.read[c.id] ? el('span', { class: 'ch-read', 'aria-label': tr('isRead') }) : null];
        const li = el('li', { class: ready ? '' : 'is-soon' },
          ready ? el('a', { href: `#/ch/${c.id}` }, inner) : el('span', { class: 'ch-row' }, inner));
        const mark = li.querySelector('.ch-read');
        if (mark) mark.innerHTML = ICON.check;
        return li;
      })),
      el('div', { class: 'stage-tools' },
        el('a', { class: 'button', href: `#/tools/quiz/${n}` }, tr('quiz')),
        el('a', { class: 'button button-quiet', href: `#/tools/cards/${n}` }, tr('flashcards'))));
  },

  async chapter({ id }) {
    const job = current;   // this render's state, even if another starts while loading
    const meta = index.chapters.find(c => c.id === id && c.ready !== false);
    if (!meta) return VIEWS.home();
    const ch = await loadChapter(id);
    job.chapterNum = ch.num;
    const ctx = ctxFor();
    const ready = readyChapters();
    const i = ready.findIndex(c => c.id === id);
    const prev = ready[i - 1], next = ready[i + 1];
    const stage = index.stages.find(s => s.n === ch.stage);
    const isRead = !!prefs.get().read[id];

    const toc = el('nav', { class: 'toc', 'aria-label': tr('contents') },
      el('p', { class: 'toc-title' }, pick(stage.title, lang())),
      el('ol', {}, stage.chapters.map(cId => {
        const c = index.chapters.find(x => x.id === cId);
        const on = c.ready !== false;
        return el('li', { class: [cId === id ? 'is-current' : '', on ? '' : 'is-soon'].join(' ').trim() },
          on ? el('a', { href: `#/ch/${cId}` }, `${c.num}. ${pick(c.title, lang())}`) : `${c.num}. ${pick(c.title, lang())}`);
      })));

    const readBtn = el('button', { type: 'button', class: `button ${isRead ? 'is-on' : 'button-quiet'}`,
      onclick: () => { prefs.markRead(id, !prefs.get().read[id]); render({ keepAnchor: true }); } },
      isRead ? tr('isRead') : tr('markRead'));
    if (isRead) readBtn.insertAdjacentHTML('afterbegin', ICON.check);

    const favBtn = el('button', { type: 'button', class: 'icon-btn fav-btn', 'aria-pressed': String(study.isFav(id)) });
    const paintFav = () => {
      const on = study.isFav(id);
      favBtn.innerHTML = on ? ICON.starOn : ICON.star;
      favBtn.setAttribute('aria-pressed', String(on));
      favBtn.setAttribute('aria-label', tr(on ? 'unfavourite' : 'favourite')); favBtn.title = favBtn.getAttribute('aria-label');
    };
    favBtn.addEventListener('click', () => { study.toggleFav(id); paintFav(); });
    paintFav();

    const sections = renderSections(ch, ctx);

    const noteBox = el('textarea', { class: 'field note-area', rows: '4', placeholder: tr('chapterNoteHint'), 'aria-label': tr('myNotes') });
    noteBox.value = study.chapterNote(id);
    const noteStatus = el('span', { class: 'share-status', role: 'status' });
    let noteTimer = 0;
    const saveNote = () => {
      if (!noteTimer) return;
      clearTimeout(noteTimer); noteTimer = 0;
      study.setChapterNote(id, noteBox.value);
      noteStatus.textContent = tr('saved');
      setTimeout(() => { noteStatus.textContent = ''; }, 1500);
    };
    noteBox.addEventListener('input', () => {
      clearTimeout(noteTimer);
      noteTimer = setTimeout(saveNote, 400);
    });
    // Leaving the page, switching language or closing the app inside the
    // 400 ms wait must not lose the last words typed.
    noteBox.addEventListener('blur', saveNote);

    const article = el('article', { class: 'chapter', 'data-num': ch.num },
      el('div', { class: 'chapter-head' },
        el('p', { class: 'kicker' }, el('a', { href: `#/stage/${ch.stage}` }, tr('stageN', { n: ch.stage })), ` · ${tr('chapterN', { n: ch.num })}`),
        favBtn),
      el('h1', {}, pick(ch.title, lang())),
      el('p', { class: 'study-hint muted' }, tr('markHint')),
      renderNewTerms(ch.newTerms, ctx),
      sections,
      el('section', { class: 'chapter-notes' },
        el('h2', {}, tr('myNotes')), noteBox, noteStatus),
      el('section', { class: 'chapter-sources' },
        el('h2', {}, tr('sources')),
        el('ul', {}, ch.sources.map(sid => {
          const s = sources.find(x => x.id === sid);
          if (!s) return null;
          return el('li', {}, s.url ? el('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.title, ' ↗') : s.title, `. ${s.publisher}.`);
        }))),
      el('footer', { class: 'chapter-foot' },
        readBtn,
        el('div', { class: 'pager' },
          prev ? el('a', { class: 'pager-link', href: `#/ch/${prev.id}` }, el('span', { class: 'pager-dir' }, tr('prev')), pick(prev.title, lang())) : el('span'),
          next ? el('a', { class: 'pager-link is-next', href: `#/ch/${next.id}` }, el('span', { class: 'pager-dir' }, tr('next')), pick(next.title, lang())) : el('span'))));
    job.after = () => { flushNote = saveNote; };
    return el('div', { class: 'page page-chapter' }, toc, article);
  },

  // Notes and highlights share a screen; bookmarks have their own. Under the
  // reader.js lists: the free chapter notes, and the favourite chapters.
  async notes() {
    const list = el('div', { class: 'card lib-list' });
    const view = el('div', { class: 'page page-lib' },
      el('h1', {}, tr('notes')),
      segmented([['notes', tr('notes')], ['marks', tr('highlights')]], notesKind, k => { notesKind = k; render({ keepAnchor: true }); }),
      list);
    window.Reader.renderList(list, notesKind);
    if (notesKind === 'notes') {
      const chs = readyChapters().filter(c => study.chapterNote(c.id));
      if (chs.length) view.append(el('h2', { class: 'lib-h' }, tr('chapterNotes')), el('div', { class: 'card' }, chs.map(c =>
        el('a', { class: 'nb-note', href: `#/ch/${c.id}` },
          el('span', { class: 'nb-note-ch' }, `${tr('chapterN', { n: c.num })} · ${pick(c.title, lang())}`),
          el('span', { class: 'nb-note-text' }, study.chapterNote(c.id))))));
    }
    return view;
  },

  async bookmarks() {
    const list = el('div', { class: 'card lib-list' });
    const view = el('div', { class: 'page page-lib' }, el('h1', {}, tr('bookmarks')), list);
    window.Reader.renderList(list, 'bookmarks');
    const favs = readyChapters().filter(c => study.isFav(c.id));
    if (favs.length) view.append(el('h2', { class: 'lib-h' }, tr('favourites')), el('ul', { class: 'tool-list' }, favs.map(c =>
      el('li', {}, el('a', { href: `#/ch/${c.id}` }, '★ ', `${c.num}. ${pick(c.title, lang())}`)))));
    return view;
  },

  // Language, theme, text size and read aloud (what used to be the buttons at
  // the top of the screen), then what the About page had.
  async settings() {
    const status = el('p', { class: 'status' }, '…');
    offlineStatus().then(ok => { status.textContent = tr(ok ? 'offlineReady' : 'offlineNotYet'); status.classList.add(ok ? 'is-ok' : 'is-pending'); });
    const p = prefs.get();
    const row = (title, control) => el('div', { class: 'setrow' }, el('h3', {}, title), control);
    const tts = el('div');
    window.Reader.renderSettings(tts);
    return el('div', { class: 'page page-info' },
      el('h1', {}, tr('settings')),
      el('div', { class: 'card setgroup' },
        row(tr('language'), segmented(prefs.LANGS.map(l => [l, LANG_NATIVE[l]]), p.lang, l => prefs.chooseLang(l))),
        row(tr('theme'), el('div', {},
          segmented([['auto', tr('themeAuto')], ['light', tr('themeLight')], ['dark', tr('themeDark')]], p.theme, th => prefs.setTheme(th)),
          el('p', { class: 'theme-note' }, tr('themeNote')))),
        row(tr('lightLooks'), swatches(prefs.LIGHT_THEMES, p.lightTheme, n => prefs.setLightTheme(n))),
        row(tr('darkLooks'), swatches(prefs.DARK_THEMES, p.darkTheme, n => prefs.setDarkTheme(n))),
        row(tr('textSize'), segmented(prefs.SCALES.map(sc => [sc, `${Math.round(sc * 100)}%`]), p.scale, sc => prefs.setScale(sc))),
        row(tr('readAloud'), tts)),
      el('h2', { class: 'lib-h' }, tr('info')),
      el('p', { class: 'lede' }, tr('tagline')),
      el('dl', { class: 'keyval' },
        el('dt', {}, tr('version')), el('dd', {}, releases[0] ? `v${releases[0].v} · ${builtAt() || releases[0].date} · ` : '',
          el('a', { href: '#', onclick: e => { e.preventDefault(); showAllReleases(); } }, tr('allUpdates'))),
        el('dt', {}, tr('offline')), el('dd', {}, status)),
      el('p', { class: 'credit' }, tr('createdBy')),
      el('p', {}, el('a', { class: 'button button-quiet', href: '#/share' }, tr('share'))),
      el('h2', {}, tr('allSources')),
      el('ul', { class: 'source-list' }, sources.map(s => el('li', {},
        s.url ? el('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.title, ' ↗') : el('strong', {}, s.title),
        el('span', { class: 'muted' }, ` — ${s.publisher}`)))));
  },

  async share() {
    const host = el('div', { id: 'share-host' });
    renderShare(host, { url: APP_URL, lang: lang() });
    return el('div', { class: 'page page-share' },
      el('h1', {}, tr('share')),
      el('p', { class: 'lede' }, tr('shareHint')),
      host,
      el('p', { class: 'share-url' }, APP_URL),
      el('p', { class: 'credit' }, tr('createdBy')));
  },

  async search() {
    const input = el('input', { id: 'search-input', type: 'search', class: 'field field-search', placeholder: tr('searchHint'), 'aria-label': tr('search'), autocomplete: 'off' });
    const results = el('ul', { class: 'search-results' });
    const idx = await searchIndex();
    const run = () => {
      const q = input.value;
      try { sessionStorage.setItem('pphys.q', q); } catch { /* ignore */ }
      const hits = search(idx, q, lang());
      results.replaceChildren(...(q.trim() && !hits.length ? [el('li', { class: 'muted' }, tr('noResults'))] : hits.map(h =>
        el('li', {}, el('a', { href: h.route }, el('span', { class: 'hit-title' }, h.title), el('span', { class: 'hit-snippet' }, h.snippet))))));
    };
    input.addEventListener('input', run);
    try { input.value = sessionStorage.getItem('pphys.q') || ''; } catch { /* ignore */ }
    run();
    setTimeout(() => input.focus(), 0);
    return el('div', { class: 'page' }, el('h1', {}, tr('search')), input, results);
  },

  async tools({ name, arg }) {
    const l = lang();
    switch (name) {
      case 'glossary': return tools.glossary(l);
      case 'abbr': return tools.glossary(l, { abbrOnly: true });
      case 'map': return tools.conceptMap(l, { openSheet });
      case 'cards': return tools.flashcards(l, { stage: Number(arg) || 0 });
      case 'quiz': return tools.quizPage(l, { stage: Number(arg) || 0 });
      case 'hormones': return tools.hormoneTable(l);
      case 'essays': return tools.essays(l);
      default: return tools.toolsIndex(l);
    }
  },
};

/* Theme looks as small previews: page, card and accent colour of each look.
   Keep in step with the [data-palette] blocks in css/app.css. */
const LOOK_COLOURS = {
  classic: ['#f7faf8', '#ffffff', '#2f7a52'], paper: ['#f6f1e7', '#fffdf8', '#a8571a'],
  mint: ['#eef7f3', '#ffffff', '#0b7f62'], lavender: ['#f5f3fc', '#ffffff', '#5b45c4'],
  midnight: ['#0f1512', '#151d19', '#7fd1a1'], oled: ['#000000', '#0d0d0d', '#7fd1a1'],
  slate: ['#23272f', '#2c313b', '#8cbcea'], grape: ['#17121f', '#221a2e', '#b89dff'],
};
function swatches(names, cur, onPick) {
  return el('div', { class: 'looks' }, names.map(n => {
    const [bg, surface, accent] = LOOK_COLOURS[n];
    return el('button', { type: 'button', class: n === cur ? 'look on' : 'look', 'aria-pressed': String(n === cur), onclick: () => onPick(n) },
      el('span', { class: 'look-prev', style: `background:${bg}` },
        el('span', { class: 'look-card', style: `background:${surface}` }, el('i', { style: `background:${accent}` }), el('b'))),
      el('span', { class: 'look-name' }, tr(`look_${n}`)));
  }));
}

/* A row of buttons, one of them on: language, theme, text size, notes/highlights. */
function segmented(options, current, onPick) {
  return el('div', { class: 'rd-seg setseg' }, options.map(([value, label]) =>
    el('button', { type: 'button', class: value === current ? 'on' : null, 'aria-pressed': String(value === current), onclick: () => onPick(value) }, label)));
}

function stageCard(s, p) {
  const chs = s.chapters.map(id => index.chapters.find(c => c.id === id));
  const ready = chs.filter(c => c.ready !== false);
  const done = ready.filter(c => p.read[c.id]).length;
  const pct = chs.length ? Math.round(100 * done / chs.length) : 0;
  const body = [
    el('span', { class: 'stage-num' }, String(s.n)),
    el('span', { class: 'stage-text' },
      el('span', { class: 'stage-title' }, pick(s.title, lang())),
      el('span', { class: 'stage-blurb' }, pick(s.blurb, lang())),
      el('span', { class: 'stage-meta' }, [s.exam ? tr('examUnit', { n: s.exam }) : null, tr('chaptersCount', { n: chs.length }), tr('progress', { done, total: chs.length })].filter(Boolean).join(' · ')),
      el('span', { class: 'progress', role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100 }, el('span', { style: `width:${pct}%` }))),
  ];
  return el('li', { class: 'stage-card' }, el('a', { href: `#/stage/${s.n}` }, body));
}

let searchIdx = null;
async function searchIndex() {
  if (!searchIdx) searchIdx = buildIndex(await Promise.all(readyChapters().map(c => loadChapter(c.id))), terms ? [...terms.values()] : []);
  return searchIdx;
}

/* ---------- More menu ---------- */
function openMore() {
  const item = (href, key) => el('li', {}, el('a', { href, onclick: closeSheet }, tr(key)));
  openSheet(el('nav', { class: 'more-menu' },
    el('ul', {},
      item('#/tools/glossary', 'glossary'), item('#/tools/abbr', 'abbr'),
      item('#/tools/map', 'conceptMap'), item('#/tools/cards', 'flashcards'), item('#/tools/quiz', 'quiz'),
      item('#/tools/hormones', 'hormones'), item('#/tools/essays', 'essays'),
      item('#/share', 'share'))));
}

/* ---------- Offline + updates ---------- */
async function offlineStatus() {
  try {
    if (!navigator.serviceWorker?.controller) return false;
    return (await caches.keys()).some(n => n.startsWith('pphys-'));
  } catch { return false; }
}

async function liveRevision() {
  try {
    const r = await fetch('index.html', { method: 'HEAD', cache: 'no-store' });
    return r.ok ? r.headers.get('Last-Modified') : null;
  } catch { return null; }
}

const TRIED = 'pphys.reload-tried';
async function checkForUpdate() {
  const live = await liveRevision();
  if (!newerRevision(document.lastModified, live)) return;
  const action = updateAction({
    hidden: document.hidden, asked,
    busy: !$('#sheet').hidden || window.scrollY > 200 || window.Reader.isBusy() || window.Reader.isListening(),
    sinceVisibleMs: performance.now() - visibleSince,
  });
  if (action === 'defer') return;
  let tried = null;
  try { tried = JSON.parse(sessionStorage.getItem(TRIED) || 'null'); } catch { /* ignore */ }
  if (action === 'apply' && (asked || mayAutoReload(tried, live, Date.now()))) return applyUpdate(live);
  $('#update-banner').hidden = false;
}

async function applyUpdate(live) {
  try { sessionStorage.setItem(TRIED, JSON.stringify({ v: live, at: Date.now() })); } catch { /* ignore */ }
  const reg = await navigator.serviceWorker?.getRegistration();
  if (reg) {
    await reg.update().catch(() => {});
    const waiting = reg.installing || reg.waiting;
    if (waiting) {
      await new Promise(r => {
        navigator.serviceWorker.addEventListener('controllerchange', r, { once: true });
        setTimeout(r, 8000);
      });
    }
  }
  location.reload();
}

/* When this build went live: index.html's Last-Modified (GitHub Pages sets
   it on every deploy), as local date and time. */
function builtAt() {
  const d = new Date(document.lastModified);
  if (!isFinite(d)) return '';
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function releaseSheet(title, list) {
  openSheet(el('div', { class: 'release-notes' },
    el('h2', {}, title),
    list.map(r => el('section', {}, el('p', { class: 'kicker' }, `v${r.v} · ${r.date}`),
      el('ul', {}, r.notes.map(n => el('li', {}, pick(n, lang())))))),
    el('button', { type: 'button', class: 'button', onclick: closeSheet }, tr('ok'))));
}

// Info → every release, any time.
function showAllReleases() {
  releaseSheet(tr('allUpdates'), releases);
}

function showReleaseNotes() {
  const latest = releases[0]?.v;
  if (!latest) return;
  const seen = prefs.get().seenVersion;
  prefs.setSeenVersion(latest);
  const list = notesSince(releases, seen).slice(0, 4);
  if (!list.length) return;
  releaseSheet(tr('updatedTo', { v: latest }), list);
}

/* ---------- Boot ---------- */
function wire() {
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-action]');
    if (!a) return;
    switch (a.dataset.action) {
      case 'more': openMore(); break;
      case 'search': location.hash = '#/search'; break;
      case 'close-sheet': closeSheet(); break;
      case 'update': asked = true; checkForUpdate(); break;
      default: return;
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet(); });
  window.addEventListener('hashchange', () => render());
  prefs.subscribe(what => {
    prefs.applyToDocument();
    paintHeader();
    if (what === 'lang' || what === 'scale' || (what === 'theme' && current.route?.view === 'settings')) render({ keepAnchor: true });
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => prefs.applyToDocument());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) flushNote?.();
    if (!document.hidden) { visibleSince = performance.now(); checkForUpdate(); }
  });
  setInterval(checkForUpdate, 15 * 60e3);
}

/* ---------- Bottom bar and reader.js ---------- */
let notesKind = 'notes';
let pendingReveal = null;
let ttsTurningPage = false;
const afterRender = [];

/* "Chapter 5 · Section heading" — where a saved block lives. */
function whereOf(u) {
  const num = u.closest('[data-num]')?.dataset.num;
  const sec = u.closest('.section');
  const head = sec?.querySelector(':scope > h2, :scope > summary');
  const words = head ? [...head.childNodes].filter(n => !n.classList?.contains('adv-tag')).map(n => n.textContent).join('').trim() : '';
  return [num ? tr('chapterN', { n: num }) : '', words].filter(Boolean).join(' · ');
}

/* Go to the chapter a saved block is in, then bring the block on screen. */
function openSaved(key) {
  const chId = key.split('/')[0];
  const r = parse(location.hash);
  if (r.view === 'chapter' && r.id === chId && window.Reader.reveal(key)) return;
  pendingReveal = key;
  location.hash = `#/ch/${chId}`;
}

/* Reading aloud reached the end of a chapter: turn to the next one. */
async function readerNext() {
  const r = parse(location.hash);
  if (r.view !== 'chapter') return false;
  const ready = readyChapters();
  const next = ready[ready.findIndex(c => c.id === r.id) + 1];
  if (!next) return false;
  ttsTurningPage = true;
  const done = new Promise(resolve => afterRender.push(resolve));
  location.hash = `#/ch/${next.id}`;
  await done;
  ttsTurningPage = false;
  return true;
}

function markNav() {
  if (!window.Reader || !$('#bottomnav')) return;
  const view = parse(location.hash).view;
  const tab = { notes: 'notes', bookmarks: 'bookmarks', settings: 'settings', share: 'settings' }[view] || 'home';
  const listening = window.Reader.isListening();
  for (const b of document.querySelectorAll('#bottomnav [data-nav]')) {
    const on = b.dataset.nav === 'listen' ? listening : b.dataset.nav === tab;
    b.classList.toggle('on', on);
    if (b.dataset.nav === 'listen') continue;
    if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  }
  $('#nav-listen').textContent = tr(listening ? 'stopReading' : 'readAloud');
}

function wireBottomNav() {
  $('#bottomnav').addEventListener('click', e => {
    const b = e.target.closest('[data-nav]');
    if (!b) return;
    switch (b.dataset.nav) {
      case 'home': location.hash = '#/'; break;
      case 'listen':
        if (!window.Reader.isListening() && parse(location.hash).view !== 'chapter') { toast(tr('openChapterFirst')); return; }
        window.Reader.listen();
        break;
      case 'notes': location.hash = '#/notes'; break;
      case 'bookmarks': location.hash = '#/bookmarks'; break;
      case 'settings': location.hash = '#/settings'; break;
    }
  });
}

/* Marks and section bookmarks made before 1.2.0 move into reader.js once. */
async function moveOldMarks() {
  const old = study.legacy();
  if (!old.marks.length && !Object.keys(old.bm).length) return;
  try {
    await migrate({
      legacy: old, lang: lang(), where: whereOf,
      chapter: async (id, l) => {
        const ch = await loadChapter(id);
        return el('article', { 'data-num': ch.num }, renderSections(ch, { lang: l, terms }));
      },
    });
    study.dropLegacy();
  } catch (e) { console.warn('[migrate]', e); }
}

function showPicker() {
  return new Promise(resolve => {
    const picker = $('#picker');
    picker.hidden = false;
    picker.querySelector('.is-default').focus();
    picker.addEventListener('click', e => {
      const b = e.target.closest('[data-lang]');
      if (!b) return;
      picker.hidden = true;
      resolve(b.dataset.lang);
    });
  });
}

async function boot() {
  prefs.init();
  study.init();
  prefs.applyToDocument();
  [index, terms, sources, releases] = await Promise.all([
    loadIndex(), loadTerms(), loadData('sources'), loadData('releases').catch(() => []),
  ]);
  await moveOldMarks();
  window.Reader.init({
    app: 'pphys',
    root: () => main,
    units: '[data-rk]',
    lang,
    where: whereOf,
    open: openSaved,
    next: readerNext,
    toast,
    onState: markNav,
    topOffset: () => $('.topbar').getBoundingClientRect().bottom,
  });
  // A note edited or deleted from a list: draw the list again.
  window.Reader.onChange(() => { if (['notes', 'bookmarks'].includes(parse(location.hash).view)) render({ keepAnchor: true }); });
  wireBottomNav();
  paintHeader();
  wire();
  $('#splash').classList.add('is-done');
  document.documentElement.dataset.ready = 'true';
  if (!prefs.get().chosen) {
    const chosen = await showPicker();
    prefs.chooseLang(chosen);   // subscribe() re-renders and repaints
    prefs.setSeenVersion(releases[0]?.v ?? '');
  } else {
    await render();
    showReleaseNotes();
  }
  // On the dev server a cache-first worker would pin stale files; ?sw=1 opts in.
  const dev = ['localhost', '127.0.0.1'].includes(location.hostname) && !/[?&]sw=1/.test(location.search);
  if ('serviceWorker' in navigator && location.protocol !== 'file:' && !dev) {
    navigator.serviceWorker.register('sw.js').catch(e => console.warn('[sw]', e));
  }
  checkForUpdate();
}

boot();

export { openSheet, closeSheet, AUTHOR };
