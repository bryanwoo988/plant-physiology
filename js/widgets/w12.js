/* W12 — Light-response curve of net photosynthesis. Drag along the light
   axis; switch leaf type to compare a sun leaf, a shade leaf and (when the
   chapter asks for it) a C₄ leaf. Curves are a non-rectangular hyperbola
   (plantmath.js) with illustrative parameters — the shapes, the
   compensation and saturation points, not any measured species. */

import { netPhotosynthesis, compensationPoint } from '../plantmath.js';
import { s, h, scale, clamp, slider, readout, frame, fmt, track, niceTicks } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const TYPES = {
  sun: { name: T('阳生叶（C₃）', 'Sun leaf (C₃)', 'Daun cahaya (C₃)'), color: 'sun', p: { phi: 0.05, pmax: 24, theta: 0.8, rd: 1.8 } },
  shade: { name: T('阴生叶（C₃）', 'Shade leaf (C₃)', 'Daun teduh (C₃)'), color: 'leaf', p: { phi: 0.05, pmax: 7, theta: 0.85, rd: 0.4 } },
  c4: { name: T('C₄ 叶', 'C₄ leaf', 'Daun C₄'), color: 'rain', p: { phi: 0.055, pmax: 55, theta: 0.6, rd: 2 } },
};
const L = {
  title: T('光响应曲线：光越多，光合越快吗？', 'Light-response curve: does more light always help?', 'Lengkung tindak balas cahaya: adakah lebih cahaya sentiasa membantu?'),
  light: T('光量（PAR）', 'Light (PAR)', 'Cahaya (PAR)'),
  net: T('净光合', 'Net photosynthesis', 'Fotosintesis bersih'),
  lcp: T('光补偿点', 'Compensation point', 'Titik pampasan'),
  sat: T('约 90 % 饱和于', '~90 % saturated at', '~90 % tepu pada'),
  y: T('CO₂ 吸收', 'CO₂ uptake', 'Pengambilan CO₂'),
};
const MAX = 2000;

export function mount(el, { lang, opts = {} }) {
  const p = v => pick(v, lang);
  const types = (opts.types ?? ['sun', 'shade']).filter(k => TYPES[k]);
  let sel = types[0], I = 400;
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 280, 640)), H = Math.round(clamp(W * 0.6, 200, 340));
  const M = { t: 18, r: 14, b: 36, l: 40 };
  const top = Math.max(...types.map(k => TYPES[k].p.pmax)) * 0.9;
  const x = scale(0, MAX, M.l, W - M.r), y = scale(-4, top, H - M.b, M.t);
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg', role: 'img', 'aria-label': p(L.title) });
  const ax = s('g', { class: 'chart-axes' });
  for (const v of niceTicks(-4, top, 5)) {
    ax.append(s('line', { x1: M.l, x2: W - M.r, y1: y(v), y2: y(v), class: v === 0 ? 'ref-line' : 'grid' }));
    ax.append(s('text', { x: M.l - 6, y: y(v) + 4, 'text-anchor': 'end' }, String(v)));
  }
  for (let v = 0; v <= MAX; v += 500) ax.append(s('text', { x: x(v), y: H - M.b + 16, 'text-anchor': 'middle' }, String(v)));
  ax.append(s('text', { x: 2, y: 12, class: 'unit' }, 'μmol m⁻² s⁻¹'));
  ax.append(s('text', { x: W - M.r, y: H - 4, 'text-anchor': 'end', class: 'unit' }, `${p(L.light)} μmol m⁻² s⁻¹`));
  svg.append(ax);
  const curves = {};
  for (const k of types) {
    let d = '';
    for (let v = 0; v <= MAX; v += 10) d += `${v ? 'L' : 'M'}${x(v).toFixed(1)},${y(netPhotosynthesis(v, TYPES[k].p)).toFixed(1)}`;
    curves[k] = s('path', { d, class: 'series', style: `stroke: var(--${TYPES[k].color})` });
    svg.append(curves[k]);
  }
  const lcpMark = s('circle', { r: 5, class: 'lrc-lcp' });
  const cursor = s('line', { y1: M.t, y2: H - M.b, class: 'w-cursor' });
  const dot = s('circle', { r: 7, class: 'w-dot-free' });
  svg.append(cursor, lcpMark, dot);
  const seg = h('div', { class: 'seg', role: 'group' }, types.map(k => {
    const b = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': String(k === sel) }, h('span', { class: 'swatch', style: `--c: var(--${TYPES[k].color})` }), p(TYPES[k].name));
    b.addEventListener('click', () => { sel = k; for (const n of seg.children) n.setAttribute('aria-pressed', String(n === b)); update(); });
    return b;
  }));
  const rows = readout([['net', p(L.net)], ['lcp', p(L.lcp)], ['sat', p(L.sat)]]);
  const sl = slider({ label: p(L.light), min: 0, max: MAX, step: 10, value: I, onInput: v => { I = v; update(); } });
  function update() {
    const par = TYPES[sel].p;
    for (const k of types) curves[k].classList.toggle('is-dim', k !== sel);
    const a = netPhotosynthesis(I, par), lcp = compensationPoint(par);
    const asym = par.pmax - par.rd;
    let sat = null;
    for (let v = 0; v <= MAX; v += 5) if (netPhotosynthesis(v, par) >= 0.9 * asym) { sat = v; break; }
    cursor.setAttribute('x1', x(I)); cursor.setAttribute('x2', x(I));
    dot.setAttribute('cx', x(I)); dot.setAttribute('cy', y(a));
    lcpMark.setAttribute('cx', x(lcp)); lcpMark.setAttribute('cy', y(0));
    rows.set('net', `${fmt(a, 1)} μmol m⁻² s⁻¹`);
    rows.set('lcp', `≈ ${fmt(lcp, 0)} μmol m⁻² s⁻¹`);
    rows.set('sat', sat === null ? `> ${MAX}` : `≈ ${sat} μmol m⁻² s⁻¹`);
    sl.set(I);
  }
  track(svg, pt => { I = clamp(Math.round(x.invert(pt.x) / 10) * 10, 0, MAX); update(); });
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'Non-rectangular hyperbola; illustrative parameters', children: [seg, svg, h('div', { class: 'w-controls' }, sl), rows] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
