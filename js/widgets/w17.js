/* W17 — The Lockhart relation dV/dt = m(P − Y). Set turgor, the yield
   threshold and wall extensibility; the ‘acid growth’ button raises m the
   way wall acidification and expansins do. Units are relative. */

import { s, h, scale, clamp, slider, readout, frame, fmt } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('细胞伸长：dV/dt = m(P − Y)', 'Cell enlargement: dV/dt = m(P − Y)', 'Pembesaran sel: dV/dt = m(P − Y)'),
  P: T('膨压 P', 'Turgor P', 'Turgor P'), Y: T('屈服阈值 Y', 'Yield threshold Y', 'Ambang alah Y'), m: T('伸展性 m', 'Extensibility m', 'Keterlanjuran m'),
  acid: T('酸化细胞壁（生长素 → H⁺ → 扩张蛋白）', 'Acidify the wall (auxin → H⁺ → expansins)', 'Asidkan dinding (auksin → H⁺ → ekspansin)'),
  rate: T('生长速率', 'Growth rate', 'Kadar pertumbuhan'),
  state: T('状态', 'State', 'Keadaan'),
  none: T('膨压没超过 Y：不生长', 'Turgor below Y: no growth', 'Turgor di bawah Y: tiada pertumbuhan'),
  grow: T('生长中', 'Growing', 'Sedang tumbuh'),
};

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  let P = 0.6, Y = 0.3, m = 1;
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 280, 600)), H = 120;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg', role: 'img', 'aria-label': p(L.title) });
  const x = scale(0, 1, 20, W - 20);
  svg.append(s('line', { x1: x(0), x2: x(1), y1: 90, y2: 90, class: 'gauge-ground' }));
  for (const v of [0, 0.25, 0.5, 0.75, 1]) svg.append(s('text', { x: x(v), y: 108, 'text-anchor': 'middle', class: 'chart-tick' }, `${v} MPa`));
  const pBar = s('rect', { y: 70, height: 20, class: 'lk-p' });
  const yMark = s('line', { y1: 60, y2: 96, class: 'lk-y' });
  const yLbl = s('text', { y: 56, 'text-anchor': 'middle', class: 'lk-ylbl' }, 'Y');
  const cell = s('rect', { x: 20, y: 14, height: 34, rx: 14, class: 'lk-cell' });
  svg.append(pBar, yMark, yLbl, cell);
  const rows = readout([['rate', p(L.rate)], ['state', p(L.state)]]);
  const sP = slider({ label: p(L.P), min: 0, max: 1, step: 0.05, value: P, unit: ' MPa', onInput: v => { P = v; update(); } });
  const sY = slider({ label: p(L.Y), min: 0, max: 1, step: 0.05, value: Y, unit: ' MPa', onInput: v => { Y = v; update(); } });
  const sM = slider({ label: p(L.m), min: 0.2, max: 3, step: 0.1, value: m, onInput: v => { m = v; update(); } });
  const acid = h('button', { type: 'button', class: 'button button-quiet' }, p(L.acid));
  acid.addEventListener('click', () => { m = Math.min(3, Math.round((m * 2) * 10) / 10); sM.set(m); update(); });
  function update() {
    const r = Math.max(0, m * (P - Y));
    pBar.setAttribute('x', x(0)); pBar.setAttribute('width', x(P) - x(0));
    yMark.setAttribute('x1', x(Y)); yMark.setAttribute('x2', x(Y)); yLbl.setAttribute('x', x(Y));
    cell.setAttribute('width', 60 + Math.min(1, r / 2) * (W - 100));
    rows.set('rate', fmt(r, 2));
    rows.set('state', p(r > 0 ? L.grow : L.none));
  }
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'Lockhart: dV/dt = m(P − Y); relative units', children: [svg, h('div', { class: 'w-controls' }, sP, sY, sM), acid, rows] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
