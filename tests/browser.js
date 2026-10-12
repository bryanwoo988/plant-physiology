/* Browser tests: each case opens the real app in an iframe at a given size
   with given saved preferences, then inspects it. Same origin, so storage
   written here is what the app reads. */

const KEY = 'pphys.prefs.v1';
const results = document.getElementById('results');
let passed = 0, failed = 0;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function until(fn, ms = 4000) {
  const t0 = performance.now();
  for (;;) {
    try { const v = fn(); if (v) return v; } catch { /* not yet */ }
    if (performance.now() - t0 > ms) throw new Error(`timed out waiting for ${fn}`);
    await sleep(50);
  }
}

async function openApp({ hash = '', width = 375, height = 740, prefs = null }) {
  localStorage.removeItem(KEY);
  if (prefs) localStorage.setItem(KEY, JSON.stringify({ lang: 'en', theme: 'light', scale: 1, chosen: true, read: {}, quiz: {}, lastRoute: '', seenVersion: '1.0.0', ...prefs }));
  const f = document.createElement('iframe');
  f.width = width; f.height = height;
  f.src = `../index.html${hash}`;
  document.getElementById('frames').append(f);
  await new Promise(r => f.addEventListener('load', r, { once: true }));
  const w = f.contentWindow;
  await until(() => w.document.documentElement.dataset.ready === 'true');
  return { f, w, d: w.document, close: () => f.remove() };
}

async function test(name, fn) {
  const li = document.createElement('li');
  try { await fn(); li.className = 'pass'; li.textContent = `✓ ${name}`; passed++; }
  catch (e) { li.className = 'fail'; li.innerHTML = `✗ ${name}<pre>${e.stack || e}</pre>`; failed++; }
  results.append(li);
}

const assert = (c, msg) => { if (!c) throw new Error(msg); };
const type = (a, input, text) => { input.value = text; input.dispatchEvent(new a.w.Event('input', { bubbles: true })); };

await test('first visit shows the language picker with English as default', async () => {
  const a = await openApp({});
  const picker = await until(() => a.d.getElementById('picker'));
  assert(!picker.hidden, 'picker hidden');
  assert(a.d.querySelector('#picker [data-lang="en"]').classList.contains('is-default'), 'English not marked default');
  a.close();
});

await test('deep link survives the language picker', async () => {
  const a = await openApp({ hash: '#/ch/ch01/s4' });
  a.d.querySelector('#picker [data-lang="zh"]').click();
  await until(() => a.d.getElementById('s4'));
  assert(a.w.location.hash === '#/ch/ch01/s4', `hash is ${a.w.location.hash}`);
  assert(a.d.documentElement.lang.startsWith('zh'), 'language not applied');
  await sleep(200);
  const top = a.d.getElementById('s4').getBoundingClientRect().top;
  assert(top > -5 && top < 160, `section s4 at ${top}px`);
  a.close();
});

await test('language button cycles and keeps the reading position', async () => {
  const a = await openApp({ hash: '#/ch/ch01/s4', prefs: { lang: 'en' } });
  await until(() => a.d.getElementById('s4'));
  await sleep(200);
  a.d.querySelector('[data-action="lang"]').click();
  await until(() => a.d.documentElement.lang === 'ms');
  await sleep(200);
  const top = a.d.getElementById('s4').getBoundingClientRect().top;
  assert(top > -5 && top < 160, `section s4 moved to ${top}px`);
  a.close();
});

await test('theme is applied by an inline script before the stylesheet', async () => {
  const html = await (await fetch('../index.html', { cache: 'no-store' })).text();
  const pre = html.indexOf('id="prepaint"'), css = html.indexOf('css/app.css');
  assert(pre > 0 && pre < css, 'prepaint script missing or after the stylesheet');
  const a = await openApp({ prefs: { theme: 'dark' } });
  assert(a.d.documentElement.dataset.theme === 'dark', 'dark theme not applied');
  a.close();
});

