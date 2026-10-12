/* W3 — Active or passive? Choose an ion, the membrane potential and the
   outside concentration; the Nernst equation predicts the inside
   concentration from passive movement alone, and comparing it with the
   measured value tells you whether a pump must be at work. Example inside
   values are illustrative, not data from a specific tissue. */

import { nernstInside, nernstVerdict } from '../plantmath.js';
import { s, h, clamp, slider, readout, frame, fmt } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const IONS = [
  { id: 'K', label: 'K⁺', z: 1, out: 1, actual: 75 },
  { id: 'Na', label: 'Na⁺', z: 1, out: 1, actual: 8 },
  { id: 'Ca', label: 'Ca²⁺', z: 2, out: 1, actual: 2 },
  { id: 'Cl', label: 'Cl⁻', z: -1, out: 1, actual: 5 },
  { id: 'NO3', label: 'NO₃⁻', z: -1, out: 2, actual: 20 },
];
const L = {
  title: T('用能斯特方程判断：主动还是被动？', 'The Nernst test: active or passive?', 'Ujian Nernst: aktif atau pasif?'),
  E: T('膜电位', 'Membrane potential', 'Keupayaan membran'),
  out: T('外面浓度', 'Outside', 'Di luar'),
  act: T('里面实测', 'Measured inside', 'Diukur di dalam'),
  pred: T('被动可达到', 'Passive prediction', 'Ramalan pasif'),
  ratio: T('实测 / 预测', 'Measured / predicted', 'Diukur / ramalan'),
  verdict: T('结论', 'Verdict', 'Kesimpulan'),
  passive: T('被动即可解释', 'Passive movement explains it', 'Pergerakan pasif sudah menerangkannya'),
  uptake: T('主动吸收（需要泵）', 'Active uptake (a pump is needed)', 'Pengambilan aktif (perlu pam)'),
  expel: T('主动排出（需要泵）', 'Active expulsion (a pump is needed)', 'Penyingkiran aktif (perlu pam)'),
  inside: T('细胞内', 'inside', 'dalam'), outside: T('细胞外', 'outside', 'luar'),
};

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 280, 600)), H = 150;
  let ion = IONS[0], E = -120, out = ion.out, act = ion.actual;

  const pick$ = h('div', { class: 'seg', role: 'group' }, IONS.map(x => {
    const b = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': String(x === ion) }, x.label);
    b.addEventListener('click', () => { ion = x; out = x.out; act = x.actual; sO.set(out); sA.set(act); for (const n of pick$.children) n.setAttribute('aria-pressed', String(n === b)); update(); });
    return b;
  }));

  // Two compartments, bar heights on a log scale (0.01–1000 mM).
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg', role: 'img', 'aria-label': p(L.title) });
  const mid = W / 2;
  svg.append(s('rect', { x: 4, y: 10, width: mid - 8, height: H - 30, rx: 10, class: 'nern-out' }));
  svg.append(s('rect', { x: mid + 4, y: 10, width: mid - 8, height: H - 30, rx: 10, class: 'nern-in' }));
  svg.append(s('line', { x1: mid, x2: mid, y1: 6, y2: H - 16, class: 'nern-mem' }));
  svg.append(s('text', { x: mid / 2, y: H - 4, 'text-anchor': 'middle', class: 'cell-label' }, p(L.outside)));
  svg.append(s('text', { x: mid * 1.5, y: H - 4, 'text-anchor': 'middle', class: 'cell-label' }, p(L.inside)));
  const ly = v => (H - 20) - (Math.log10(clamp(v, 0.01, 1000)) + 2) / 5 * (H - 40);
  const bOut = s('rect', { class: 'nern-bar' }), bPred = s('rect', { class: 'nern-pred' }), bAct = s('rect', { class: 'nern-bar' });
  const tOut = s('text', { class: 'spa-val', 'text-anchor': 'middle' }), tPred = s('text', { class: 'spa-val', 'text-anchor': 'middle' }), tAct = s('text', { class: 'spa-val', 'text-anchor': 'middle' });
  const tE = s('text', { x: mid, y: 22, 'text-anchor': 'middle', class: 'spa-val' });
  svg.append(bOut, bPred, bAct, tOut, tPred, tAct, tE);
  const place = (r, t, x, w, v, label) => {
    const y0 = ly(v);
    r.setAttribute('x', x); r.setAttribute('width', w); r.setAttribute('y', y0); r.setAttribute('height', Math.max(1, H - 20 - y0));
    t.setAttribute('x', x + w / 2); t.setAttribute('y', Math.max(y0 - 4, 30)); t.textContent = label;
  };

  const rows = readout([['pred', p(L.pred)], ['ratio', p(L.ratio)], ['verdict', p(L.verdict)]]);
  const sE = slider({ label: p(L.E), min: -200, max: 0, step: 1, value: E, unit: ' mV', onInput: v => { E = v; update(); } });
  const sO = slider({ label: p(L.out), min: 0.1, max: 10, step: 0.1, value: out, unit: ' mM', onInput: v => { out = v; update(); } });
  const sA = slider({ label: p(L.act), min: 0.1, max: 200, step: 0.1, value: act, unit: ' mM', onInput: v => { act = v; update(); } });

  function update() {
    const pred = nernstInside(out, ion.z, E);
    const v = nernstVerdict(act, pred);
    const bw = (mid - 30) / 2;
    place(bOut, tOut, mid / 2 - bw / 2, bw, out, `${fmt(out, 1)}`);
    place(bPred, tPred, mid + 10, bw, pred, `${fmt(pred, pred < 1 ? 2 : 0)}`);
    place(bAct, tAct, mid + 16 + bw, bw, act, `${fmt(act, 1)}`);
    tE.textContent = `${E} mV`;
    rows.set('pred', `${fmt(pred, pred < 1 ? 3 : 1)} mM`);
    rows.set('ratio', fmt(act / pred, act / pred < 1 ? 3 : 1));
    rows.set('verdict', p(L[v]));
  }

  el.append(frame({ title: p(L.title), lang, source: 'ΔE = (59/z) log(Cout/Cin), 25 °C', children: [pick$, svg, h('div', { class: 'w-controls' }, sE, sO, sA), rows] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
