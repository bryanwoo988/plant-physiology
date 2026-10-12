/* W4 — Deficiency detective. Pick where the symptom shows (older or
   younger leaves) and what it looks like; the figure lists the elements
   that fit. A study aid built from the symptom table in Chapter 4
   (Hopkins & Hüner 2009, pp. 68–75), not a diagnostic tool. */

import { h, frame } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
const L = {
  title: T('缺素侦探：先看位置，再看样子', 'Deficiency detective: where first, then what', 'Detektif kekurangan: di mana dahulu, kemudian apa'),
  where: T('症状先出现在', 'Symptoms appear first on', 'Simptom muncul dahulu pada'),
  what: T('看起来像', 'They look like', 'Rupanya seperti'),
  old: T('老叶（下部）', 'Older (lower) leaves', 'Daun tua (bawah)'),
  young: T('幼叶 / 顶端', 'Young leaves / tips', 'Daun muda / hujung'),
  fits: T('可能的元素', 'Elements that fit', 'Unsur yang sepadan'),
  none: T('没有符合的元素，换一个组合试试。', 'Nothing fits — try another combination.', 'Tiada yang sepadan — cuba gabungan lain.'),
  why: T('移动的元素会从老叶搬到新叶，所以先在老叶显现；不移动的元素先在新叶显现。', 'Mobile elements are moved from old leaves to new ones, so they show in old leaves first; immobile ones show in new growth first.', 'Unsur mudah gerak dipindahkan dari daun tua ke daun baharu, jadi ia muncul pada daun tua dahulu; unsur tidak mudah gerak muncul pada pertumbuhan baharu dahulu.'),
};
const LOOKS = {
  yellow: T('整片均匀发黄', 'Even yellowing of the whole leaf', 'Seluruh daun menguning sekata'),
  vein: T('叶脉间发黄（叶脉仍绿）', 'Yellow between green veins', 'Kuning di antara urat hijau'),
  edge: T('叶缘或叶尖焦枯、坏死', 'Scorched or dead margins and tips', 'Tepi dan hujung hangus atau mati'),
  dark: T('深绿或偏紫、植株矮小', 'Dark green or purplish, stunted', 'Hijau pekat atau keunguan, terbantut'),
  shape: T('叶片扭曲、节间短、小叶', 'Distorted leaves, short internodes, small leaves', 'Daun herot, ruas pendek, daun kecil'),
};
// [element, where ('old' | 'young' | 'both'), looks[], note]
const DATA = [
  ['N', 'old', ['yellow', 'dark'], T('移动性高；老叶整片黄，常带花青素紫色', 'Mobile; whole older leaves yellow, often purple anthocyanin', 'Mudah gerak; seluruh daun tua kuning, sering ungu antosianin')],
  ['P', 'old', ['dark'], T('深绿、矮小，可能有坏死斑', 'Intense green, stunted, maybe necrotic spots', 'Hijau pekat, terbantut, mungkin bintik nekrosis')],
  ['K', 'old', ['edge', 'vein'], T('斑驳，叶缘焦枯；砂土常见', 'Mottled, scorched margins; common on sand', 'Bertompok, tepi hangus; biasa di tanah pasir')],
  ['Mg', 'old', ['vein'], T('老叶叶脉间黄化', 'Interveinal chlorosis of older leaves', 'Klorosis antara urat daun tua')],
  ['Cl', 'old', ['edge'], T('叶尖萎蔫，极少见', 'Wilting leaf tips; very rare', 'Hujung daun layu; sangat jarang')],
  ['Ni', 'old', ['edge'], T('尿素累积使叶尖坏死', 'Urea builds up and kills leaf tips', 'Urea terkumpul dan membunuh hujung daun')],
  ['S', 'young', ['yellow'], T('像缺氮，但从幼叶开始', 'Like nitrogen deficiency, but in young leaves', 'Seperti kekurangan nitrogen, tetapi pada daun muda')],
  ['Fe', 'young', ['vein'], T('幼叶叶脉间黄化，严重时近白色', 'Interveinal chlorosis of young leaves, nearly white when severe', 'Klorosis antara urat daun muda, hampir putih jika teruk')],
  ['Mn', 'young', ['vein'], T('叶脉间斑点（燕麦灰斑病）', 'Interveinal spots (grey speck of oats)', 'Bintik antara urat (bintik kelabu oat)')],
  ['Ca', 'young', ['edge', 'shape'], T('分生组织异常、顶端坏死、根差', 'Abnormal meristems, dying tips, poor roots', 'Meristem tidak normal, hujung mati, akar lemah')],
  ['B', 'young', ['edge', 'shape'], T('分生组织坏死、节间短、丛生', 'Dead meristems, short internodes, bushy', 'Meristem mati, ruas pendek, merimbun')],
  ['Cu', 'young', ['shape'], T('幼叶扭曲变形', 'Young leaves distorted', 'Daun muda herot')],
  ['Zn', 'young', ['shape'], T('节间短、叶小；生长素偏低', 'Short internodes, small leaves; low auxin', 'Ruas pendek, daun kecil; auksin rendah')],
  ['Mo', 'both', ['shape', 'vein'], T('“鞭尾”叶，幼叶扭曲', '‘Whiptail’: twisted young leaves', '‘Ekor cemeti’: daun muda berpintal')],
];

export function mount(el, { lang }) {
  const p = v => pick(v, lang);
  let where = 'old', look = 'vein';
  const seg = (opts, get, set) => {
    const g = h('div', { class: 'seg', role: 'group' });
    for (const [k, label] of opts) {
      const b = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': String(get() === k) }, p(label));
      b.addEventListener('click', () => { set(k); for (const n of g.children) n.setAttribute('aria-pressed', String(n === b)); update(); });
      g.append(b);
    }
    return g;
  };
  const list = h('ul', { class: 'def-list', 'aria-live': 'polite' });
  function update() {
    const hits = DATA.filter(([, w, looks]) => (w === where || w === 'both') && looks.includes(look));
    list.replaceChildren(...(hits.length ? hits.map(([e, , , note]) => h('li', {}, h('span', { class: 'def-el' }, e), h('span', {}, p(note)))) : [h('li', { class: 'muted' }, p(L.none))]));
  }
  el.append(frame({ title: p(L.title), lang, source: 'Hopkins & Hüner 2009, pp. 68–75', children: [
    h('p', { class: 'w-label' }, p(L.where)), seg([['old', L.old], ['young', L.young]], () => where, v => { where = v; }),
    h('p', { class: 'w-label' }, p(L.what)), seg(Object.entries(LOOKS), () => look, v => { look = v; }),
    h('p', { class: 'w-label' }, p(L.fits)), list, h('p', { class: 'w-explain muted' }, p(L.why))] }));
  update();
  return { destroy() { el.replaceChildren(); } };
}
