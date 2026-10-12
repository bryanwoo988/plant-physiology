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

// Marks over a real block text, so cut and merged pieces can be checked word by word.
const TEXT = 'The quick brown fox jumps over the lazy dog';
const at = (words, style = 'yellow') => {
  const start = TEXT.indexOf(words);
  return { ch: 'ch01', lang: 'en', blk: 's1:0', start, end: start + words.length, text: words, style };
};
const spot = { ch: 'ch01', lang: 'en', blk: 's1:0' };
const view = () => study.marksFor('ch01', 'en').sort((a, b) => a.start - b.start)
  .map(m => { assert.equal(TEXT.slice(m.start, m.end), m.text); return `${m.style}:${m.text}`; });

test('a different colour over the middle of a mark splits it instead of deleting it', () => {
  study.addMark(at('quick brown fox jumps'));
  study.addMark(at('brown fox', 'green'));
  assert.deepEqual(view(), ['yellow:quick', 'green:brown fox', 'yellow:jumps']);
});

test('the same colour again merges with what it overlaps or touches', () => {
  const a = study.addMark(at('quick brown'));
  study.updateMark(a, { note: 'keep me' });
  study.addMark(at('brown fox jumps'));
  study.addMark(at('quick brown'));
  assert.deepEqual(view(), ['yellow:quick brown fox jumps']);
  assert.equal(study.marksFor('ch01', 'en')[0].note, 'keep me');
});

test('erasing the middle of a highlight leaves both ends, the note on the first', () => {
  const a = study.addMark(at('quick brown fox jumps'));
  study.updateMark(a, { note: 'n' });
  const r = at('brown fox');
  assert.equal(study.eraseRange(spot, r.start, r.end), 1);
  assert.deepEqual(view(), ['yellow:quick', 'yellow:jumps']);
  const [first, second] = study.marksFor('ch01', 'en').sort((x, y) => x.start - y.start);
  assert.equal(first.id, a); assert.equal(first.note, 'n'); assert.equal(second.note, '');
  study.init(store);
  assert.deepEqual(view(), ['yellow:quick', 'yellow:jumps']);
});

test('erasing across several marks removes only the selected words', () => {
  study.addMark(at('The quick'));
  study.addMark(at('fox jumps', 'underline'));
  const r = at('quick brown fox');
  study.eraseRange(spot, r.start, r.end);
  assert.deepEqual(view(), ['yellow:The', 'underline:jumps']);
  assert.equal(study.eraseRange(spot, 0, 1), 1);
  assert.equal(study.eraseRange(spot, r.start, r.end), 0);
});

test('a mark wholly covered by a new one passes its note on', () => {
  const a = study.addMark(at('fox', 'pink'));
  study.updateMark(a, { note: 'fox note' });
  study.addMark(at('brown fox jumps', 'blue'));
  assert.deepEqual(view(), ['blue:brown fox jumps']);
  assert.equal(study.marksFor('ch01', 'en')[0].note, 'fox note');
});

test('under() reports the one style covering a selection', () => {
  study.addMark(at('quick brown'));
  study.addMark(at('fox', 'green'));
  const q = (w) => { const r = at(w); return study.under(spot, r.start, r.end, w); };
  assert.equal(q('quick brown').style, 'yellow');
  assert.equal(q('brown').style, 'yellow');
  assert.equal(q('brown fox').style, null);
  assert.equal(q('brown fox').marks.length, 2);
  assert.equal(q('jumps').marks.length, 0);
  assert.equal(q('quick brown fox').style, null);
});

test('moveMark re-anchors without losing the mark', () => {
  const id = study.addMark(at('lazy'));
  assert.equal(study.moveMark(id, 1, 5), true);
  study.init(store);
  assert.equal(study.markById(id).start, 1);
});

test('export joins a multi-item mark with slashes, not a run-on word', () => {
  study.addMark({ ...base, text: 'end of one.\nStart of two', end: base.start + 24 });
  const text = study.exportText({ chapters: ['ch01'], label: c => c, secLabel: (c, s) => s, headings: { note: 'N' } });
  assert.match(text, /“end of one\. \/ Start of two”/);
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
