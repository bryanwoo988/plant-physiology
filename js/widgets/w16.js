/* W16 — From mother cells to seed: meiosis, the embryo sac, pollen and
   double fertilisation, as a clickable flow (Hopkins & Hüner 2009,
   pp. 280–281; lecture notes). */

import { flowDiagram } from './flow.js';

const T = (zh, en, ms) => ({ zh, en, ms });
export function mount(el, { lang }) {
  return flowDiagram(el, { lang, aspect: 0.82,
    title: T('从母细胞到种子：双受精', 'From mother cells to seed: double fertilisation', 'Daripada sel induk kepada biji: persenyawaan berganda'),
    hint: T('左边是雌，右边是雄；点方框看说明', 'Female on the left, male on the right; tap a box', 'Betina di kiri, jantan di kanan; ketik kotak'),
    source: 'Hopkins & Hüner 2009, pp. 280–281',
    nodes: [
      { id: 'mmc', x: 0, y: 0, label: T('大孢子母细胞', 'Megaspore mother cell', 'Sel induk megaspora'), note: T('在胚珠里，2N。', 'In the ovule; 2N.', 'Dalam ovul; 2N.') },
      { id: 'mega', x: 0, y: 0.3, label: T('4 个大孢子（1 个存活）', '4 megaspores (1 survives)', '4 megaspora (1 hidup)'), note: T('减数分裂产物，N；三个退化。', 'Products of meiosis, N; three degenerate.', 'Hasil meiosis, N; tiga merosot.') },
      { id: 'sac', x: 0, y: 0.62, label: T('胚囊：卵 + 极核', 'Embryo sac: egg + polar nuclei', 'Kantung embrio: telur + nukleus kutub'), note: T('8 核 7 细胞；卵 N，两个极核 N + N。', '8 nuclei, 7 cells; the egg is N, the two polar nuclei N + N.', '8 nukleus, 7 sel; telur N, dua nukleus kutub N + N.') },
      { id: 'pmc', x: 1, y: 0, label: T('小孢子母细胞', 'Microspore mother cell', 'Sel induk mikrospora'), note: T('在花药里，2N。', 'In the anther; 2N.', 'Dalam anter; 2N.') },
      { id: 'pollen', x: 1, y: 0.3, label: T('花粉：管细胞 + 生殖细胞', 'Pollen: tube + generative cell', 'Debunga: sel tiub + generatif'), note: T('4 个小孢子各发育成一粒花粉。', 'Each of the 4 microspores becomes a pollen grain.', 'Setiap 4 mikrospora menjadi butir debunga.') },
      { id: 'sperm', x: 1, y: 0.62, label: T('花粉管 + 2 个精核', 'Pollen tube + 2 sperm', 'Tiub debunga + 2 sperma'), note: T('管细胞长出花粉管穿过雌蕊；生殖细胞分裂成两个精核。', 'The tube cell grows the pollen tube down the pistil; the generative cell divides into two sperm nuclei.', 'Sel tiub menumbuhkan tiub debunga menuruni pistil; sel generatif membahagi menjadi dua nukleus sperma.') },
      { id: 'zyg', x: 0.15, y: 1, label: T('合子 2N → 胚', 'Zygote 2N → embryo', 'Zigot 2N → embrio'), note: T('精核 + 卵。', 'Sperm + egg.', 'Sperma + telur.') },
      { id: 'endo', x: 0.85, y: 1, label: T('胚乳 3N', 'Endosperm 3N', 'Endosperma 3N'), note: T('精核 + 两个极核；供养胚。', 'Sperm + two polar nuclei; feeds the embryo.', 'Sperma + dua nukleus kutub; memberi makan embrio.') },
    ],
    edges: [
      { from: 'mmc', to: 'mega', label: T('减数分裂', 'meiosis', 'meiosis'), note: T('染色体减半。', 'Halves the chromosome number.', 'Mengurangkan separuh bilangan kromosom.') },
      { from: 'mega', to: 'sac', label: T('有丝分裂', 'mitosis', 'mitosis'), note: T('存活的大孢子经三次有丝分裂成 8 个核。', 'The surviving megaspore goes through three mitoses to eight nuclei.', 'Megaspora yang hidup melalui tiga mitosis kepada lapan nukleus.') },
      { from: 'pmc', to: 'pollen', label: T('减数分裂', 'meiosis', 'meiosis'), note: T('产生 4 个小孢子。', 'Gives four microspores.', 'Menghasilkan empat mikrospora.') },
      { from: 'pollen', to: 'sperm', label: T('授粉', 'pollination', 'pendebungaan'), note: T('花粉落在柱头上萌发。', 'Pollen lands on the stigma and germinates.', 'Debunga jatuh pada stigma dan bercambah.') },
      { from: 'sperm', to: 'zyg', label: T('受精 ①', 'fertilisation ①', 'persenyawaan ①'), note: T('一个精核与卵结合。', 'One sperm nucleus fuses with the egg.', 'Satu nukleus sperma bergabung dengan telur.') },
      { from: 'sperm', to: 'endo', label: T('受精 ②', 'fertilisation ②', 'persenyawaan ②'), note: T('另一个精核与两个极核结合——这就是“双”受精。', 'The other fuses with the two polar nuclei — hence ‘double’.', 'Yang satu lagi bergabung dengan dua nukleus kutub — sebab itu ‘berganda’.') },
      { from: 'sac', to: 'zyg', label: T('卵', 'egg', 'telur'), note: T('卵细胞提供一半染色体。', 'The egg provides half the chromosomes.', 'Telur menyediakan separuh kromosom.') },
      { from: 'sac', to: 'endo', label: T('极核', 'polar nuclei', 'nukleus kutub'), note: T('两个极核各 N。', 'Two polar nuclei, each N.', 'Dua nukleus kutub, setiap satu N.'), bend: -0.08 },
    ] });
}
