/* W10 — Plant mitochondrial electron transport: choose where electrons
   enter and how they leave, add an inhibitor, and count the coupling
   sites (≈ 1 ATP each at complexes I, III and IV). Based on Hopkins &
   Hüner 2009, pp. 184–188. */

import { s, h, clamp, readout, frame } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('植物线粒体：电子从哪里进、从哪里出？', 'Plant mitochondria: where electrons enter and leave', 'Mitokondria tumbuhan: di mana elektron masuk dan keluar'),
  entry: T('电子入口', 'Entry', 'Masuk'), exit: T('出口', 'Exit', 'Keluar'), inh: T('抑制剂', 'Inhibitor', 'Perencat'),
  e: { c1: T('复合体 I（基质 NADH）', 'Complex I (matrix NADH)', 'Kompleks I (NADH matriks)'), rot: T('抗鱼藤酮脱氢酶', 'Rotenone-insensitive', 'Tidak sensitif rotenon'), ext: T('外部 NAD(P)H 脱氢酶', 'External NAD(P)H', 'NAD(P)H luaran'), c2: T('复合体 II（琥珀酸）', 'Complex II (succinate)', 'Kompleks II (suksinat)') },
  x: { cyt: T('细胞色素途径（III → IV）', 'Cytochrome path (III → IV)', 'Laluan sitokrom (III → IV)'), aox: T('交替氧化酶', 'Alternative oxidase', 'Oksidase alternatif') },
  i: { none: T('无', 'None', 'Tiada'), rotenone: T('鱼藤酮', 'Rotenone', 'Rotenon'), cn: T('氰化物', 'Cyanide', 'Sianida'), sham: T('SHAM', 'SHAM', 'SHAM') },
  sites: T('偶联位点 ≈ ATP / 2e⁻', 'Coupling sites ≈ ATP per 2e⁻', 'Tapak gandingan ≈ ATP per 2e⁻'),
  o2: T('O₂ 被还原吗', 'Is O₂ reduced?', 'Adakah O₂ diturunkan?'),
  yes: T('是', 'Yes', 'Ya'), blocked: T('否：电子流被阻断', 'No — electron flow blocked', 'Tidak — aliran elektron disekat'),
};

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  let entry = 'c1', exit = 'cyt', inh = 'none';
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 300, 640)), H = 150;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg', role: 'img', 'aria-label': p(L.title) });
  svg.append(s('rect', { x: 0, y: 55, width: W, height: 40, class: 'etc-mem' }));
  svg.append(s('text', { x: 6, y: 20, class: 'cell-label' }, lang === 'zh' ? '膜间隙' : lang === 'ms' ? 'Ruang antara membran' : 'Intermembrane space'));
  svg.append(s('text', { x: 6, y: H - 8, class: 'cell-label' }, lang === 'zh' ? '基质' : lang === 'ms' ? 'Matriks' : 'Matrix'));
  const X = f => 20 + f * (W - 40);
  const BOX = { c1: [0.05, 'I'], rot: [0.2, 'rot'], c2: [0.33, 'II'], ext: [0.2, 'ext'], uq: [0.47, 'UQ'], c3: [0.62, 'III'], c4: [0.8, 'IV'], aox: [0.62, 'AOX'] };
  const boxes = {};
  for (const [id, [f, label]] of Object.entries(BOX)) {
    const y = id === 'ext' ? 30 : id === 'aox' ? 100 : id === 'rot' ? 100 : 60;
    const g = s('g', { class: 'etc-box' }, s('rect', { x: X(f) - 22, y, width: 44, height: id === 'uq' ? 30 : 30, rx: 8 }), s('text', { x: X(f), y: y + 19, 'text-anchor': 'middle' }, label));
    svg.append(g); boxes[id] = g;
  }
  const path = s('polyline', { class: 'etc-path' });
  svg.insertBefore(path, svg.children[3]);
  const rows = readout([['sites', p(L.sites)], ['o2', p(L.o2)]]);
  const seg = (title, opts, get, set) => {
    const g = h('div', { class: 'seg', role: 'group', 'aria-label': p(title) });
    for (const [k, label] of Object.entries(opts)) {
      const b = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': String(get() === k) }, p(label));
      b.addEventListener('click', () => { set(k); for (const n of g.children) n.setAttribute('aria-pressed', String(n === b)); update(); });
      g.append(b);
    }
    return [h('p', { class: 'w-label' }, p(title)), g];
  };
  function update() {
    const route = [entry, 'uq', ...(exit === 'cyt' ? ['c3', 'c4'] : ['aox'])];
    const blocked = (inh === 'rotenone' && entry === 'c1') || (inh === 'cn' && exit === 'cyt') || (inh === 'sham' && exit === 'aox');
    const sites = (entry === 'c1' ? 1 : 0) + (exit === 'cyt' ? 2 : 0);
    const pt = id => { const r = boxes[id].querySelector('rect'); return `${+r.getAttribute('x') + 22},${+r.getAttribute('y') + 15}`; };
    path.setAttribute('points', route.map(pt).join(' '));
    path.classList.toggle('is-blocked', blocked);
    for (const [id, g] of Object.entries(boxes)) g.classList.toggle('is-on', route.includes(id));
    rows.set('sites', blocked ? '0' : String(sites));
    rows.set('o2', p(blocked ? L.blocked : L.yes));
  }
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'Hopkins & Hüner 2009, pp. 184–188', children: [
    ...seg(L.entry, L.e, () => entry, v => { entry = v; }), ...seg(L.exit, L.x, () => exit, v => { exit = v; }), ...seg(L.inh, L.i, () => inh, v => { inh = v; }), svg, rows] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
