/* W19 — Hormone receptors and signalling: each hormone shown without and
   with its signal, as a chain of components that are on, off or
   destroyed. A revision aid for "describe the receptor for…" questions,
   from the lecture notes and Hopkins & Hüner 2009, chs 18–21. */

import { h, frame } from './kit.js';
import { pick } from '../i18n.js';

const T = (zh, en, ms) => ({ zh, en, ms });
// Each step: [label, state] — state: 'on' | 'off' | 'gone' | 'sig'
const H = {
  auxin: { name: T('生长素', 'Auxin', 'Auksin'),
    receptor: T('TIR1（F-box，SCF^TIR1 的一部分，核内）', 'TIR1 (an F-box protein of SCF^TIR1, nuclear)', 'TIR1 (protein F-box SCF^TIR1, nukleus)'),
    off: [['AUX/IAA', 'on'], ['ARF', 'off'], [T('生长素响应基因', 'Auxin-response genes', 'Gen tindak balas auksin'), 'off']],
    on: [[T('IAA', 'IAA', 'IAA'), 'sig'], ['TIR1 + AUX/IAA', 'on'], [T('SCF 泛素化 → 26S 蛋白酶体', 'SCF ubiquitination → 26S proteasome', 'Pengubikuitinan SCF → proteasom 26S'), 'on'], ['AUX/IAA', 'gone'], ['ARF', 'on'], [T('基因开启（SAUR、AUX/IAA…）', 'Genes on (SAUR, AUX/IAA…)', 'Gen hidup (SAUR, AUX/IAA…)'), 'on']],
    note: T('生长素是“分子胶”，把 TIR1 和 AUX/IAA 黏在一起。', 'Auxin is the ‘molecular glue’ joining TIR1 to AUX/IAA.', 'Auksin ialah ‘gam molekul’ yang menyatukan TIR1 dengan AUX/IAA.') },
  ga: { name: T('赤霉素', 'Gibberellin', 'Giberelin'),
    receptor: T('GID1（可溶性核内受体）', 'GID1 (soluble nuclear receptor)', 'GID1 (reseptor nukleus larut)'),
    off: [['DELLA', 'on'], [T('生长基因', 'Growth genes', 'Gen pertumbuhan'), 'off']],
    on: [['GA', 'sig'], ['GID1–GA', 'on'], ['GID1–GA–DELLA', 'on'], [T('SCF^SLY1/GID2 → 26S 蛋白酶体', 'SCF^SLY1/GID2 → 26S proteasome', 'SCF^SLY1/GID2 → proteasom 26S'), 'on'], ['DELLA', 'gone'], [T('生长基因开启（例如 α-淀粉酶）', 'Growth genes on (e.g. α-amylase)', 'Gen pertumbuhan hidup (cth. α-amilase)'), 'on']],
    note: T('DELLA 是生长的“刹车”；赤霉素让刹车被拆掉。', 'DELLA is the brake on growth; gibberellin gets the brake dismantled.', 'DELLA ialah brek pertumbuhan; giberelin menyebabkan brek dileraikan.') },
  ck: { name: T('细胞分裂素', 'Cytokinin', 'Sitokinin'),
    receptor: T('CRE1/AHK4、AHK2、AHK3（双组分组氨酸激酶）', 'CRE1/AHK4, AHK2, AHK3 (two-component histidine kinases)', 'CRE1/AHK4, AHK2, AHK3 (histidina kinase dua komponen)'),
    off: [['AHK', 'off'], ['AHP', 'off'], [T('B 型 ARR', 'Type-B ARR', 'ARR jenis B'), 'off']],
    on: [[T('细胞分裂素', 'Cytokinin', 'Sitokinin'), 'sig'], [T('AHK 自身磷酸化（His → Asp）', 'AHK autophosphorylates (His → Asp)', 'AHK memfosforil diri (His → Asp)'), 'on'], [T('AHP 把磷酸带进核', 'AHP carries the phosphate into the nucleus', 'AHP membawa fosfat ke nukleus'), 'on'], [T('B 型 ARR（转录因子）', 'Type-B ARR (transcription factor)', 'ARR jenis B (faktor transkripsi)'), 'on'], [T('基因开启，包括负反馈的 A 型 ARR', 'Genes on, including negative-feedback type-A ARRs', 'Gen hidup, termasuk ARR jenis A suap balik negatif'), 'on']],
    note: T('和细菌的双组分系统同一套逻辑（第 1 章）。', 'The same logic as the bacterial two-component system (Chapter 1).', 'Logik yang sama seperti sistem dua komponen bakteria (Bab 1).') },
  aba: { name: T('脱落酸', 'Abscisic acid', 'Asid absisik'),
    receptor: T('PYR/PYL/RCAR（可溶性受体）', 'PYR/PYL/RCAR (soluble receptors)', 'PYR/PYL/RCAR (reseptor larut)'),
    off: [['PP2C', 'on'], ['SnRK2', 'off'], [T('ABA 反应', 'ABA responses', 'Tindak balas ABA'), 'off']],
    on: [['ABA', 'sig'], ['PYR/PYL–ABA', 'on'], ['PP2C', 'off'], [T('SnRK2 激酶活化', 'SnRK2 kinase active', 'Kinase SnRK2 aktif'), 'on'], [T('磷酸化转录因子与离子通道 → 气孔关闭、基因表达', 'Phosphorylates TFs and ion channels → stomata close, genes on', 'Memfosforil TF dan saluran ion → stoma tertutup, gen hidup'), 'on']],
    note: T('“抑制一个抑制者”：ABA–受体把磷酸酶 PP2C 关掉，激酶才能工作。', 'Inhibiting an inhibitor: ABA–receptor shuts off the PP2C phosphatase so the kinase can work.', 'Merencat perencat: ABA–reseptor mematikan fosfatase PP2C supaya kinase boleh berfungsi.') },
  eth: { name: T('乙烯', 'Ethylene', 'Etilena'),
    receptor: T('ETR1 等（内质网膜上的双组分组氨酸激酶类受体，含铜）', 'ETR1 and relatives (two-component, histidine-kinase-like receptors in the ER membrane, with copper)', 'ETR1 dan saudaranya (reseptor dua komponen seperti histidina kinase dalam membran RE, dengan kuprum)'),
    off: [['ETR1', 'on'], ['CTR1', 'on'], ['EIN2', 'off'], [T('EIN3（被降解）', 'EIN3 (degraded)', 'EIN3 (diuraikan)'), 'gone'], [T('乙烯反应', 'Ethylene responses', 'Tindak balas etilena'), 'off']],
    on: [[T('乙烯', 'Ethylene', 'Etilena'), 'sig'], ['ETR1', 'off'], ['CTR1', 'off'], ['EIN2', 'on'], [T('EIN3/EIL 累积', 'EIN3/EIL accumulate', 'EIN3/EIL terkumpul'), 'on'], [T('ERF 等基因开启 → 三重反应', 'ERF and other genes on → triple response', 'Gen ERF dan lain-lain hidup → tindak balas tiga serangkai'), 'on']],
    note: T('反过来的逻辑：没有乙烯时受体主动“踩刹车”（经 CTR1）；乙烯让受体失活。所以受体突变体（etr1）对乙烯不敏感，ctr1 突变体则一直表现三重反应。', 'Reverse logic: without ethylene the receptor actively brakes the pathway through CTR1; ethylene switches the receptor off. Hence etr1 mutants are ethylene-insensitive, while ctr1 mutants show a constant triple response.', 'Logik terbalik: tanpa etilena reseptor secara aktif membrek laluan melalui CTR1; etilena mematikan reseptor. Oleh itu mutan etr1 tidak sensitif etilena, manakala mutan ctr1 menunjukkan tindak balas tiga serangkai yang berterusan.') },
  br: { name: T('油菜素甾醇', 'Brassinosteroid', 'Brasinosteroid'),
    receptor: T('BRI1 + BAK1（质膜上的富含亮氨酸重复受体激酶）', 'BRI1 + BAK1 (leucine-rich-repeat receptor kinases in the plasma membrane)', 'BRI1 + BAK1 (kinase reseptor ulangan kaya leusina dalam membran plasma)'),
    off: [['BKI1–BRI1', 'off'], ['BIN2', 'on'], [T('BZR1/BES1 被磷酸化，留在细胞质', 'BZR1/BES1 phosphorylated, kept in cytosol', 'BZR1/BES1 terfosforil, kekal di sitosol'), 'off']],
    on: [['BR', 'sig'], [T('BKI1 脱离；BRI1–BAK1 二聚、磷酸化', 'BKI1 leaves; BRI1–BAK1 dimerise and phosphorylate', 'BKI1 terlepas; BRI1–BAK1 berdimer dan berfosforil'), 'on'], ['BIN2', 'off'], [T('BZR1/BES1 去磷酸化进核', 'BZR1/BES1 dephosphorylated, enter nucleus', 'BZR1/BES1 dinyahfosforil, masuk nukleus'), 'on'], [T('BR 响应基因开启', 'BR-response genes on', 'Gen tindak balas BR hidup'), 'on']],
    note: T('受体在细胞膜表面——和动物的甾醇激素（核内受体）不同。', 'The receptor is on the cell surface — unlike animal steroid hormones, whose receptors are nuclear.', 'Reseptor berada di permukaan sel — tidak seperti hormon steroid haiwan, yang reseptornya di nukleus.') },
};
const L = {
  title: T('激素受体与信号：有没有激素差在哪里', 'Hormone receptors and signalling: with and without the hormone', 'Reseptor dan pengisyaratan hormon: dengan dan tanpa hormon'),
  receptor: T('受体', 'Receptor', 'Reseptor'), without: T('没有激素', 'Without hormone', 'Tanpa hormon'), with: T('有激素', 'With hormone', 'Dengan hormon'),
  state: { on: T('活化', 'active', 'aktif'), off: T('失活', 'inactive', 'tidak aktif'), gone: T('被降解', 'destroyed', 'dimusnahkan'), sig: T('信号', 'signal', 'isyarat') },
};

