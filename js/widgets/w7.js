/* W7 — The Z-scheme. Carriers placed by redox potential (schematic: only
   H₂O/O₂ +0.82 V, NADP⁺/NADPH −0.32 V and ferredoxin −0.42 V are labelled
   values, from Hopkins & Hüner 2009). Choose linear flow, cyclic flow, or
   add DCMU or paraquat, and tap a carrier to read what it does. */

import { s, h, clamp, frame } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('Z 形图：点一个载体，换一种电子流', 'The Z-scheme: tap a carrier, switch the flow', 'Skema Z: ketik pembawa, tukar aliran'),
  modes: { linear: T('非循环', 'Non-cyclic', 'Tak berkitar'), cyclic: T('循环', 'Cyclic', 'Berkitar'), dcmu: T('+ DCMU', '+ DCMU', '+ DCMU'), pq: T('+ 百草枯', '+ paraquat', '+ parakuat') },
  em: T('Em（V）', 'Em (V)', 'Em (V)'),
  result: {
    linear: T('产生：ATP、NADPH、O₂', 'Makes: ATP, NADPH, O₂', 'Menghasilkan: ATP, NADPH, O₂'),
    cyclic: T('产生：只有 ATP（不放氧，没有 NADPH）', 'Makes: ATP only (no O₂, no NADPH)', 'Menghasilkan: ATP sahaja (tiada O₂, tiada NADPH)'),
    dcmu: T('电子停在 QA：从 PQ 开始都拿不到电子，不放氧也不产生 NADPH', 'Electrons stop at QA: PQ and everything after it stay unreduced; no O₂, no NADPH', 'Elektron berhenti di QA: PQ dan semua selepasnya tidak diturunkan; tiada O₂, tiada NADPH'),
    pq: T('电子在 PSI 末端被抢走交给 O₂，产生活性氧；NADPH 不能形成', 'Electrons are stolen at the end of PSI and given to O₂, making reactive oxygen; no NADPH', 'Elektron dicuri di hujung PSI dan diberi kepada O₂, menghasilkan oksigen reaktif; tiada NADPH'),
  },
  hint: T('点任何一个载体看说明', 'Tap any carrier for a note', 'Ketik mana-mana pembawa untuk nota'),
};
// [id, label, x (0–1), Em (V, schematic), note]
const NODES = [
  ['h2o', 'H₂O', 0.02, 0.82, T('水被放氧复合体氧化：2 H₂O → O₂ + 4 H⁺ + 4 e⁻（+0.82 V）', 'Water oxidised by the OEC: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻ (+0.82 V)', 'Air dioksidakan oleh OEC: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻ (+0.82 V)')],
  ['p680', 'P680', 0.12, 1.1, T('PSII 反应中心；P680⁺ 是极强的氧化剂，能从水抽出电子', 'PSII reaction centre; P680⁺ is a very strong oxidant, able to pull electrons from water', 'Pusat tindak balas PSII; P680⁺ ialah agen pengoksidaan yang sangat kuat, mampu menarik elektron daripada air')],
  ['p680s', 'P680*', 0.14, -0.7, T('吸收光子后的激发态，马上把电子交出去（电荷分离）', 'The excited state after a photon; hands its electron on at once (charge separation)', 'Keadaan teruja selepas foton; menyerahkan elektronnya serta-merta (pemisahan cas)')],
  ['pheo', 'Pheo', 0.22, -0.55, T('脱镁叶绿素：PSII 的初级电子受体', 'Pheophytin: the primary electron acceptor of PSII', 'Feofitin: penerima elektron primer PSII')],
  ['qa', 'QA', 0.3, -0.2, T('结合在 D2 上的醌，防止电荷重新结合', 'A bound quinone that prevents charge recombination', 'Kuinon terikat yang menghalang penggabungan semula cas')],
  ['pq', 'PQ/QB', 0.38, 0.05, T('质体醌在 D1 的 QB 位点接电子变 PQH₂；DCMU 和莠去津抢的就是这个位点', 'Plastoquinone at the QB site of D1 becomes PQH₂; DCMU and atrazine compete for this site', 'Plastokuinon di tapak QB D1 menjadi PQH₂; DCMU dan atrazina bersaing untuk tapak ini')],
  ['b6f', 'Cyt b₆f', 0.48, 0.3, T('Rieske FeS → 细胞色素 f；Q 循环每 2 个电子送 4 个 H⁺ 进腔', 'Rieske FeS → cytochrome f; the Q-cycle moves 4 H⁺ into the lumen per 2 e⁻', 'Rieske FeS → sitokrom f; kitaran Q memindahkan 4 H⁺ ke lumen bagi setiap 2 e⁻')],
  ['pc', 'PC', 0.57, 0.37, T('质体蓝素：腔内可移动的含铜蛋白，把电子交给 P700⁺', 'Plastocyanin: mobile copper protein in the lumen that refills P700⁺', 'Plastosianin: protein kuprum bergerak dalam lumen yang mengisi semula P700⁺')],
  ['p700', 'P700', 0.66, 0.48, T('PSI 反应中心', 'PSI reaction centre', 'Pusat tindak balas PSI')],
  ['p700s', 'P700*', 0.68, -1.25, T('PSI 的激发态，是更强的还原剂', 'Excited PSI, an even stronger reductant', 'PSI teruja, agen penurunan yang lebih kuat')],
  ['a0', 'A₀', 0.76, -1.05, T('初级受体（一个叶绿素 a），之后经醌和铁硫中心', 'Primary acceptor (a chlorophyll a), then a quinone and FeS centres', 'Penerima primer (klorofil a), kemudian kuinon dan pusat FeS')],
  ['fd', 'Fd', 0.86, -0.42, T('铁氧还蛋白（−0.42 V）：基质里的可溶性铁硫蛋白', 'Ferredoxin (−0.42 V): soluble FeS protein in the stroma', 'Feredoksin (−0.42 V): protein FeS larut dalam stroma')],
  ['nadp', 'NADPH', 0.97, -0.32, T('FNR 把 NADP⁺ 还原成 NADPH（−0.32 V），用来还原 CO₂', 'FNR reduces NADP⁺ to NADPH (−0.32 V), used to reduce CO₂', 'FNR menurunkan NADP⁺ kepada NADPH (−0.32 V), digunakan untuk menurunkan CO₂')],
];
const PATHS = {
  linear: ['h2o', 'p680', 'p680s', 'pheo', 'qa', 'pq', 'b6f', 'pc', 'p700', 'p700s', 'a0', 'fd', 'nadp'],
  cyclic: ['p700', 'p700s', 'a0', 'fd', 'pq', 'b6f', 'pc', 'p700'],
  dcmu: ['h2o', 'p680', 'p680s', 'pheo', 'qa'],
  pq: ['h2o', 'p680', 'p680s', 'pheo', 'qa', 'pq', 'b6f', 'pc', 'p700', 'p700s', 'a0'],
};

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 300, 680)), H = Math.round(clamp(W * 0.7, 260, 420));
  const M = { t: 26, r: 56, b: 20, l: 40 };
  const X = f => M.l + f * (W - M.l - M.r), Y = v => M.t + (v + 1.4) / 2.6 * (H - M.t - M.b);
  let mode = 'linear';
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg z-svg', role: 'img', 'aria-label': p(L.title) });
  const ax = s('g', { class: 'chart-axes' });
  for (const v of [-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2]) {
    ax.append(s('line', { x1: M.l, x2: W - M.r, y1: Y(v), y2: Y(v), class: 'grid' }));
    ax.append(s('text', { x: M.l - 6, y: Y(v) + 4, 'text-anchor': 'end' }, (v > 0 ? '+' : '') + v.toFixed(1)));
  }
  ax.append(s('text', { x: 2, y: 12, class: 'unit' }, p(L.em)));
  svg.append(ax);
  const links = s('g', { class: 'z-links' });
  svg.append(links);
  const pos = Object.fromEntries(NODES.map(([id, , fx, em]) => [id, [X(fx), Y(em)]]));
  const note = h('p', { class: 'w-explain' }, p(L.hint));
  const result = h('p', { class: 'z-result' });
  const nodes = s('g', {});
  for (const [id, label, , , text] of NODES) {
    const [cx, cy] = pos[id];
    const g = s('g', { class: 'z-node', tabindex: '0', role: 'button', 'data-id': id },
      s('circle', { cx, cy, r: 6 }),
      s('text', { x: cx + 9, y: cy + 4 }, label));
    const show = () => { for (const n of nodes.children) n.classList.toggle('is-on', n === g); note.textContent = `${label}: ${p(text)}`; };
    g.addEventListener('click', show);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } });
    nodes.append(g);
  }
  svg.append(nodes);
  // Light arrows at the two photosystems.
  for (const [a, b] of [['p680', 'p680s'], ['p700', 'p700s']]) svg.append(s('text', { x: pos[a][0] - 22, y: (pos[a][1] + pos[b][1]) / 2, class: 'z-light' }, 'hν'));

  function draw() {
    links.replaceChildren();
    const path = PATHS[mode];
    for (let i = 1; i < path.length; i++) {
      const [x1, y1] = pos[path[i - 1]], [x2, y2] = pos[path[i]];
      links.append(s('line', { x1, y1, x2, y2, class: (path[i] === 'p680s' || path[i] === 'p700s') ? 'z-excite' : 'z-step' }));
    }
    if (mode === 'pq') {
      const [x1, y1] = pos.a0;
      links.append(s('line', { x1, y1, x2: x1 + 30, y2: y1 - 26, class: 'z-steal' }), s('text', { x: x1 + 32, y: y1 - 28, class: 'z-tag' }, 'O₂ → O₂⁻'));
    }
    if (mode === 'dcmu') { const [x1, y1] = pos.pq; links.append(s('text', { x: x1 - 6, y: y1 + 4, class: 'z-block' }, '✕')); }
    for (const n of nodes.children) n.classList.toggle('is-off', !path.includes(n.dataset.id));
    result.textContent = p(L.result[mode]);
  }
  const seg = h('div', { class: 'seg', role: 'group' }, Object.entries(L.modes).map(([k, label]) => {
    const b = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': String(k === mode) }, p(label));
    b.addEventListener('click', () => { mode = k; for (const n of seg.children) n.setAttribute('aria-pressed', String(n === b)); draw(); });
    return b;
  }));
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'Hopkins & Hüner 2009, pp. 116–125', children: [seg, svg, result, note] }));
  draw();
  return { destroy() { el.replaceChildren(); } };
}
