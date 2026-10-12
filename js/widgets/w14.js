/* W14 — The xanthophyll cycle. Set the pool of violaxanthin (V),
   antheraxanthin (A) and zeaxanthin (Z), or pick a light preset, and read
   the de-epoxidation state DEPS = (A/2 + Z)/(V + A + Z). Preset pools are
   illustrative, not measurements. */

import { deps } from '../plantmath.js';
import { s, h, clamp, slider, readout, frame, fmt } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('叶黄素循环：算一算 DEPS', 'The xanthophyll cycle: work out the DEPS', 'Kitaran xantofil: kira DEPS'),
  dark: T('黑暗', 'Dark', 'Gelap'), mid: T('中等光', 'Moderate light', 'Cahaya sederhana'), sun: T('强光', 'Full sun', 'Matahari penuh'),
  deps: T('DEPS', 'DEPS', 'DEPS'), role: T('主要角色', 'Main role', 'Peranan utama'),
  harvest: T('集光：紫黄质把能量交给叶绿素', 'Harvesting: violaxanthin passes energy to chlorophyll', 'Menuai: violaxantin memindahkan tenaga kepada klorofil'),
  both: T('过渡：部分散热保护', 'Transition: some heat dissipation', 'Peralihan: sebahagian pelesapan haba'),
  protect: T('光保护：玉米黄质把多余能量变成热', 'Protection: zeaxanthin turns excess energy into heat', 'Perlindungan: zeaxantin menukar tenaga berlebihan kepada haba'),
};
const PRESETS = { dark: [36, 3, 1], mid: [22, 9, 9], sun: [8, 8, 24] };

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  let [V, A, Z] = PRESETS.mid;
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 280, 600)), H = 70;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg', role: 'img', 'aria-label': p(L.title) });
  const bars = { V: s('rect', { class: 'xc-v', y: 10, height: 30 }), A: s('rect', { class: 'xc-a', y: 10, height: 30 }), Z: s('rect', { class: 'xc-z', y: 10, height: 30 }) };
  const labels = { V: s('text', { y: 30, class: 'xc-l', 'text-anchor': 'middle' }, 'V'), A: s('text', { y: 30, class: 'xc-l', 'text-anchor': 'middle' }, 'A'), Z: s('text', { y: 30, class: 'xc-l', 'text-anchor': 'middle' }, 'Z') };
  svg.append(...Object.values(bars), ...Object.values(labels), s('text', { x: 0, y: 60, class: 'cell-label' }, 'V → A → Z'), s('text', { x: W, y: 60, 'text-anchor': 'end', class: 'cell-label' }, lang === 'zh' ? '强光 →   ← 弱光' : lang === 'ms' ? 'cahaya kuat →   ← cahaya lemah' : 'strong light →   ← weak light'));
  const rows = readout([['deps', p(L.deps)], ['role', p(L.role)]]);
  const sV = slider({ label: 'V', min: 0, max: 40, step: 1, value: V, onInput: v => { V = v; update(); } });
  const sA = slider({ label: 'A', min: 0, max: 40, step: 1, value: A, onInput: v => { A = v; update(); } });
  const sZ = slider({ label: 'Z', min: 0, max: 40, step: 1, value: Z, onInput: v => { Z = v; update(); } });
  const seg = h('div', { class: 'seg', role: 'group' }, Object.keys(PRESETS).map(k => {
    const b = h('button', { type: 'button', class: 'seg-btn' }, p(L[k]));
    b.addEventListener('click', () => { [V, A, Z] = PRESETS[k]; sV.set(V); sA.set(A); sZ.set(Z); update(); });
    return b;
  }));
  function update() {
    const tot = V + A + Z || 1;
    let x0 = 0;
    for (const [k, v] of [['V', V], ['A', A], ['Z', Z]]) {
      const w = v / tot * W;
      bars[k].setAttribute('x', x0); bars[k].setAttribute('width', w);
      labels[k].setAttribute('x', x0 + w / 2); labels[k].style.display = w > 18 ? '' : 'none';
      x0 += w;
    }
    const d = deps(V, A, Z);
    rows.set('deps', `(${A}/2 + ${Z}) / ${V + A + Z} = ${fmt(d, 2)}`);
    rows.set('role', p(d < 0.25 ? L.harvest : d < 0.5 ? L.both : L.protect));
  }
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'DEPS = (A/2 + Z)/(V + A + Z)', children: [seg, svg, h('div', { class: 'w-controls' }, sV, sA, sZ), rows] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
