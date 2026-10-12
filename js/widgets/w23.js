/* W23 — Where the auxin goes and which way the organ bends: a shoot or a
   root, lit from one side or laid horizontal. Schematic summary of the
   Cholodny–Went account (Hopkins & Hüner 2009, pp. 396–404). */

import { s, h, clamp, frame } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('生长素去哪一侧？器官往哪边弯？', 'Which side gets the auxin, and which way does it bend?', 'Sisi mana dapat auksin, dan ke mana ia membengkok?'),
  organ: T('器官', 'Organ', 'Organ'), stim: T('刺激', 'Stimulus', 'Rangsangan'),
  shoot: T('茎', 'Shoot', 'Pucuk'), root: T('根', 'Root', 'Akar'),
  light: T('单侧光（从左边）', 'Light from the left', 'Cahaya dari kiri'), grav: T('横放（重力向下）', 'Laid horizontal (gravity down)', 'Diletak mendatar (graviti ke bawah)'),
  out: {
    'shoot-light': T('生长素移到背光的右侧 → 右侧伸长较快 → 茎弯向左边的光（正向光性）。', 'Auxin moves to the shaded right side → the right side elongates faster → the shoot bends left, towards the light (positive phototropism).', 'Auksin bergerak ke sisi kanan yang terlindung → sisi kanan memanjang lebih cepat → pucuk membengkok ke kiri, ke arah cahaya (fototropisme positif).'),
    'shoot-grav': T('生长素累积在下侧 → 下侧伸长较快 → 茎往上弯（负向重力性）。', 'Auxin collects on the lower side → the lower side elongates faster → the shoot bends up (negative gravitropism).', 'Auksin terkumpul di sisi bawah → sisi bawah memanjang lebih cepat → pucuk membengkok ke atas (gravitropisme negatif).'),
    'root-grav': T('生长素累积在下侧 → 对根是抑制浓度，下侧长得慢 → 根往下弯（正向重力性）。', 'Auxin collects on the lower side → for a root that level is inhibitory, so the lower side grows slower → the root bends down (positive gravitropism).', 'Auksin terkumpul di sisi bawah → bagi akar paras itu merencat, jadi sisi bawah tumbuh lebih perlahan → akar membengkok ke bawah (gravitropisme positif).'),
    'root-light': T('多数根对光不敏感或略呈负向光性；根主要靠向重力性定向。', 'Most roots are insensitive to light or weakly negatively phototropic; they orient mainly by gravity.', 'Kebanyakan akar tidak sensitif kepada cahaya atau fototropik negatif lemah; ia diarahkan terutamanya oleh graviti.'),
  },
};

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  let organ = 'shoot', stim = 'light';
  const W = Math.round(clamp((el.clientWidth || 640) - 30, 260, 380)), H = W * 0.8;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'w-svg tr-svg', role: 'img', 'aria-label': p(L.title) });
  const g = s('g', {});
  svg.append(g);
  const note = h('p', { class: 'w-explain' });
  function draw() {
    g.replaceChildren();
    const cx = W / 2, cy = H / 2;
    const horiz = stim === 'grav';
    const bend = organ === 'shoot' ? (horiz ? 'up' : 'left') : (horiz ? 'down' : 'none');
    // Organ as a curved path, auxin dots on the side that gets more.
    let d;
    if (!horiz) d = bend === 'left' ? `M${cx},${H - 10} C${cx},${cy} ${cx - 10},${cy - 40} ${cx - 50},${30}` : `M${cx},10 L${cx},${H - 10}`;
    else d = bend === 'up' ? `M20,${cy} C${cx},${cy} ${cx + 50},${cy} ${W - 40},${cy - 70}` : `M${W - 20},${cy - 30} C${cx},${cy - 30} ${cx - 50},${cy - 30} 40,${cy + 50}`;
    g.append(s('path', { d, class: organ === 'shoot' ? 'tr-shoot' : 'tr-root' }));
    const dots = [];
    if (organ === 'shoot' && !horiz) for (let i = 0; i < 6; i++) dots.push([cx + 12, H - 30 - i * 22]);
    else if (horiz) for (let i = 0; i < 6; i++) dots.push([60 + i * 30, cy + (organ === 'shoot' ? 14 : -16)]);
    for (const [x, y] of dots) g.append(s('circle', { cx: x, cy: y, r: 4, class: 'tr-aux' }));
    if (!horiz) g.append(s('text', { x: 8, y: cy, class: 'tr-sun' }, '☀ →'));
    else g.append(s('text', { x: W - 30, y: H - 10, class: 'tr-sun' }, 'g ↓'));
    note.textContent = p(L.out[`${organ}-${stim}`]);
  }
  const seg = (title, opts, get, set) => {
    const box = h('div', { class: 'seg', role: 'group' });
    for (const [k, label] of opts) {
      const b = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': String(get() === k) }, p(label));
      b.addEventListener('click', () => { set(k); for (const n of box.children) n.setAttribute('aria-pressed', String(n === b)); draw(); });
      box.append(b);
    }
    return [h('p', { class: 'w-label' }, p(title)), box];
  };
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'Hopkins & Hüner 2009, pp. 396–404', children: [
    ...seg(L.organ, [['shoot', L.shoot], ['root', L.root]], () => organ, v => { organ = v; }),
    ...seg(L.stim, [['light', L.light], ['grav', L.grav]], () => stim, v => { stim = v; }), svg, note] }));
  draw();
  return { destroy() { el.replaceChildren(); } };
}
