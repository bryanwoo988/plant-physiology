/* W18 — The chemiosmotic model of polar auxin transport, step by step,
   with an NPA switch that blocks the PIN efflux carriers. Schematic,
   after Hopkins & Hüner 2009, pp. 319–321 and the lecture notes. */

import { s, h, clamp, frame } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const STEPS = [
  ['wall', T('① 细胞壁偏酸：约 80 % 的 IAA 解离成 IAA⁻，其余是不带电的 IAAH。', '① The wall is acidic: about 80 % of IAA is IAA⁻, the rest uncharged IAAH.', '① Dinding berasid: kira-kira 80 % IAA ialah IAA⁻, bakinya IAAH tidak bercas.')],
  ['in', T('② 细胞顶端：IAA⁻ 与 H⁺ 一起经 AUX1 内流载体同向进入；IAAH 靠扩散穿膜。', '② At the top: IAA⁻ enters with H⁺ through the AUX1 influx carrier; IAAH diffuses across.', '② Di atas: IAA⁻ masuk bersama H⁺ melalui pembawa influks AUX1; IAAH meresap merentas.')],
  ['trap', T('③ 细胞质 pH ≈ 7：IAAH 全部解离成 IAA⁻，带电，出不去——“阴离子陷阱”。', '③ Cytosol at pH ≈ 7: all IAAH dissociates to IAA⁻, which is charged and cannot leave — an anion trap.', '③ Sitosol pada pH ≈ 7: semua IAAH terurai kepada IAA⁻, yang bercas dan tidak boleh keluar — perangkap anion.')],
  ['out', T('④ 细胞基部：IAA⁻ 只能经 PIN 外排载体离开，进入下一个细胞的细胞壁。', '④ At the base: IAA⁻ leaves only through PIN efflux carriers, into the wall of the next cell.', '④ Di pangkal: IAA⁻ hanya keluar melalui pembawa efluks PIN, ke dinding sel seterusnya.')],
  ['pump', T('⑤ 质膜 H⁺-ATP 酶把 H⁺ 泵出，维持细胞壁酸性和膜电位——整个运输的能量来源。', '⑤ The plasma-membrane H⁺-ATPase pumps H⁺ out, keeping the wall acidic and the membrane polarised — the energy for the whole process.', '⑤ H⁺-ATPase membran plasma mengepam H⁺ keluar, mengekalkan dinding berasid dan membran berkutub — tenaga untuk keseluruhan proses.')],
];
const L = {
  title: T('生长素极性运输：化学渗透模型', 'Polar auxin transport: the chemiosmotic model', 'Pengangkutan auksin berkutub: model kemiosmosis'),
  prev: T('上一步', 'Back', 'Kembali'), next: T('下一步', 'Next', 'Seterusnya'),
  npa: T('加 NPA（阻断 PIN）', 'Add NPA (blocks PIN)', 'Tambah NPA (menyekat PIN)'),
  npaOn: T('NPA：PIN 被阻断，IAA⁻ 堆在细胞里，极性运输停止——这也是 NPA 能解除顶端优势的原因。', 'NPA: PIN is blocked, IAA⁻ piles up inside and polar transport stops — which is also why NPA releases apical dominance.', 'NPA: PIN disekat, IAA⁻ bertimbun di dalam dan pengangkutan berkutub berhenti — sebab itu juga NPA membebaskan dominasi apeks.'),
  apex: T('顶端（茎尖）', 'apex (shoot tip)', 'apeks (hujung pucuk)'), base: T('基部', 'base', 'pangkal'),
  wall: T('细胞壁 pH 酸', 'wall: acidic', 'dinding: berasid'), cyt: T('细胞质 pH≈7', 'cytosol pH≈7', 'sitosol pH≈7'),
};

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  let i = 0, npa = false;
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 280, 520)), H = 300;
  const cx = W / 2, cw = Math.min(200, W * 0.5), top = 40, ch = 200;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg pat-svg', role: 'img', 'aria-label': p(L.title) });
  svg.append(s('text', { x: cx, y: 16, 'text-anchor': 'middle', class: 'cell-label' }, `↑ ${p(L.apex)}`), s('text', { x: cx, y: H - 6, 'text-anchor': 'middle', class: 'cell-label' }, `↓ ${p(L.base)}`));
  svg.append(s('rect', { x: cx - cw / 2 - 16, y: top - 14, width: cw + 32, height: ch + 28, rx: 18, class: 'pat-wall' }));
  svg.append(s('rect', { x: cx - cw / 2, y: top, width: cw, height: ch, rx: 14, class: 'pat-cell' }));
  svg.append(s('text', { x: cx - cw / 2 - 12, y: top - 18, class: 'chart-tick' }, p(L.wall)), s('text', { x: cx, y: top + ch / 2 + 4, 'text-anchor': 'middle', class: 'chart-tick' }, p(L.cyt)));
  const parts = {
    in: s('g', { class: 'pat-part' }, s('rect', { x: cx - 30, y: top - 6, width: 60, height: 12, rx: 6 }), s('text', { x: cx, y: top - 10, 'text-anchor': 'middle' }, 'AUX1')),
    out: s('g', { class: 'pat-part pat-pin' }, s('rect', { x: cx - 30, y: top + ch - 6, width: 60, height: 12, rx: 6 }), s('text', { x: cx, y: top + ch + 22, 'text-anchor': 'middle' }, 'PIN')),
    pump: s('g', { class: 'pat-part' }, s('circle', { cx: cx + cw / 2, cy: top + ch / 2, r: 12 }), s('text', { x: cx + cw / 2 + 18, y: top + ch / 2 + 4 }, 'H⁺-ATPase')),
    trap: s('g', { class: 'pat-part' }, s('text', { x: cx, y: top + ch / 2 + 26, 'text-anchor': 'middle', class: 'pat-ion' }, 'IAAH → IAA⁻ + H⁺')),
    wall: s('g', { class: 'pat-part' }, s('text', { x: cx - cw / 2 - 12, y: top + 30, 'text-anchor': 'end', class: 'pat-ion' }, 'IAA⁻ / IAAH')),
  };
  svg.append(...Object.values(parts));
  const block = s('text', { x: cx + 38, y: top + ch + 6, class: 'z-block' }, '✕');
  svg.append(block);
  const arrow = s('path', { class: 'pat-flow', d: `M${cx - cw / 2 - 30},${top - 30} L${cx - cw / 2 - 30},${top + ch + 30}`, 'marker-end': 'url(#pat-head)' });
  svg.append(s('defs', {}, s('marker', { id: 'pat-head', viewBox: '0 0 10 10', refX: '9', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto' }, s('path', { d: 'M0,0 L10,5 L0,10 Z', class: 'pat-headp' }))), arrow);
  const text = h('p', { class: 'w-explain', 'aria-live': 'polite' });
  const back = h('button', { type: 'button', class: 'button button-quiet' }, p(L.prev));
  const fwd = h('button', { type: 'button', class: 'button' }, p(L.next));
  const npaBtn = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': 'false' }, p(L.npa));
  back.addEventListener('click', () => { i = Math.max(0, i - 1); update(); });
  fwd.addEventListener('click', () => { i = Math.min(STEPS.length - 1, i + 1); update(); });
  npaBtn.addEventListener('click', () => { npa = !npa; npaBtn.setAttribute('aria-pressed', String(npa)); update(); });
  function update() {
    const [key, t] = STEPS[i];
    for (const [k, g] of Object.entries(parts)) g.classList.toggle('is-on', k === key);
    block.style.display = npa ? '' : 'none';
    arrow.classList.toggle('is-blocked', npa);
    text.textContent = npa ? p(L.npaOn) : p(t);
    back.disabled = i === 0; fwd.disabled = i === STEPS.length - 1;
  }
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'Hopkins & Hüner 2009, pp. 319–321', children: [svg, text, h('div', { class: 'fc-nav' }, back, fwd, npaBtn)] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
