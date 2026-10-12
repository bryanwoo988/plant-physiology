/* W6 — Light, colour and pigments. Drag along the spectrum: the readout
   gives the photon's energy, and the curves show how strongly chlorophyll
   a, chlorophyll b and carotenoids absorb there. Curves are schematic
   (peak positions after Hopkins & Hüner 2009); energies are E = hc/λ. */

import { photonJ, photonKJmol, SPECTRA } from '../plantmath.js';
import { s, h, scale, clamp, slider, readout, frame, fmt, track } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('光的颜色、能量，与谁吸收它', 'Colour, energy, and which pigment absorbs it', 'Warna, tenaga, dan pigmen mana yang menyerapnya'),
  wl: T('波长', 'Wavelength', 'Panjang gelombang'),
  ej: T('每个光子', 'Per photon', 'Setiap foton'),
  em: T('每摩尔光子', 'Per mole of photons', 'Setiap mol foton'),
  band: T('区段', 'Band', 'Jalur'),
  chlA: T('叶绿素 a', 'Chlorophyll a', 'Klorofil a'), chlB: T('叶绿素 b', 'Chlorophyll b', 'Klorofil b'), carot: T('类胡萝卜素', 'Carotenoids', 'Karotenoid'),
  uv: T('紫外 UV-A', 'Ultraviolet (UV-A)', 'Ultraungu (UV-A)'), blue: T('蓝紫光', 'Violet–blue', 'Ungu–biru'), green: T('绿光', 'Green', 'Hijau'),
  yellow: T('黄橙光', 'Yellow–orange', 'Kuning–jingga'), red: T('红光', 'Red', 'Merah'), fr: T('远红光', 'Far-red', 'Merah jauh'),
  abs: T('相对吸收', 'Relative absorbance', 'Penyerapan relatif'),
};
const MIN = 380, MAX = 750;
const SERIES = [['chlA', 'leaf'], ['chlB', 'rain'], ['carot', 'sun']];

function bandOf(nm) {
  if (nm < 400) return 'uv'; if (nm < 490) return 'blue'; if (nm < 560) return 'green';
  if (nm < 620) return 'yellow'; if (nm <= 700) return 'red'; return 'fr';
}
// Approximate visible colour for the gradient strip.
function hue(nm) {
  if (nm < 400 || nm > 700) return nm < 400 ? 'hsl(275 60% 35%)' : 'hsl(0 70% 22%)';
  const stops = [[400, 270], [450, 235], [490, 190], [530, 120], [570, 60], [600, 30], [650, 5], [700, 0]];
  for (let i = 1; i < stops.length; i++) if (nm <= stops[i][0]) {
    const [a, ha] = stops[i - 1], [b, hb] = stops[i];
    return `hsl(${ha + (hb - ha) * (nm - a) / (b - a)} 85% 50%)`;
  }
  return 'hsl(0 85% 45%)';
}

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 280, 680)), H = Math.round(clamp(W * 0.55, 210, 320));
  const M = { t: 14, r: 12, b: 40, l: 16 };
  const x = scale(MIN, MAX, M.l, W - M.r), y = scale(0, 1.05, H - M.b - 14, M.t);
  let nm = 662;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg', role: 'img', 'aria-label': p(L.title) });
  const defs = s('defs', {});
  const grad = s('linearGradient', { id: 'w6-spec', x1: '0', x2: '1', y1: '0', y2: '0' });
  for (let v = MIN; v <= MAX; v += 10) grad.append(s('stop', { offset: `${(v - MIN) / (MAX - MIN) * 100}%`, 'stop-color': hue(v) }));
  defs.append(grad); svg.append(defs);
  svg.append(s('rect', { x: M.l, y: H - M.b - 10, width: W - M.l - M.r, height: 10, fill: 'url(#w6-spec)', rx: 3 }));
  const ax = s('g', { class: 'chart-axes' });
  for (let v = 400; v <= 700; v += 50) ax.append(s('text', { x: x(v), y: H - M.b + 14, 'text-anchor': 'middle' }, String(v)));
  ax.append(s('text', { x: W - M.r, y: H - 6, 'text-anchor': 'end', class: 'unit' }, 'nm'));
  svg.append(ax);
  for (const [k, c] of SERIES) {
    let d = '';
    for (let v = MIN; v <= MAX; v += 2) d += `${v === MIN ? 'M' : 'L'}${x(v).toFixed(1)},${y(SPECTRA[k](v)).toFixed(1)}`;
    svg.append(s('path', { d, class: 'series', style: `stroke: var(--${c})` }));
  }
  const cursor = s('line', { y1: M.t, y2: H - M.b, class: 'w-cursor' });
  svg.append(cursor);
  const legend = h('ul', { class: 'chart-legend' }, SERIES.map(([k, c]) => h('li', {}, h('span', { class: 'swatch', style: `--c: var(--${c})` }), p(L[k]))));
  const rows = readout([['band', p(L.band)], ['ej', p(L.ej)], ['em', p(L.em)], ['chlA', p(L.chlA)], ['chlB', p(L.chlB)], ['carot', p(L.carot)]]);
  const sl = slider({ label: p(L.wl), min: MIN, max: MAX, step: 1, value: nm, unit: ' nm', onInput: v => { nm = v; update(); } });
  function update() {
    cursor.setAttribute('x1', x(nm)); cursor.setAttribute('x2', x(nm));
    rows.set('band', p(L[bandOf(nm)]));
    rows.set('ej', `${fmt(photonJ(nm) * 1e19, 2)} × 10⁻¹⁹ J`);
    rows.set('em', `${fmt(photonKJmol(nm), 0)} kJ/mol`);
    for (const [k] of SERIES) rows.set(k, `${fmt(Math.min(1, SPECTRA[k](nm)) * 100, 0)} %`);
    sl.set(nm);
  }
  track(svg, pt => { nm = clamp(Math.round(x.invert(pt.x)), MIN, MAX); update(); });
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'E = hc/λ; peak positions after Hopkins & Hüner 2009, Figs 6.8 and 6.12', children: [legend, svg, h('div', { class: 'w-controls' }, sl), rows] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