export function mount(el, { lang, opts = {} }) {
  const p = v => pick(v, lang);
  let key = H[opts.hormone] ? opts.hormone : 'auxin';
  const body = h('div', {});
  const chain = steps => h('ol', { class: 'hs-chain' }, steps.map(([label, st]) => h('li', { class: `hs-${st}` }, h('span', { class: 'hs-label' }, p(label)), h('span', { class: 'hs-state' }, p(L.state[st])))));
  function draw() {
    const x = H[key];
    body.replaceChildren(
      h('p', { class: 'hs-receptor' }, h('strong', {}, `${p(L.receptor)}: `), p(x.receptor)),
      h('div', { class: 'hs-cols' },
        h('div', {}, h('p', { class: 'w-label' }, p(L.without)), chain(x.off)),
        h('div', {}, h('p', { class: 'w-label' }, p(L.with)), chain(x.on))),
      h('p', { class: 'w-explain' }, p(x.note)));
  }
  const seg = h('div', { class: 'seg', role: 'group' }, Object.entries(H).map(([k, x]) => {
    const b = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': String(k === key) }, p(x.name));
    b.addEventListener('click', () => { key = k; for (const n of seg.children) n.setAttribute('aria-pressed', String(n === b)); draw(); });
    return b;
  }));
  el.append(frame({ title: p(L.title), lang, schematic: true, source: 'Lecture notes; Hopkins & Hüner 2009, chs 18–21', children: [seg, body] }));
  draw();
  return { destroy() { el.replaceChildren(); } };
}
