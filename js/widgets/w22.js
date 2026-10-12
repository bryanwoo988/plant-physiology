/* W22 — The lettuce-seed experiment. Give flashes of red and far-red in
   any order; the bar shows the Pfr fraction each flash leaves (φ ≈ 0.8
   after red, ≈ 0.03 after far-red; Hopkins & Hüner 2009, p. 379) and the
   seed's fate depends only on the last flash. */

import { s, h, clamp, frame } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('莴苣种子实验：红光与远红光', 'The lettuce-seed experiment: red and far-red', 'Eksperimen biji salad: merah dan merah jauh'),
  r: T('红光 R（660 nm）', 'Red R (660 nm)', 'Merah M (660 nm)'), fr: T('远红光 FR（730 nm）', 'Far-red FR (730 nm)', 'Merah jauh MJ (730 nm)'), reset: T('重来（放回黑暗）', 'Start again (dark)', 'Mula semula (gelap)'),
  seq: T('照光顺序', 'Sequence', 'Urutan'), none: T('（还没照光）', '(no light yet)', '(belum ada cahaya)'),
  germ: T('会萌发', 'Germinates', 'Bercambah'), no: T('不萌发', 'Does not germinate', 'Tidak bercambah'),
  pfr: T('Pfr 占总量', 'Pfr / total', 'Pfr / jumlah'),
};

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  let seq = [];
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 280, 560)), H = 120;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg', role: 'img', 'aria-label': p(L.title) });
  const bw = W - 140;
  svg.append(s('rect', { x: 10, y: 20, width: bw, height: 26, rx: 8, class: 'pc-pr' }));
  const pfr = s('rect', { x: 10, y: 20, height: 26, rx: 8, class: 'pc-pfr' });
  const lbl = s('text', { x: 10, y: 66, class: 'cell-label' });
  svg.append(pfr, lbl, s('text', { x: 14, y: 38, class: 'pc-tag' }, 'Pfr'), s('text', { x: bw + 4, y: 38, 'text-anchor': 'end', class: 'pc-tag' }, 'Pr'));
  const seed = s('g', { transform: `translate(${W - 70},${H / 2})` },
    s('ellipse', { rx: 22, ry: 16, class: 'pc-seed' }),
    s('path', { d: 'M8,-6 C24,-20 30,-40 18,-52', class: 'pc-root' }));
  svg.append(seed);
  const seqEl = h('p', { class: 'pc-seq' });
  const verdict = h('p', { class: 'pc-verdict', 'aria-live': 'polite' });
  const btn = (label, cls, fn) => { const b = h('button', { type: 'button', class: `button ${cls}` }, p(label)); b.addEventListener('click', fn); return b; };
  function update() {
    const last = seq[seq.length - 1];
    const phi = last === 'R' ? 0.8 : last === 'FR' ? 0.03 : 0;
    pfr.setAttribute('width', Math.max(2, phi * bw));
    lbl.textContent = `${p(L.pfr)} φ ≈ ${phi.toFixed(2)}`;
    const grows = last === 'R';
    seed.classList.toggle('is-germ', grows);
    seqEl.textContent = `${p(L.seq)}: ${seq.length ? seq.join(' → ') : p(L.none)}`;
    verdict.textContent = seq.length ? p(grows ? L.germ : L.no) : '';
    verdict.className = `pc-verdict${grows ? ' is-yes' : ''}`;
  }
  const controls = h('div', { class: 'fc-nav' },
    btn(L.r, 'pc-r', () => { seq.push('R'); update(); }),
    btn(L.fr, 'pc-fr', () => { seq.push('FR'); update(); }),
    btn(L.reset, 'button-quiet', () => { seq = []; update(); }));
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'φ values: Hopkins & Hüner 2009, p. 379', children: [svg, controls, seqEl, verdict] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