await test('text size 1.3 switches the chapter to a single column', async () => {
  const cols = async scale => {
    const a = await openApp({ hash: '#/ch/ch01', width: 1200, prefs: { scale } });
    await until(() => a.d.getElementById('s1'));
    const n = a.w.getComputedStyle(a.d.querySelector('.page-chapter')).gridTemplateColumns.split(' ').length;
    const single = 'single' in a.d.documentElement.dataset;
    a.close();
    return [n, single];
  };
  const [normal] = await cols(1);
  const [big, single] = await cols(1.3);
  assert(normal === 2, `scale 1 has ${normal} columns`);
  assert(single && big === 1, `scale 1.3 has ${big} columns, data-single=${single}`);
});

for (const lang of ['ms', 'zh', 'en']) {
  await test(`no horizontal overflow at 375px × scale 1.5 in ${lang}`, async () => {
    for (const hash of ['#/', '#/ch/ch01', '#/stage/3', '#/info', '#/share', '#/search', '#/tools', '#/tools/glossary', '#/tools/beaufort', '#/tools/quiz/3', '#/tools/cards', '#/tools/map', '#/tools/convert', '#/tools/data']) {
      const a = await openApp({ hash, prefs: { lang, scale: 1.5 } });
      await sleep(250);
      const sw = a.d.scrollingElement.scrollWidth;
      a.close();
      assert(sw <= 375, `${hash}: scrollWidth ${sw}`);
    }
  });
}

await test('share page shows a QR code, a share button and copy link', async () => {
  const a = await openApp({ hash: '#/share', prefs: { lang: 'zh' } });
  const svg = await until(() => a.d.querySelector('#share-host svg'));
  assert(svg.querySelectorAll('rect, path').length > 0, 'QR svg is empty');
  assert(a.d.querySelector('[data-share="copy"]'), 'no copy button');
  assert(a.d.querySelector('[data-share="native"]'), 'no share button');
  assert(a.d.querySelector('.share-url').textContent.includes('bryanwoo988.github.io/plant-physiology/'), 'URL not shown');
  a.close();
});

await test('search finds a chapter from a query in another language', async () => {
  const a = await openApp({ hash: '#/search', prefs: { lang: 'ms' } });
  const input = await until(() => a.d.querySelector('#search-input'));
  type(a, input, '水势');
  const first = await until(() => a.d.querySelector('.search-results a'));
  assert(first.getAttribute('href').startsWith('#/ch/ch01'), first.getAttribute('href'));
  assert(!/[\u4e00-\u9fff]/.test(first.querySelector('.hit-title').textContent), 'title not in Malay');
  a.close();
});

await test('a stage quiz scores answers and remembers the best', async () => {
  const a = await openApp({ hash: '#/tools/quiz/3', prefs: { lang: 'en' } });
  await until(() => a.d.querySelector('.quiz-q'));
  const qs = a.d.querySelectorAll('.quiz-q');
  for (const q of qs) q.querySelectorAll('.quiz-opt')[Number(q.dataset.answer)].click();
  const score = await until(() => a.d.querySelector('.quiz-score'));
  assert(score.textContent.includes(`${qs.length}/${qs.length}`), score.textContent);
  const saved = JSON.parse(a.w.localStorage.getItem('pphys.prefs.v1'));
  assert(saved.quiz[3] === qs.length, `best not saved: ${JSON.stringify(saved.quiz)}`);
  a.close();
});

await test('glossary, abbreviations, hormone table, essays, flashcards and concept map open', async () => {
  for (const [hash, sel, min] of [['#/tools/glossary', '.gloss-item', 9], ['#/tools/hormones', '.hormone-table tbody tr', 6], ['#/tools/essays', '.essay', 10], ['#/tools/abbr', '.gloss-item', 5], ['#/tools/cards', '.flashcard', 1], ['#/tools/map', '.cmap svg', 1], ['#/tools', '.tool-list a', 8]]) {
    const a = await openApp({ hash, prefs: { lang: 'zh' } });
    await until(() => a.d.querySelectorAll(sel).length >= min);
    a.close();
  }
});

