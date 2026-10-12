/* W5 — How far from equilibrium? ATP hydrolysis (ΔG°′ = −32.2 kJ/mol):
   slide the actual mass-action ratio Γ = [ADP][Pi]/[ATP] and read the free
   energy actually released. At Γ = Keq nothing is left; cells hold Γ near
   10⁻⁴, which yields about −55 kJ/mol. ΔG = ΔG°′ + 2.3RT log Γ. */

import { deltaG, RT23 } from '../plantmath.js';
import { s, h, scale, clamp, slider, readout, frame, fmt, track } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('ATP 离平衡多远，就能做多少功', 'ATP does as much work as it is far from equilibrium', 'ATP melakukan kerja setakat jaraknya dari keseimbangan'),
  gamma: T('log Γ（Γ = [ADP][Pi]/[ATP]）', 'log Γ (Γ = [ADP][Pi]/[ATP])', 'log Γ (Γ = [ADP][Pi]/[ATP])'),
  dg: T('ΔG（每 mol ATP）', 'ΔG (per mol ATP)', 'ΔG (per mol ATP)'),
  state: T('状态', 'State', 'Keadaan'),
  exer: T('放能：可以做功', 'Exergonic — can do work', 'Eksergonik — boleh melakukan kerja'),
  eq: T('平衡：做不了功', 'At equilibrium — no work', 'Pada keseimbangan — tiada kerja'),
  ender: T('吸能：反应会反过来合成 ATP', 'Endergonic — the reaction would run backwards', 'Endergonik — tindak balas akan berbalik'),
  cell: T('细胞里', 'in cells', 'dalam sel'),
  keq: T('平衡', 'equilibrium', 'keseimbangan'),
};
const DG0 = -32.2, MIN = -8, MAX = 8;

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 280, 640)), H = Math.round(clamp(W * 0.55, 200, 320));
  const M = { t: 18, r: 14, b: 34, l: 44 };
  const x = scale(MIN, MAX, M.l, W - M.r), y = scale(-80, 20, H - M.b, M.t);
  const logKeq = -DG0 / RT23;
  let g = -4;

  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg', role: 'img', 'aria-label': p(L.title) });
  const ax = s('g', { class: 'chart-axes' });
  for (const v of [-80, -60, -40, -20, 0, 20]) {
    ax.append(s('line', { x1: M.l, x2: W - M.r, y1: y(v), y2: y(v), class: v === 0 ? 'ref-line' : 'grid' }));
    ax.append(s('text', { x: M.l - 6, y: y(v) + 4, 'text-anchor': 'end' }, String(v)));
  }
  for (let v = MIN; v <= MAX; v += 4) ax.append(s('text', { x: x(v), y: H - M.b + 16, 'text-anchor': 'middle' }, String(v)));
  ax.append(s('text', { x: M.l - 6, y: M.t - 4, 'text-anchor': 'end', class: 'unit' }, 'kJ/mol'));
  ax.append(s('text', { x: (M.l + W - M.r) / 2, y: H - 4, 'text-anchor': 'middle', class: 'unit' }, 'log Γ'));
  svg.append(ax);
  svg.append(s('path', { class: 'series', style: 'stroke: var(--accent)', d: `M${x(MIN)},${y(deltaG(DG0, MIN))} L${x(MAX)},${y(deltaG(DG0, MAX))}` }));
  svg.append(s('line', { x1: x(-4), x2: x(-4), y1: M.t, y2: H - M.b, class: 'ref-line' }), s('text', { x: x(-4) + 4, y: M.t + 10, class: 'ref-label' }, p(L.cell)));
  svg.append(s('line', { x1: x(logKeq), x2: x(logKeq), y1: M.t, y2: H - M.b, class: 'ref-line' }), s('text', { x: x(logKeq) - 4, y: M.t + 10, 'text-anchor': 'end', class: 'ref-label' }, `${p(L.keq)} (Keq)`));
  const dot = s('circle', { r: 8, class: 'w-dot-free' });
  svg.append(dot);

  const rows = readout([['dg', p(L.dg)], ['state', p(L.state)]]);
  const sG = slider({ label: p(L.gamma), min: MIN, max: MAX, step: 0.1, value: g, onInput: v => { g = v; update(); } });
  function update() {
    const dg = deltaG(DG0, g);
    dot.setAttribute('cx', x(g)); dot.setAttribute('cy', y(dg));
    rows.set('dg', `${fmt(dg, 1)} kJ/mol`);
    rows.set('state', p(Math.abs(dg) < 0.6 ? L.eq : dg < 0 ? L.exer : L.ender));
    sG.set(Math.round(g * 10) / 10);
  }
  track(svg, pt => { g = clamp(Math.round(x.invert(pt.x) * 10) / 10, MIN, MAX); update(); });
  el.append(frame({ title: p(L.title), lang, source: 'ΔG = ΔG°′ + 2.3RT log Γ; ΔG°′ = −32.2 kJ/mol (Hopkins & Hüner 2009)', children: [svg, h('div', { class: 'w-controls' }, sG), rows] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
