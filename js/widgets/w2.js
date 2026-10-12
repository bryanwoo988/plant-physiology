/* W2 — The soil–plant–atmosphere continuum. Drag the humidity of the air
   and the dryness of the soil; bars show the water potential at each stop
   on a logarithmic scale, so −0.3 and −100 MPa fit on one figure. Air Ψ
   from Ψ = (RT/V̄w) ln RH (plantmath.js); plant values are typical, not
   measured. */

import { airWaterPotential } from '../plantmath.js';
import { s, h, clamp, slider, readout, frame, fmt } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('土壤—植物—大气：水沿着水势往下走', 'Soil–plant–air: water runs down the potential gradient', 'Tanah–tumbuhan–udara: air menuruni kecerunan keupayaan'),
  rh: T('空气相对湿度', 'Air relative humidity', 'Kelembapan relatif udara'),
  soil: T('土壤水势', 'Soil Ψ', 'Ψ tanah'),
  stops: [T('土壤', 'Soil', 'Tanah'), T('根', 'Root', 'Akar'), T('叶', 'Leaf', 'Daun'), T('空气', 'Air', 'Udara')],
  air: T('空气 Ψ', 'Air Ψ', 'Ψ udara'),
  drop: T('叶 → 空气的落差', 'Leaf → air drop', 'Penurunan daun → udara'),
  note: T('能吸水吗', 'Can roots take up water?', 'Bolehkah akar menyerap air?'),
  yes: T('可以', 'Yes', 'Ya'),
  wilt: T('不行：已低于约 −1.5 MPa', 'No — below about −1.5 MPa', 'Tidak — di bawah kira-kira −1.5 MPa'),
};

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 280, 640)), H = Math.round(clamp(W * 0.62, 220, 340));
  const M = { t: 20, r: 12, b: 34, l: 52 };
  let rh = 60, soil = -0.3;
  // log10(|Ψ|) from 0.1 to 300 MPa, drawn downwards: more negative is lower.
  const LO = Math.log10(0.1), HI = Math.log10(300);
  const y = v => M.t + (Math.log10(Math.max(Math.abs(v), 0.1)) - LO) / (HI - LO) * (H - M.t - M.b);

  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg', role: 'img', 'aria-label': p(L.title) });
  const ax = s('g', { class: 'chart-axes' });
  for (const v of [0.1, 0.3, 1, 3, 10, 30, 100, 300]) {
    ax.append(s('line', { x1: M.l, x2: W - M.r, y1: y(v), y2: y(v), class: 'grid' }));
    ax.append(s('text', { x: M.l - 6, y: y(v) + 4, 'text-anchor': 'end' }, `−${v}`));
  }
  ax.append(s('text', { x: M.l - 6, y: H - 8, 'text-anchor': 'end', class: 'unit' }, 'MPa'));
  svg.append(ax);
  const n = 4, slot = (W - M.l - M.r) / n;
  const bars = L.stops.map((name, i) => {
    const g = s('g', {});
    const r = s('rect', { x: M.l + i * slot + slot * 0.2, width: slot * 0.6, y: M.t, class: `spa-bar spa-${i}` });
    const t = s('text', { x: M.l + i * slot + slot / 2, 'text-anchor': 'middle', class: 'spa-val' });
    g.append(r, t, s('text', { x: M.l + i * slot + slot / 2, y: H - 12, 'text-anchor': 'middle', class: 'spa-name' }, p(name)));
    svg.append(g);
    return { r, t };
  });

  const rows = readout([['air', p(L.air)], ['drop', p(L.drop)], ['note', p(L.note)]]);
  const sR = slider({ label: p(L.rh), min: 20, max: 99, step: 1, value: rh, unit: ' %', onInput: v => { rh = v; update(); } });
  const sS = slider({ label: p(L.soil), min: -2, max: -0.05, step: 0.05, value: soil, unit: ' MPa', onInput: v => { soil = v; update(); } });

  function update() {
    const air = airWaterPotential(rh / 100, 20);
    // Typical in-plant drops; the leaf can never be wetter than the soil.
    const root = soil - 0.3, leaf = soil - 0.8;
    const vals = [soil, root, leaf, air];
    vals.forEach((v, i) => {
      const yy = y(v);
      bars[i].r.setAttribute('height', Math.max(1, yy - M.t));
      bars[i].t.setAttribute('y', Math.min(yy + 14, H - M.b - 4));
      bars[i].t.textContent = fmt(v, Math.abs(v) < 10 ? 2 : 0);
    });
    rows.set('air', `${fmt(air, 1)} MPa`);
    rows.set('drop', `${fmt(leaf - air, 1)} MPa`);
    rows.set('note', p(soil > -1.5 ? L.yes : L.wilt));
  }
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'Ψair = (RT/V̄w) ln RH, 20 °C (Hopkins & Hüner 2009, Table 2.2)', children: [svg, h('div', { class: 'w-controls' }, sR, sS), rows] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
