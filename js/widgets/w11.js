/* W11 — The nitrogen cycle in the soil. Tap an arrow to see the process
   and who carries it out (Hopkins & Hüner 2009, pp. 195–196). */

import { flowDiagram } from './flow.js';

const T = (zh, en, ms) => ({ zh, en, ms });
export function mount(el, { lang }) {
  return flowDiagram(el, { lang,
    title: T('土壤里的氮循环：点箭头', 'The nitrogen cycle in soil: tap an arrow', 'Kitaran nitrogen dalam tanah: ketik anak panah'),
    hint: T('点任何箭头或方框看说明', 'Tap any arrow or box for a note', 'Ketik mana-mana anak panah atau kotak untuk nota'),
    source: 'Hopkins & Hüner 2009, pp. 195–196',
    nodes: [
      { id: 'n2', x: 0.5, y: 0, label: T('大气 N₂', 'Air N₂', 'N₂ udara'), note: T('最大的氮库，但 N≡N 三键极稳定，植物不能直接用。', 'The largest pool, but the N≡N bond is so stable that plants cannot use it.', 'Takungan terbesar, tetapi ikatan N≡N sangat stabil sehingga tumbuhan tidak dapat menggunakannya.') },
      { id: 'nh4', x: 0, y: 0.5, label: T('NH₄⁺ 铵', 'NH₄⁺ ammonium', 'NH₄⁺ ammonium') },
      { id: 'no2', x: 0.5, y: 1, label: T('NO₂⁻ 亚硝酸', 'NO₂⁻ nitrite', 'NO₂⁻ nitrit') },
      { id: 'no3', x: 1, y: 0.5, label: T('NO₃⁻ 硝酸', 'NO₃⁻ nitrate', 'NO₃⁻ nitrat'), note: T('植物最常吸收的形式；带负电，不被土壤胶体吸住，容易流失。', 'The form plants take up most; being negative, it is not held by soil colloids and leaches easily.', 'Bentuk yang paling banyak diambil tumbuhan; bercas negatif, tidak ditahan koloid tanah dan mudah larut lesap.') },
      { id: 'org', x: 0.5, y: 0.5, label: T('有机氮（生物）', 'Organic N (life)', 'N organik (hidupan)') },
    ],
    edges: [
      { from: 'n2', to: 'nh4', label: T('固氮', 'Fixation', 'Pengikatan'), note: T('原核生物的固氮酶把 N₂ 还原成 NH₃；豆科根瘤里的根瘤菌贡献最大。工业上用高温高压（很耗能）。', 'Prokaryotic dinitrogenase reduces N₂ to NH₃; rhizobia in legume nodules contribute most. Industry uses high temperature and pressure, at great energy cost.', 'Dinitrogenase prokariot menurunkan N₂ kepada NH₃; rizobia dalam nodul kekacang menyumbang paling banyak. Industri menggunakan suhu dan tekanan tinggi, dengan kos tenaga yang besar.'), bend: 0.15 },
      { from: 'nh4', to: 'no2', label: T('硝化 ①', 'Nitrification ①', 'Penitritan ①'), note: T('亚硝化单胞菌（Nitrosomonas）把铵氧化成亚硝酸。', 'Nitrosomonas oxidises ammonium to nitrite.', 'Nitrosomonas mengoksidakan ammonium kepada nitrit.'), bend: 0.15 },
      { from: 'no2', to: 'no3', label: T('硝化 ②', 'Nitrification ②', 'Penitritan ②'), note: T('硝化杆菌（Nitrobacter）把亚硝酸氧化成硝酸。', 'Nitrobacter oxidises nitrite to nitrate.', 'Nitrobacter mengoksidakan nitrit kepada nitrat.'), bend: 0.15 },
      { from: 'no3', to: 'n2', label: T('反硝化', 'Denitrification', 'Penyahnitritan'), note: T('反硝化细菌把硝酸还原成 N₂ 回到大气；植物要和它们抢硝酸。', 'Denitrifying bacteria reduce nitrate to N₂, back to the air; plants compete with them for nitrate.', 'Bakteria penyahnitrit menurunkan nitrat kepada N₂, kembali ke udara; tumbuhan bersaing dengannya untuk nitrat.'), bend: 0.15 },
      { from: 'no3', to: 'org', label: T('同化', 'Assimilation', 'Asimilasi'), note: T('植物和微生物把硝酸变成氨基酸等有机氮（暂时“固定”，不参与循环）。', 'Plants and microbes turn nitrate into amino acids and other organic N (immobilised for a while).', 'Tumbuhan dan mikrob menukar nitrat kepada asid amino dan N organik lain (diimobilisasi buat sementara).') },
      { from: 'org', to: 'nh4', label: T('氨化', 'Ammonification', 'Pengammoniaan'), note: T('生物排泄和死后，有机氮被分解成氨（矿化）。', 'After excretion and death, organic N is broken down to ammonia (mineralisation).', 'Selepas perkumuhan dan kematian, N organik diuraikan kepada ammonia (pemineralan).') },
    ] });
}
