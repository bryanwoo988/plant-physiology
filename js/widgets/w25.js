/* W25 — The ABC model. Knock out class A, B or C genes and see what each
   of the four whorls becomes. A and C exclude each other (lose A and C
   spreads outwards, lose C and A spreads inwards). After Hopkins & Hüner
   2009, pp. 434–436. */

import { s, h, clamp, frame } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const ORGAN = {
  sepal: T('萼片', 'Sepal', 'Sepal'), petal: T('花瓣', 'Petal', 'Kelopak'), stamen: T('雄蕊', 'Stamen', 'Stamen'), carpel: T('心皮', 'Carpel', 'Karpel'), none: T('—', '—', '—'),
};
const L = {
  title: T('ABC 模型：拿掉一类基因看看', 'The ABC model: knock out a class of genes', 'Model ABC: matikan satu kelas gen'),
  whorls: [T('第 1 轮', 'Whorl 1', 'Lingkaran 1'), T('第 2 轮', 'Whorl 2', 'Lingkaran 2'), T('第 3 轮', 'Whorl 3', 'Lingkaran 3'), T('第 4 轮', 'Whorl 4', 'Lingkaran 4')],
  wt: T('野生型', 'Wild type', 'Jenis liar'), a: T('缺 A（AP1/AP2）', 'No A (AP1/AP2)', 'Tiada A (AP1/AP2)'), b: T('缺 B（AP3/PI）', 'No B (AP3/PI)', 'Tiada B (AP3/PI)'), c: T('缺 C（AG）', 'No C (AG)', 'Tiada C (AG)'),
};
function fates(mut) {
  let A = [1, 1, 0, 0], B = [0, 1, 1, 0], C = [0, 0, 1, 1];
  if (mut === 'a') { A = [0, 0, 0, 0]; C = [1, 1, 1, 1]; }
  if (mut === 'c') { C = [0, 0, 0, 0]; A = [1, 1, 1, 1]; }
  if (mut === 'b') B = [0, 0, 0, 0];
  return A.map((_, i) => {
    const a = A[i], b = B[i], c = C[i];
    if (a && b) return ['petal', 'AB'];
    if (b && c) return ['stamen', 'BC'];
    if (a) return ['sepal', 'A'];
    if (c) return ['carpel', 'C'];
    return ['none', ''];
  });
}

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  let mut = 'wt';
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 260, 360)), H = W;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg abc-svg', role: 'img', 'aria-label': p(L.title) });
  const cx = W / 2, cy = H / 2, rs = [W * 0.46, W * 0.35, W * 0.24, W * 0.12];
  const rings = rs.map(r => { const c = s('circle', { cx, cy, r, class: 'abc-ring' }); svg.append(c); return c; });
  const labels = rs.map((r, i) => { const t = s('text', { x: cx, y: cy - r + (i === 3 ? r : W * 0.06), 'text-anchor': 'middle', class: 'abc-lbl' }); svg.append(t); return t; });
  const table = h('div', { class: 'abc-table' });
  function draw() {
    const f = fates(mut);
    f.forEach(([o, code], i) => {
      rings[i].setAttribute('class', `abc-ring abc-${o}`);
      labels[i].textContent = p(ORGAN[o]);
    });
    table.replaceChildren(...f.map(([o, code], i) => h('div', {}, h('span', { class: 'w-label' }, p(L.whorls[i])), h('strong', {}, p(ORGAN[o])), h('span', { class: 'muted' }, code ? ` (${code})` : ''))));
  }
  const seg = h('div', { class: 'seg', role: 'group' }, ['wt', 'a', 'b', 'c'].map(k => {
    const b = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': String(k === mut) }, p(L[k]));
    b.addEventListener('click', () => { mut = k; for (const n of seg.children) n.setAttribute('aria-pressed', String(n === b)); draw(); });
    return b;
  }));
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'Hopkins & Hüner 2009, pp. 434–436', children: [seg, svg, table] }));
  draw();
  return { destroy() { el.replaceChildren(); } };
}