await test('every widget in every chapter survives its slider extremes', async () => {
  const index = await (await fetch('../data/index.json', { cache: 'no-store' })).json();
  for (const c of index.chapters.filter(x => x.ready !== false)) {
    const ch = await (await fetch(`../data/${c.id}.json`, { cache: 'no-store' })).json();
    const ids = ch.sections.flatMap(sct => sct.blocks).filter(b => b.type === 'widget' || b.type === 'map').map(b => b.id);
    if (!ids.length) continue;
    const a = await openApp({ hash: `#/ch/${c.id}`, prefs: { lang: 'ms', scale: 1.5 } });
    for (const id of ids) {
      const fig = await until(() => a.d.querySelector(`[data-widget="${id}"] .w-frame, [data-widget="${id}"] .map-wrap`), 6000);
      for (const input of fig.closest('[data-widget]').querySelectorAll('input[type=range]')) {
        for (const v of [input.min, input.max, input.min]) {
          input.value = v; input.dispatchEvent(new a.w.Event('input', { bubbles: true }));
          const text = fig.closest('[data-widget]').textContent;
          assert(!/NaN|undefined|Infinity/.test(text), `${c.id} ${id} at ${v}: ${text.slice(0, 200)}`);
        }
      }
    }
    assert(a.d.scrollingElement.scrollWidth <= 375, `${c.id}: overflow ${a.d.scrollingElement.scrollWidth}`);
    a.close();
  }
});


await test('nested children render as elements, never as "[object HTMLElement]"', async () => {
  const { el } = await import('../js/content.js');
  const dl = el('dl', {}, [[el('dt', {}, 'k1'), el('dd', {}, 'v1')], [el('dt', {}, 'k2'), el('dd', {}, 'v2')]]);
  assert(!dl.textContent.includes('[object'), 'pairs were turned into text');
  assert(dl.querySelectorAll('dt').length === 2 && dl.querySelectorAll('dd').length === 2, 'dt/dd missing');
});

