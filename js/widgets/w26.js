/* W26 — How cold permits flowering: the cereal VRN genes and Arabidopsis
   FLC, with and without a winter. After the lecture notes and Hopkins &
   Hüner 2009, pp. 439–441. */

import { h, frame } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const ST = { on: T('表达/活化', 'on', 'hidup'), off: T('关闭', 'off', 'mati'), sig: T('信号', 'signal', 'isyarat') };
const SYS = {
  cereal: { name: T('禾谷类（VRN）', 'Cereals (VRN)', 'Bijirin (VRN)'),
    warm: [['VRN1', 'off'], [T('VRN2（抑制者）', 'VRN2 (repressor)', 'VRN2 (penindas)'), 'on'], [T('VRN3 = FT', 'VRN3 = FT', 'VRN3 = FT'), 'off'], [T('不开花', 'No flowering', 'Tiada pembungaan'), 'off']],
    cold: [[T('冬季低温', 'Winter cold', 'Sejuk musim sejuk'), 'sig'], ['VRN1', 'on'], [T('VRN2（抑制者）', 'VRN2 (repressor)', 'VRN2 (penindas)'), 'off'], [T('VRN3 = FT', 'VRN3 = FT', 'VRN3 = FT'), 'on'], [T('开花（配合长日）', 'Flowering (with long days)', 'Berbunga (dengan hari panjang)'), 'on']] },
  arab: { name: T('拟南芥（FLC）', 'Arabidopsis (FLC)', 'Arabidopsis (FLC)'),
    warm: [[T('FLC（抑制者）', 'FLC (repressor)', 'FLC (penindas)'), 'on'], ['FT', 'off'], [T('不开花', 'No flowering', 'Tiada pembungaan'), 'off']],
    cold: [[T('冬季低温', 'Winter cold', 'Sejuk musim sejuk'), 'sig'], [T('VRN1/VRN2 复合体使 FLC 沉默', 'VRN1/VRN2 complex silences FLC', 'Kompleks VRN1/VRN2 menyenyapkan FLC'), 'on'], [T('FLC（抑制者）', 'FLC (repressor)', 'FLC (penindas)'), 'off'], ['FT', 'on'], [T('开花', 'Flowering', 'Berbunga'), 'on']] },
};
const L = { title: T('春化：低温怎样解除开花的刹车', 'Vernalisation: how cold releases the brake on flowering', 'Pemvernalan: bagaimana sejuk melepaskan brek pembungaan'), warm: T('没经过冬天', 'No winter', 'Tiada musim sejuk'), cold: T('经过冬季低温', 'After winter cold', 'Selepas sejuk musim sejuk') };

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  let key = 'cereal';
  const body = h('div', {});
  const chain = steps => h('ol', { class: 'hs-chain' }, steps.map(([label, st]) => h('li', { class: `hs-${st}` }, h('span', { class: 'hs-label' }, p(label)), h('span', { class: 'hs-state' }, p(ST[st])))));
  function draw() {
    const x = SYS[key];
    body.replaceChildren(h('div', { class: 'hs-cols' }, h('div', {}, h('p', { class: 'w-label' }, p(L.warm)), chain(x.warm)), h('div', {}, h('p', { class: 'w-label' }, p(L.cold)), chain(x.cold))));
  }
  const seg = h('div', { class: 'seg', role: 'group' }, Object.entries(SYS).map(([k, x]) => {
    const b = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': String(k === key) }, p(x.name));
    b.addEventListener('click', () => { key = k; for (const n of seg.children) n.setAttribute('aria-pressed', String(n === b)); draw(); });
    return b;
  }));
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'Lecture notes; Hopkins & Hüner 2009, pp. 439–441', children: [seg, body] }));
  draw();
  return { destroy() { el.replaceChildren(); } };
}
