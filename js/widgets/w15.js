/* W15 — C₃, C₄ and CAM over a day. For each pathway, when the stomata are
   open, when and where CO₂ is first fixed, and where the Calvin cycle
   runs. Schematic timelines after Hopkins & Hüner 2009, pp. 263–269. */

import { s, h, clamp, frame } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('C₃、C₄、CAM：一天里谁在什么时候工作', 'C₃, C₄ and CAM: who works when, over a day', 'C₃, C₄ dan CAM: siapa bekerja bila, sepanjang hari'),
  rows: [T('气孔开', 'Stomata open', 'Stoma terbuka'), T('PEP 羧化酶', 'PEP carboxylase', 'PEP karboksilase'), T('Rubisco / 卡尔文循环', 'Rubisco / Calvin cycle', 'Rubisco / kitaran Calvin')],
  night: T('夜', 'night', 'malam'), day: T('昼', 'day', 'siang'),
  notes: {
    c3: T('C₃：白天开气孔，rubisco 直接固定 CO₂，在同一个叶肉细胞里完成。光呼吸明显。', 'C₃: stomata open by day; rubisco fixes CO₂ directly in the same mesophyll cell. Photorespiration is significant.', 'C₃: stoma terbuka pada siang hari; rubisco mengikat CO₂ terus dalam sel mesofil yang sama. Fotorespirasi ketara.'),
    c4: T('C₄：白天开气孔；PEP 羧化酶在叶肉细胞固定，rubisco 在维管束鞘工作——空间分隔。', 'C₄: stomata open by day; PEP carboxylase fixes in the mesophyll and rubisco works in the bundle sheath — separated in space.', 'C₄: stoma terbuka pada siang hari; PEP karboksilase mengikat dalam mesofil dan rubisco bekerja dalam seludang berkas — dipisahkan dari segi ruang.'),
    cam: T('CAM：夜里开气孔，PEP 羧化酶把 CO₂ 存成苹果酸；白天关气孔，rubisco 在同一个细胞里用掉它——时间分隔。', 'CAM: stomata open at night and PEP carboxylase stores CO₂ as malate; by day, with stomata shut, rubisco uses it in the same cell — separated in time.', 'CAM: stoma terbuka pada waktu malam dan PEP karboksilase menyimpan CO₂ sebagai malat; pada siang hari, dengan stoma tertutup, rubisco menggunakannya dalam sel yang sama — dipisahkan dari segi masa.'),
  },
};
// Active spans in hours [start, end) for [stomata, PEPcase, rubisco]; day = 6–18 h.
const SPANS = { c3: [[[6, 18]], [], [[6, 18]]], c4: [[[6, 18]], [[6, 18]], [[6, 18]]], cam: [[[0, 6], [18, 24]], [[0, 6], [18, 24]], [[6, 18]]] };
const WHERE = { c3: ['', '', T('叶肉', 'mesophyll', 'mesofil')], c4: ['', T('叶肉', 'mesophyll', 'mesofil'), T('维管束鞘', 'bundle sheath', 'seludang berkas')], cam: ['', T('同一细胞', 'same cell', 'sel sama'), T('同一细胞', 'same cell', 'sel sama')] };

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  let type = 'c4';
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 300, 640)), RH = 34, LW = Math.min(150, W * 0.32), H = RH * 3 + 34;
  const x = hr => LW + hr / 24 * (W - LW - 6);
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg', role: 'img', 'aria-label': p(L.title) });
  svg.append(s('rect', { x: x(0), y: 0, width: x(6) - x(0), height: RH * 3, class: 'tl-night' }), s('rect', { x: x(18), y: 0, width: x(24) - x(18), height: RH * 3, class: 'tl-night' }));
  L.rows.forEach((r, i) => svg.append(s('text', { x: 0, y: i * RH + RH / 2 + 4, class: 'cell-label' }, p(r))));
  for (const hr of [0, 6, 12, 18, 24]) svg.append(s('text', { x: x(hr), y: H - 4, 'text-anchor': 'middle', class: 'chart-tick' }, `${hr}:00`));
  svg.append(s('text', { x: (x(0) + x(6)) / 2, y: RH * 3 + 14, 'text-anchor': 'middle', class: 'chart-tick' }, p(L.night)), s('text', { x: (x(6) + x(18)) / 2, y: RH * 3 + 14, 'text-anchor': 'middle', class: 'chart-tick' }, p(L.day)));
  const bars = s('g', {});
  svg.append(bars);
  const note = h('p', { class: 'w-explain' });
  function draw() {
    bars.replaceChildren();
    SPANS[type].forEach((spans, i) => spans.forEach(([a, b]) => {
      bars.append(s('rect', { x: x(a), y: i * RH + 7, width: x(b) - x(a), height: RH - 14, rx: 6, class: `tl-bar tl-${i}` }));
      const w = WHERE[type][i];
      if (w && b - a >= 6) bars.append(s('text', { x: (x(a) + x(b)) / 2, y: i * RH + RH / 2 + 4, 'text-anchor': 'middle', class: 'tl-in' }, p(w)));
    }));
    note.textContent = p(L.notes[type]);
  }
  const seg = h('div', { class: 'seg', role: 'group' }, ['c3', 'c4', 'cam'].map(k => {
    const b = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': String(k === type) }, k === 'c3' ? 'C₃' : k === 'c4' ? 'C₄' : 'CAM');
    b.addEventListener('click', () => { type = k; for (const n of seg.children) n.setAttribute('aria-pressed', String(n === b)); draw(); });
    return b;
  }));
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'Hopkins & Hüner 2009, pp. 263–269', children: [seg, svg, note] }));
  draw();
  return { destroy() { el.replaceChildren(); } };
}