await test('no chapter shows "[object …]" text', async () => {
  const idx = await (await fetch('../data/index.json')).json();
  const { renderSections } = await import('../js/content.js');
  const bad = [];
  for (const meta of idx.chapters) {
    const ch = await (await fetch(`../data/${meta.id}.json`)).json();
    const host = document.createElement('div');
    host.append(renderSections(ch, { lang: 'en', terms: new Map() }));
    if (/\[object /.test(host.textContent)) bad.push(meta.id);
  }
  assert(!bad.length, 'broken text in ' + bad.join(', '));
});

await test('selecting text and choosing a colour makes a highlight that survives a reload', async () => {
  localStorage.removeItem('pphys.study.v1');
  let a = await openApp({ hash: '#/ch/ch01', prefs: { lang: 'en' } });
  const blk = await until(() => a.d.querySelector('[data-blk="s2:0"]'));
  const tn = a.d.createTreeWalker(blk, 4).nextNode();
  const r = a.d.createRange(); r.setStart(tn, 0); r.setEnd(tn, 12);
  a.w.getSelection().removeAllRanges(); a.w.getSelection().addRange(r);
  a.d.dispatchEvent(new a.w.Event('selectionchange'));
  (await until(() => !a.d.getElementById('markbar').hidden && a.d.querySelector('#markbar .mb-pink'))).click();
  await until(() => a.d.querySelector('mark.hl-pink'));
  a.close();
  a = await openApp({ hash: '#/ch/ch01', prefs: { lang: 'en' } });
  const mk = await until(() => a.d.querySelector('mark.hl-pink'));
  assert(mk.textContent.length === 12, `mark text "${mk.textContent}"`);
  a.close();
  const b = await openApp({ hash: '#/notebook', prefs: { lang: 'en' } });
  await until(() => b.d.querySelector('.mark-item'));
  b.close();
  localStorage.removeItem('pphys.study.v1');
});

// Select [from, to) of a text node in the app and let annotate.js see it.
async function selectIn(a, startNode, from, endNode, to) {
  const r = a.d.createRange(); r.setStart(startNode, from); r.setEnd(endNode, to);
  a.w.getSelection().removeAllRanges(); a.w.getSelection().addRange(r);
  a.d.dispatchEvent(new a.w.Event('selectionchange'));
  return until(() => !a.d.getElementById('markbar').hidden && a.d.getElementById('markbar'));
}
const stored = () => JSON.parse(localStorage.getItem('pphys.study.v1') || '{"marks":[]}').marks;

await test('a highlight across list items keeps them apart; part of it can be erased', async () => {
  localStorage.removeItem('pphys.study.v1');
  const a = await openApp({ hash: '#/ch/ch01', prefs: { lang: 'en' } });
  const ul = await until(() => a.d.querySelector('ul[data-blk]'));
  const [li1, li2] = ul.querySelectorAll('li');
  const end1 = a.d.createTreeWalker(li1, 4); let last1; for (let n = end1.nextNode(); n; n = end1.nextNode()) last1 = n;
  const first2 = a.d.createTreeWalker(li2, 4).nextNode();
  let bar = await selectIn(a, last1, Math.max(0, last1.length - 8), first2, Math.min(first2.length, 9));
  assert(!bar.querySelector('.mb-delete'), 'bin shown for unmarked text');
  bar.querySelector('.mb-yellow').click();
  await until(() => stored().length === 1);
  assert(stored()[0].text.includes('\n'), `items run together: ${JSON.stringify(stored()[0].text)}`);

  // Selecting inside the mark shows the bin and the colour in use; erasing the
  // middle leaves the two ends.
  const mk = await until(() => ul.querySelector('mark.hl-yellow'));
  const tn = mk.firstChild;
  assert(tn.length >= 5, `mark piece too short: ${tn.length}`);
  bar = await selectIn(a, tn, 2, tn, tn.length - 2);
  assert(bar.querySelector('.mb-delete'), 'no bin over marked text');
  assert(bar.querySelector('.mb-yellow').getAttribute('aria-pressed') === 'true', 'yellow not shown as in use');
  const w = bar.getBoundingClientRect();
  assert(w.left >= 0 && w.right <= a.w.innerWidth, `bar overflows: ${w.left}–${w.right}`);
  bar.querySelector('.mb-delete').click();
  await until(() => stored().length === 2);

  // Tapping the same colour on a marked selection removes it too.
  const rest = await until(() => ul.querySelector('mark.hl-yellow'));
  bar = await selectIn(a, rest.firstChild, 0, rest.firstChild, rest.firstChild.length);
  bar.querySelector('.mb-yellow').click();
  await until(() => stored().length === 1);

  // Tapping a mark opens the bar for it, with the bin.
  a.w.getSelection().removeAllRanges();
  (await until(() => ul.querySelector('mark.hl-yellow'))).click();
  bar = await until(() => !a.d.getElementById('markbar').hidden && a.d.getElementById('markbar'));
  assert(bar.querySelector('.mb-delete'), 'no bin for a tapped mark');
  bar.querySelector('.mb-delete').click();
  await until(() => stored().length === 0 && !ul.querySelector('mark.hl'));
  a.close();
});

await test('the label of a note box is not part of what can be marked', async () => {
  localStorage.removeItem('pphys.study.v1');
  const a = await openApp({ hash: '#/ch/ch01', prefs: { lang: 'en' } });
  const note = await until(() => a.d.querySelector('aside[data-blk]'));
  const label = note.querySelector('.note-label').firstChild;
  const body = a.d.createTreeWalker(note.querySelector('p:not(.note-label)'), 4).nextNode();
  const bar = await selectIn(a, label, 0, body, 6);
  bar.querySelector('.mb-green').click();
  await until(() => stored().length === 1);
  assert(stored()[0].text === body.data.slice(0, 6).trim(), `marked "${stored()[0].text}"`);
  a.close();
  localStorage.removeItem('pphys.study.v1');
});

document.getElementById('summary').textContent = `${passed} passed, ${failed} failed`;
document.documentElement.dataset.done = 'true';
