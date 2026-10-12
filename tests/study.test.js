import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as study from '../js/study.js';

function memory() { const m = new Map(); return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), _m: m }; }
let store;
beforeEach(() => { store = memory(); study.init(store); });

const base = { ch: 'ch01', lang: 'en', blk: 's1:0', start: 2, end: 10, text: 'abcdefgh', style: 'yellow' };

test('favourites and bookmarks toggle and persist', () => {
  assert.equal(study.toggleFav('ch03'), true);
  assert.equal(study.toggleBookmark('ch03', 's2'), true);
  study.init(store);
  assert.equal(study.isFav('ch03'), true);
  assert.equal(study.isBookmarked('ch03', 's2'), true);
  assert.equal(study.toggleFav('ch03'), false);
});

test('a mark is stored, restyled, annotated and removed', () => {
  const id = study.addMark(base);
  assert.ok(id);
  study.updateMark(id, { style: 'underline', note: 'remember' });
  study.init(store);
  const [m] = study.marksFor('ch01', 'en');
  assert.equal(m.style, 'underline'); assert.equal(m.note, 'remember');
  assert.deepEqual(study.marksFor('ch01', 'zh'), []);
  study.removeMark(id);
  assert.equal(study.marksFor('ch01', 'en').length, 0);
});

test('an overlapping mark replaces the old one and keeps its note', () => {
  const a = study.addMark(base);
  study.updateMark(a, { note: 'keep me' });
  study.addMark({ ...base, start: 5, end: 12, text: 'x'.repeat(7), style: 'green' });
  const marks = study.marksFor('ch01', 'en');
  assert.equal(marks.length, 1);
  assert.equal(marks[0].style, 'green');
  assert.equal(marks[0].note, 'keep me');
});

test('invalid marks and corrupt storage are rejected', () => {
  assert.equal(study.addMark({ ...base, end: 1 }), null);
  assert.equal(study.addMark({ ...base, ch: 'nope' }), null);
  store.setItem('pphys.study.v1', '{"fav":{"x":1},"marks":[{"ch":"ch01"}],"notes":{"ch02":"  "}}');
  study.init(store);
  assert.equal(study.isEmpty(), true);
  store.setItem('pphys.study.v1', 'not json');
  study.init(store);
  assert.equal(study.isEmpty(), true);
});

test('chapter notes: blank removes, export groups by chapter', () => {
  study.setChapterNote('ch02', 'my note');
  study.toggleFav('ch02');
  study.addMark({ ...base, ch: 'ch02', note: 'n1' });
  const text = study.exportText({ chapters: ['ch01', 'ch02'], label: c => c.toUpperCase(), secLabel: (c, s) => s, headings: { note: 'Notes' } });
  assert.match(text, /^## CH02 ★/);
  assert.match(text, /“abcdefgh”/);
  assert.match(text, /✎ n1/);
  assert.match(text, /Notes: my note/);
  assert.doesNotMatch(text, /CH01/);
  study.setChapterNote('ch02', '   ');
  assert.equal(study.chapterNote('ch02'), '');
});

test('works with no storage at all', () => {
  study.init(null);
  assert.equal(study.toggleFav('ch01'), true);
});
