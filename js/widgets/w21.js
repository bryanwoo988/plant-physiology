/* W21 — Ethylene biosynthesis: methionine → SAM → ACC → ethylene, with the
   Yang cycle returning the sulphur. Tap each enzyme (Hopkins & Hüner
   2009, pp. 364–365; lecture notes). */

import { flowDiagram } from './flow.js';

const T = (zh, en, ms) => ({ zh, en, ms });
export function mount(el, { lang }) {
  return flowDiagram(el, { lang, aspect: 0.62,
    title: T('乙烯合成：三个关键酶（点箭头）', 'Ethylene synthesis: three key enzymes (tap the arrows)', 'Sintesis etilena: tiga enzim utama (ketik anak panah)'),
    hint: T('点箭头看酶的名字和调控', 'Tap an arrow for the enzyme and its control', 'Ketik anak panah untuk enzim dan kawalannya'),
    source: 'Hopkins & Hüner 2009, pp. 364–365',
    nodes: [
      { id: 'met', x: 0, y: 0, label: T('甲硫氨酸', 'Methionine', 'Metionina') },
      { id: 'sam', x: 0.5, y: 0, label: T('SAM', 'SAM', 'SAM'), note: T('S-腺苷甲硫氨酸；也是许多甲基化反应的甲基供体。', 'S-adenosylmethionine — also the methyl donor for many methylations.', 'S-adenosilmetionina — juga penderma metil untuk banyak pemetilan.') },
      { id: 'acc', x: 1, y: 0, label: T('ACC', 'ACC', 'ACC'), note: T('1-氨基环丙烷-1-羧酸；可由根经木质部运到地上部再转成乙烯。', '1-aminocyclopropane-1-carboxylic acid.', 'Asid 1-aminosiklopropana-1-karboksilik.') },
      { id: 'eth', x: 1, y: 1, label: T('乙烯 C₂H₄', 'Ethylene C₂H₄', 'Etilena C₂H₄'), cls: 'is-end' },
      { id: 'mta', x: 0.5, y: 1, label: T('含硫副产物', 'Sulphur by-product', 'Hasil sampingan sulfur'), note: T('5′-甲硫腺苷（MTA）。', '5′-methylthioadenosine (MTA).', '5′-metiltioadenosina (MTA).') },
    ],
    edges: [
      { from: 'met', to: 'sam', label: T('① SAM 合成酶', '① SAM synthetase', '① SAM sintetase'), note: T('加上腺苷（来自 ATP）。', 'Adds adenosine from ATP.', 'Menambah adenosina daripada ATP.') },
      { from: 'sam', to: 'acc', label: T('② ACC 合成酶', '② ACC synthase', '② ACC sintase'), note: T('限速步骤。生长素、伤害、水分胁迫、温度和乙烯本身（自催化）都在转录层次诱导 ACS 基因。', 'Rate-limiting. Auxin, wounding, water stress, temperature and ethylene itself (autocatalysis) all induce ACS genes transcriptionally.', 'Pengehad kadar. Auksin, luka, tekanan air, suhu dan etilena itu sendiri (autokatalisis) semuanya mengaruh gen ACS secara transkripsi.') },
      { from: 'acc', to: 'eth', label: T('③ ACC 氧化酶', '③ ACC oxidase', '③ ACC oksidase'), note: T('需要 O₂；ACO 基因在成熟果实中大量表达。', 'Needs O₂; ACO genes are highly expressed in ripening fruit.', 'Memerlukan O₂; gen ACO diekspresikan dengan tinggi dalam buah yang masak.') },
      { from: 'sam', to: 'mta', label: T('副产物', 'by-product', 'hasil sampingan'), note: T('ACS 反应放出含硫的部分。', 'Released by the ACS reaction.', 'Dibebaskan oleh tindak balas ACS.'), bend: 0.12 },
      { from: 'mta', to: 'met', label: T('Yang 循环', 'Yang cycle', 'Kitaran Yang'), note: T('把硫回收成甲硫氨酸，让乙烯能持续合成。', 'Recycles the sulphur to methionine so ethylene synthesis can continue.', 'Mengitar semula sulfur kepada metionina supaya sintesis etilena boleh berterusan.'), bend: 0.12 },
    ] });
}
