/* W20 — Tissue culture: the auxin:cytokinin ratio decides whether callus
   stays callus, makes roots or makes shoots (Skoog & Miller's tobacco
   work, Hopkins & Hüner 2009, pp. 343–345). The thresholds are a teaching
   simplification, not a recipe. */

import { s, h, clamp, slider, readout, frame, fmt } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('组织培养：生长素与细胞分裂素的比例', 'Tissue culture: the auxin to cytokinin ratio', 'Kultur tisu: nisbah auksin kepada sitokinin'),
  aux: T('生长素', 'Auxin', 'Auksin'), ck: T('细胞分裂素', 'Cytokinin', 'Sitokinin'),
  ratio: T('生长素 : 细胞分裂素', 'Auxin : cytokinin', 'Auksin : sitokinin'), out: T('结果', 'Outcome', 'Hasil'),
  roots: T('长根', 'Roots form', 'Akar terbentuk'), shoots: T('长芽', 'Shoots form', 'Pucuk terbentuk'), callus: T('未分化的愈伤组织增生', 'Undifferentiated callus grows', 'Kalus tidak terbeza tumbuh'), none: T('几乎不生长', 'Little or no growth', 'Sedikit atau tiada pertumbuhan'),
};

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  let a = 0, c = 0;   // log10 mg/L, −2…1
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 260, 420)), H = W;
  const M = 34, X = v => M + (v + 2) / 3 * (W - M - 8), Y = v => H - M - (v + 2) / 3 * (H - M - 8);
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg tc-svg', role: 'img', 'aria-label': p(L.title) });
  // Regions in log space: ratio = a − c.
  const poly = (pts, cls) => s('polygon', { points: pts.map(([u, v]) => `${X(u)},${Y(v)}`).join(' '), class: cls });
  svg.append(poly([[-2, -2], [1, -2], [1, 1], [-2, 1]], 'tc-callus'));
  svg.append(poly([[-1, -2], [1, -2], [1, 0]], 'tc-roots'));
  svg.append(poly([[-2, -1], [-2, 1], [0, 1]], 'tc-shoots'));
  svg.append(s('rect', { x: X(-2), y: Y(-1.5), width: X(-1.5) - X(-2), height: Y(-2) - Y(-1.5), class: 'tc-none' }));
  svg.append(s('text', { x: X(0.45), y: Y(-1.55), 'text-anchor': 'middle', class: 'tc-lbl' }, p(L.roots)));
  svg.append(s('text', { x: X(-1.55), y: Y(0.55), 'text-anchor': 'middle', class: 'tc-lbl' }, p(L.shoots)));
  svg.append(s('text', { x: X(-0.5), y: Y(-0.4), 'text-anchor': 'middle', class: 'tc-lbl' }, 'callus'));
  svg.append(s('text', { x: (X(-2) + X(1)) / 2, y: H - 6, 'text-anchor': 'middle', class: 'unit' }, `${p(L.aux)} →`));
  svg.append(s('text', { x: 10, y: (Y(-2) + Y(1)) / 2, 'text-anchor': 'middle', class: 'unit', transform: `rotate(-90 10 ${(Y(-2) + Y(1)) / 2})` }, `${p(L.ck)} →`));
  const dot = s('circle', { r: 8, class: 'w-dot-free' });
  svg.append(dot);
  const rows = readout([['ratio', p(L.ratio)], ['out', p(L.out)]]);
  const sa = slider({ label: p(L.aux), min: -2, max: 1, step: 0.1, value: a, onInput: v => { a = v; update(); } });
  const sc = slider({ label: p(L.ck), min: -2, max: 1, step: 0.1, value: c, onInput: v => { c = v; update(); } });
  function update() {
    dot.setAttribute('cx', X(a)); dot.setAttribute('cy', Y(c));
    const r = a - c;
    const out = a < -1.5 && c < -1.5 ? 'none' : r >= 1 ? 'roots' : r <= -1 ? 'shoots' : 'callus';
    rows.set('ratio', `${fmt(10 ** r, r < 0 ? 2 : 1)} : 1`);
    rows.set('out', p(L[out]));
  }
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'After Skoog & Miller; Hopkins & Hüner 2009, pp. 343–345', children: [svg, h('div', { class: 'w-controls' }, sa, sc), rows] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
