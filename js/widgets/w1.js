/* W1 — A cell in a solution. Set the cell's osmotic potential and turgor,
   and the sucrose concentration outside; the figure shows which way water
   moves and where the cell ends up (turgid, or plasmolysed). Formulas:
   plantmath.js (van 't Hoff at 20 °C; rigid wall, volume change ignored). */

import { osmoticPotential, cellInSolution } from '../plantmath.js';
import { s, h, clamp, slider, readout, frame, fmt } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('把细胞放进溶液：水往哪里走？', 'A cell in a solution: which way does water go?', 'Sel dalam larutan: ke mana air bergerak?'),
  sucrose: T('外面蔗糖', 'Sucrose outside', 'Sukrosa di luar'),
  cellS: T('细胞 Ψs', 'Cell Ψs', 'Ψs sel'),
  cellP: T('细胞 Ψp（现在）', 'Cell Ψp (now)', 'Ψp sel (kini)'),
  out: T('外面 Ψ', 'Ψ outside', 'Ψ di luar'),
  cell: T('细胞 Ψ', 'Ψ of the cell', 'Ψ sel'),
  flow: T('水的方向', 'Water moves', 'Air bergerak'),
  end: T('平衡后', 'At equilibrium', 'Pada keseimbangan'),
  in: T('流进细胞', 'into the cell', 'masuk ke sel'),
  outF: T('流出细胞', 'out of the cell', 'keluar dari sel'),
  none: T('不流动', 'no net flow', 'tiada aliran bersih'),
  turgid: T('膨压 Ψp = {p} MPa', 'turgor Ψp = {p} MPa', 'turgor Ψp = {p} MPa'),
  plasm: T('质壁分离（Ψp = 0）', 'plasmolysed (Ψp = 0)', 'plasmolisis (Ψp = 0)'),
  wall: T('细胞壁', 'cell wall', 'dinding sel'),
  proto: T('原生质体', 'protoplast', 'protoplas'),
  sol: T('溶液', 'solution', 'larutan'),
};

export function mount(el, { lang }) {
  const p = k => pick(L[k], lang);
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 280, 560)), H = Math.round(W * 0.62);
  let sucrose = 0.2, psiS = -0.8, psiP = 0.2;

  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg w-cell', role: 'img', 'aria-label': p('title') });
  svg.append(s('rect', { x: 4, y: 4, width: W - 8, height: H - 8, rx: 14, class: 'cell-sol' }));
  svg.append(s('text', { x: 16, y: 24, class: 'cell-label' }, p('sol')));
  const cx = W / 2, cy = H / 2 + 6, cw = W * 0.46, ch = H * 0.56;
  const wall = s('rect', { x: cx - cw / 2, y: cy - ch / 2, width: cw, height: ch, rx: 18, class: 'cell-wall' });
  const proto = s('rect', { rx: 14, class: 'cell-proto' });
  const vac = s('ellipse', { class: 'cell-vac' });
  svg.append(wall, proto, vac);
  svg.append(s('text', { x: cx - cw / 2, y: cy - ch / 2 - 6, class: 'cell-label' }, p('wall')));
  const protoLabel = s('text', { 'text-anchor': 'middle', class: 'cell-label' }, p('proto'));
  svg.append(protoLabel);
  const arrows = s('g', { class: 'cell-arrows' });
  svg.append(arrows);

  const rows = readout([['out', p('out')], ['cell', p('cell')], ['flow', p('flow')], ['end', p('end')]]);
  const sSol = slider({ label: p('sucrose'), min: 0, max: 1, step: 0.05, value: sucrose, unit: ' M', onInput: v => { sucrose = v; update(); } });
  const sS = slider({ label: p('cellS'), min: -1.6, max: -0.2, step: 0.05, value: psiS, unit: ' MPa', onInput: v => { psiS = v; update(); } });
  const sP = slider({ label: p('cellP'), min: 0, max: 1, step: 0.05, value: psiP, unit: ' MPa', onInput: v => { psiP = v; update(); } });

  function arrow(x1, y1, x2, y2) {
    const a = Math.atan2(y2 - y1, x2 - x1), k = 8;
    return s('g', {},
      s('line', { x1, y1, x2, y2 }),
      s('path', { d: `M${x2},${y2} L${x2 - k * Math.cos(a - 0.5)},${y2 - k * Math.sin(a - 0.5)} L${x2 - k * Math.cos(a + 0.5)},${y2 - k * Math.sin(a + 0.5)} Z` }));
  }

  function update() {
    const psiOut = osmoticPotential(sucrose, 1, 20);
    const r = cellInSolution({ psiS, psiP: Math.min(psiP, -psiS), psiOut });
    // How far the protoplast pulls away from the wall once plasmolysed.
    const shrink = r.plasmolysed ? clamp((psiS - psiOut) / -psiS, 0, 0.45) : 0;
    const inset = 5 + shrink * Math.min(cw, ch) * 0.8;
    const pw = cw - 2 * inset, ph = ch - 2 * inset;
    proto.setAttribute('x', cx - pw / 2); proto.setAttribute('y', cy - ph / 2);
    proto.setAttribute('width', pw); proto.setAttribute('height', ph);
    vac.setAttribute('cx', cx); vac.setAttribute('cy', cy + 4);
    vac.setAttribute('rx', pw * 0.32); vac.setAttribute('ry', ph * 0.28);
    protoLabel.setAttribute('x', cx); protoLabel.setAttribute('y', cy - ph / 2 + 18);

    arrows.replaceChildren();
    if (r.flow !== 'none') {
      const ins = r.flow === 'in';
      for (const [x0, y0, x1, y1] of [[16, cy, cx - cw / 2 - 6, cy], [W - 16, cy, cx + cw / 2 + 6, cy]]) {
        arrows.append(ins ? arrow(x0, y0, x1, y1) : arrow(x1, y1, x0, y0));
      }
      arrows.append(s('text', { x: 18, y: cy - 10, class: 'cell-label' }, 'H₂O'));
    }
    const psiCell = Math.min(psiP, -psiS) + psiS;
    rows.set('out', `${fmt(psiOut, 2)} MPa`);
    rows.set('cell', `${fmt(psiCell, 2)} MPa`);
    rows.set('flow', p(r.flow === 'in' ? 'in' : r.flow === 'out' ? 'outF' : 'none'));
    rows.set('end', r.plasmolysed ? p('plasm') : p('turgid').replace('{p}', fmt(r.finalP, 2)));
    svg.classList.toggle('is-plasmolysed', r.plasmolysed);
  }

  el.append(frame({ title: p('title'), lang, schematic: true, source: 'Ψs = −CiRT, 20 °C; Ψ = Ψp + Ψs', children: [svg, h('div', { class: 'w-controls' }, sSol, sS, sP), rows] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
