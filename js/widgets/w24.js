/* W24 — Day length, night length and flowering. Pick Xanthium (short-day,
   critical night 8.5 h) or Hyoscyamus (long-day, critical day 11 h, so
   critical night 13 h), set the day length and add a night break.
   Critical values from Hopkins & Hüner 2009, pp. 416–418; the all-or-none
   rule is the textbook idealisation. */

import { flowers, longestNight } from '../plantmath.js';
import { s, h, clamp, slider, readout, frame, fmt } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const PLANTS = {
  x: { type: 'SDP', critical: 8.5, name: T('苍耳（短日）', 'Xanthium (short-day)', 'Xanthium (hari pendek)') },
  hy: { type: 'LDP', critical: 13, name: T('天仙子（长日）', 'Hyoscyamus (long-day)', 'Hyoscyamus (hari panjang)') },
};
const L = {
  title: T('光周期：量的是夜长', 'Photoperiod: it is the night that counts', 'Fotoperiod: malam yang dikira'),
  day: T('日长', 'Day length', 'Panjang hari'), nb: T('午夜照一下光（夜断）', 'Night break at midnight', 'Gangguan malam pada tengah malam'),
  night: T('最长的连续暗期', 'Longest unbroken night', 'Malam terpanjang tanpa gangguan'), crit: T('临界夜长', 'Critical night', 'Malam kritikal'),
  out: T('结果', 'Result', 'Hasil'), yes: T('开花 🌼', 'Flowers 🌼', 'Berbunga 🌼'), no: T('保持营养生长', 'Stays vegetative', 'Kekal vegetatif'),
};

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  let plant = 'x', day = 14, nb = false;
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 280, 620)), H = 64;
  const x = hr => 6 + hr / 24 * (W - 12);
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg', role: 'img', 'aria-label': p(L.title) });
  const dayR = s('rect', { y: 10, height: 28, class: 'pp-day' }), nightR = s('rect', { y: 10, height: 28, class: 'pp-night' });
  const flash = s('rect', { y: 6, width: 6, height: 36, class: 'pp-flash' });
  svg.append(dayR, nightR, flash);
  for (const hr of [0, 6, 12, 18, 24]) svg.append(s('text', { x: x(hr), y: H - 6, 'text-anchor': 'middle', class: 'chart-tick' }, `${hr} h`));
  const rows = readout([['night', p(L.night)], ['crit', p(L.crit)], ['out', p(L.out)]]);
  const sd = slider({ label: p(L.day), min: 4, max: 20, step: 0.5, value: day, unit: ' h', onInput: v => { day = v; update(); } });
  const nbBtn = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': 'false' }, p(L.nb));
  nbBtn.addEventListener('click', () => { nb = !nb; nbBtn.setAttribute('aria-pressed', String(nb)); update(); });
  const seg = h('div', { class: 'seg', role: 'group' }, Object.entries(PLANTS).map(([k, v]) => {
    const b = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': String(k === plant) }, p(v.name));
    b.addEventListener('click', () => { plant = k; for (const n of seg.children) n.setAttribute('aria-pressed', String(n === b)); update(); });
    return b;
  }));
  const result = h('p', { class: 'pc-verdict' });
  function update() {
    const pl = PLANTS[plant];
    dayR.setAttribute('x', x(0)); dayR.setAttribute('width', x(day) - x(0));
    nightR.setAttribute('x', x(day)); nightR.setAttribute('width', x(24) - x(day));
    flash.style.display = nb ? '' : 'none'; flash.setAttribute('x', x(day + (24 - day) / 2) - 3);
    const ok = flowers(pl.type, { dayHours: day, nightBreak: nb, critical: pl.critical });
    rows.set('night', `${fmt(longestNight(day, nb), 1)} h`);
    rows.set('crit', `${pl.critical} h (${pl.type === 'SDP' ? '≥' : '<'})`);
    rows.set('out', p(ok ? L.yes : L.no));
    result.textContent = p(ok ? L.yes : L.no); result.className = `pc-verdict${ok ? ' is-yes' : ''}`;
  }
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'Critical values: Hopkins & Hüner 2009, pp. 416–418', children: [seg, svg, h('div', { class: 'w-controls' }, sd), nbBtn, rows] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
