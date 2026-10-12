/* W9 — Münch pressure flow. Set the sugar concentration loaded at the
   source and left at the sink; both ends sit beside the same xylem, so
   water moves in until each reaches the xylem's water potential and the
   turgor that results is Ψp = Ψxylem − Ψs. The turgor difference drives
   bulk flow. A teaching model (van 't Hoff at 20 °C), not measured data. */

import { osmoticPotential } from '../plantmath.js';
import { s, h, clamp, slider, readout, frame, fmt } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('压力流：源端装糖、库端卸糖', 'Pressure flow: load at the source, unload at the sink', 'Aliran tekanan: muat di sumber, punggah di sinki'),
  src: T('源端蔗糖', 'Sucrose at source', 'Sukrosa di sumber'), snk: T('库端蔗糖', 'Sucrose at sink', 'Sukrosa di sinki'), xy: T('木质部 Ψ', 'Xylem Ψ', 'Ψ xilem'),
  pSrc: T('源端膨压', 'Turgor at source', 'Turgor di sumber'), pSnk: T('库端膨压', 'Turgor at sink', 'Turgor di sinki'), dir: T('筛管流向', 'Flow in sieve tube', 'Aliran dalam tiub tapis'),
  fwd: T('源 → 库', 'source → sink', 'sumber → sinki'), back: T('库 → 源', 'sink → source', 'sinki → sumber'), none: T('不流动', 'no flow', 'tiada aliran'),
  source: T('源（叶）', 'Source (leaf)', 'Sumber (daun)'), sink: T('库（根/果）', 'Sink (root/fruit)', 'Sinki (akar/buah)'),
  sieve: T('筛管', 'sieve tube', 'tiub tapis'), xylem: T('木质部', 'xylem', 'xilem'),
};

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 280, 640)), H = Math.round(clamp(W * 0.42, 150, 240));
  let cSrc = 0.6, cSnk = 0.1, psiX = -0.5;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg', role: 'img', 'aria-label': p(L.title) });
  const ty = H * 0.3, th = H * 0.22, xy = H * 0.66;
  svg.append(s('rect', { x: W * 0.16, y: xy, width: W * 0.68, height: th * 0.7, rx: 6, class: 'pf-xylem' }));
  svg.append(s('text', { x: W / 2, y: xy + th * 0.47, 'text-anchor': 'middle', class: 'cell-label' }, p(L.xylem)));
  const tube = s('rect', { x: W * 0.16, y: ty, width: W * 0.68, height: th, rx: 8, class: 'pf-tube' });
  svg.append(tube, s('text', { x: W / 2, y: ty - 6, 'text-anchor': 'middle', class: 'cell-label' }, p(L.sieve)));
  const boxS = s('rect', { x: 6, y: ty - 10, width: W * 0.15, height: th + 20, rx: 10, class: 'pf-src' });
  const boxK = s('rect', { x: W * 0.85 - 6, y: ty - 10, width: W * 0.15, height: th + 20, rx: 10, class: 'pf-snk' });
  svg.append(boxS, boxK);
  svg.append(s('text', { x: 6 + W * 0.075, y: H - 6, 'text-anchor': 'middle', class: 'cell-label' }, p(L.source)));
  svg.append(s('text', { x: W * 0.925 - 6, y: H - 6, 'text-anchor': 'middle', class: 'cell-label' }, p(L.sink)));
  const flow = s('g', { class: 'cell-arrows' });
  const water = s('g', { class: 'pf-water' });
  svg.append(flow, water);
  const dots = s('g', { class: 'pf-dots' });
  svg.append(dots);

  const rows = readout([['pSrc', p(L.pSrc)], ['pSnk', p(L.pSnk)], ['dir', p(L.dir)]]);
  const s1 = slider({ label: p(L.src), min: 0, max: 1, step: 0.05, value: cSrc, unit: ' M', onInput: v => { cSrc = v; update(); } });
  const s2 = slider({ label: p(L.snk), min: 0, max: 1, step: 0.05, value: cSnk, unit: ' M', onInput: v => { cSnk = v; update(); } });
  const s3 = slider({ label: p(L.xy), min: -1.5, max: 0, step: 0.05, value: psiX, unit: ' MPa', onInput: v => { psiX = v; update(); } });

  const arrow = (x1, y1, x2, y2) => {
    const a = Math.atan2(y2 - y1, x2 - x1), k = 9;
    return s('g', {}, s('line', { x1, y1, x2, y2 }), s('path', { d: `M${x2},${y2} L${x2 - k * Math.cos(a - 0.5)},${y2 - k * Math.sin(a - 0.5)} L${x2 - k * Math.cos(a + 0.5)},${y2 - k * Math.sin(a + 0.5)} Z` }));
  };
  function update() {
    const pS = Math.max(0, psiX - osmoticPotential(cSrc)), pK = Math.max(0, psiX - osmoticPotential(cSnk));
    const d = pS - pK;
    flow.replaceChildren();
    const mid = ty + th / 2;
    if (Math.abs(d) > 0.01) flow.append(d > 0 ? arrow(W * 0.24, mid, W * 0.76, mid) : arrow(W * 0.76, mid, W * 0.24, mid));
    water.replaceChildren(
      s('text', { x: W * 0.2, y: (ty + th + xy) / 2 + 4, class: 'pf-w' }, pS > 0 ? '↑ H₂O' : ''),
      s('text', { x: W * 0.74, y: (ty + th + xy) / 2 + 4, class: 'pf-w' }, pK < pS ? '↓ H₂O' : ''));
    dots.replaceChildren();
    const n = (c, x0) => { for (let k = 0; k < Math.round(c * 10); k++) dots.append(s('circle', { cx: x0 + 10 + (k % 3) * 12, cy: ty + 2 + Math.floor(k / 3) * 9, r: 3 })); };
    n(cSrc, 6); n(cSnk, W * 0.85 - 6);
    rows.set('pSrc', `${fmt(pS, 2)} MPa`); rows.set('pSnk', `${fmt(pK, 2)} MPa`);
    rows.set('dir', `${p(Math.abs(d) <= 0.01 ? L.none : d > 0 ? L.fwd : L.back)}${Math.abs(d) > 0.01 ? ` (ΔP = ${fmt(Math.abs(d), 2)} MPa)` : ''}`);
  }
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'Ψp = Ψxylem − Ψs; Ψs = −CRT, 20 °C', children: [svg, h('div', { class: 'w-controls' }, s1, s2, s3), rows] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
