/* W8 — Calvin cycle bookkeeping, per three CO₂. Step round the cycle and
   watch the carbon count and the ATP/NADPH bill; the last step swaps CO₂
   for O₂ to show where photorespiration starts. Stoichiometry from
   Hopkins & Hüner 2009, pp. 137–139 and 142. */

import { s, h, clamp, frame } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('卡尔文循环算碳账（每 3 个 CO₂）', 'Calvin cycle carbon count (per 3 CO₂)', 'Kiraan karbon kitaran Calvin (bagi setiap 3 CO₂)'),
  prev: T('上一步', 'Back', 'Kembali'), next: T('下一步', 'Next', 'Seterusnya'),
  atp: T('已用 ATP', 'ATP spent', 'ATP digunakan'), nadph: T('已用 NADPH', 'NADPH spent', 'NADPH digunakan'),
  stages: [T('羧化', 'Carboxylation', 'Pengkarboksilan'), T('还原', 'Reduction', 'Penurunan'), T('输出', 'Export', 'Eksport'), T('再生', 'Regeneration', 'Penjanaan semula')],
};
// [stage index or -1, text, atp, nadph]
const STEPS = [
  [-1, T('起点：3 个 RuBP（3 × 5 = 15 C）加 3 个 CO₂（3 C）。', 'Start: 3 RuBP (3 × 5 = 15 C) plus 3 CO₂ (3 C).', 'Mula: 3 RuBP (3 × 5 = 15 C) serta 3 CO₂ (3 C).'), 0, 0],
  [0, T('Rubisco 把 3 个 CO₂ 加到 3 个 RuBP 上，裂成 6 个 3-PGA（6 × 3 = 18 C）。碳没有少，只是重新分配。', 'Rubisco adds 3 CO₂ to 3 RuBP, which split into 6 3-PGA (6 × 3 = 18 C). No carbon lost — only redistributed.', 'Rubisco menambah 3 CO₂ kepada 3 RuBP, yang terbelah menjadi 6 3-PGA (6 × 3 = 18 C). Tiada karbon hilang — hanya diagihkan semula.'), 0, 0],
  [1, T('6 个 3-PGA 先用 6 个 ATP 磷酸化，再用 6 个 NADPH 还原，得到 6 个丙糖磷酸（18 C）。', '6 3-PGA are phosphorylated with 6 ATP and reduced with 6 NADPH to 6 triose phosphates (18 C).', '6 3-PGA difosforilkan dengan 6 ATP dan diturunkan dengan 6 NADPH kepada 6 triosa fosfat (18 C).'), 6, 6],
  [2, T('1 个丙糖磷酸（3 C）是净收益，输出去合成蔗糖或淀粉——正好等于进来的 3 个 CO₂。', 'One triose phosphate (3 C) is the net gain and leaves to make sucrose or starch — exactly the 3 CO₂ that came in.', 'Satu triosa fosfat (3 C) ialah keuntungan bersih dan keluar untuk membuat sukrosa atau kanji — tepat 3 CO₂ yang masuk.'), 6, 6],
  [3, T('其余 5 个丙糖磷酸（15 C）重新排列，再花 3 个 ATP，变回 3 个 RuBP（15 C）。循环回到起点。', 'The other 5 triose phosphates (15 C) are rearranged and, with 3 more ATP, become 3 RuBP (15 C). The cycle is back where it began.', '5 triosa fosfat yang lain (15 C) disusun semula dan, dengan 3 ATP lagi, menjadi 3 RuBP (15 C). Kitaran kembali ke permulaan.'), 9, 6],
  [-1, T('总账：9 ATP + 6 NADPH 换 1 个丙糖磷酸，即每个 CO₂ 3 ATP + 2 NADPH。', 'The bill: 9 ATP + 6 NADPH for one triose phosphate — 3 ATP + 2 NADPH per CO₂.', 'Bil keseluruhan: 9 ATP + 6 NADPH untuk satu triosa fosfat — 3 ATP + 2 NADPH bagi setiap CO₂.'), 9, 6],
  [0, T('如果 rubisco 抓到的是 O₂：RuBP + O₂ → 1 个 3-PGA + 1 个二碳的磷酸乙醇酸。回收它要走光呼吸，还会放出 CO₂。', 'If rubisco grabs O₂ instead: RuBP + O₂ → one 3-PGA + one two-carbon phosphoglycolate. Salvaging it is photorespiration, which releases CO₂.', 'Jika rubisco menangkap O₂: RuBP + O₂ → satu 3-PGA + satu fosfoglikolat dua karbon. Menyelamatkannya ialah fotorespirasi, yang membebaskan CO₂.'), 9, 6],
];

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 280, 420)), H = W;
  const cx = W / 2, cy = H / 2, R = W * 0.33;
  let i = 0;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg calvin-svg', role: 'img', 'aria-label': p(L.title) });
  svg.append(s('circle', { cx, cy, r: R, class: 'calvin-ring' }));
  const angle = k => -Math.PI / 2 + k * Math.PI / 2;
  const nodes = L.stages.map((label, k) => {
    const x = cx + R * Math.cos(angle(k)), y = cy + R * Math.sin(angle(k));
    const g = s('g', { class: 'calvin-stage' }, s('circle', { cx: x, cy: y, r: W * 0.075 }),
      s('text', { x, y: y + 4, 'text-anchor': 'middle' }, String(k + 1)),
      s('text', { x: x + (k === 1 ? -W * 0.09 : k === 3 ? W * 0.09 : 0), y: y + (k === 0 ? -W * 0.1 : k === 2 ? W * 0.12 : 4), 'text-anchor': k === 1 ? 'end' : k === 3 ? 'start' : 'middle', class: 'calvin-label' }, p(label)));
    svg.append(g);
    return g;
  });
  const centre = s('text', { x: cx, y: cy + 5, 'text-anchor': 'middle', class: 'calvin-centre' });
  svg.append(centre);
  const text = h('p', { class: 'w-explain', 'aria-live': 'polite' });
  const bill = h('p', { class: 'calvin-bill' });
  const back = h('button', { type: 'button', class: 'button button-quiet' }, p(L.prev));
  const fwd = h('button', { type: 'button', class: 'button' }, p(L.next));
  back.addEventListener('click', () => { i = Math.max(0, i - 1); update(); });
  fwd.addEventListener('click', () => { i = Math.min(STEPS.length - 1, i + 1); update(); });
  function update() {
    const [stage, t, atp, nadph] = STEPS[i];
    nodes.forEach((n, k) => n.classList.toggle('is-on', k === stage));
    centre.textContent = `${i + 1} / ${STEPS.length}`;
    text.textContent = p(t);
    bill.textContent = `${p(L.atp)}: ${atp} · ${p(L.nadph)}: ${nadph}`;
    back.disabled = i === 0; fwd.disabled = i === STEPS.length - 1;
  }
  el.append(frame({ title: p(L.title), lang, source: 'Hopkins & Hüner 2009, pp. 137–139, 142', children: [svg, text, bill, h('div', { class: 'fc-nav' }, back, fwd)] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
