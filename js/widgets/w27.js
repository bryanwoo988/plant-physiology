/* W27 — Where secondary metabolites come from: the primary pathways that
   feed terpenes, phenolics, alkaloids and glycosides (Hopkins & Hüner
   2009, ch. 27; lecture notes). */

import { flowDiagram } from './flow.js';

const T = (zh, en, ms) => ({ zh, en, ms });
export function mount(el, { lang }) {
  return flowDiagram(el, { lang, aspect: 0.78,
    title: T('次生代谢物从哪里来', 'Where secondary metabolites come from', 'Dari mana metabolit sekunder datang'),
    hint: T('点方框看例子', 'Tap a box for examples', 'Ketik kotak untuk contoh'),
    source: 'Hopkins & Hüner 2009, ch. 27',
    nodes: [
      { id: 'ps', x: 0.5, y: 0, label: T('光合作用的碳', 'Photosynthetic carbon', 'Karbon fotosintesis') },
      { id: 'acoa', x: 0, y: 0.38, label: T('乙酰-CoA / 丙酮酸', 'Acetyl-CoA / pyruvate', 'Asetil-KoA / piruvat') },
      { id: 'shik', x: 0.5, y: 0.38, label: T('莽草酸途径', 'Shikimate pathway', 'Laluan shikimat') },
      { id: 'aa', x: 1, y: 0.38, label: T('氨基酸', 'Amino acids', 'Asid amino') },
      { id: 'terp', x: 0, y: 0.78, label: T('萜类', 'Terpenes', 'Terpena'), cls: 'is-end', note: T('精油、树脂、橡胶、类胡萝卜素、赤霉素、ABA、甾醇、皂苷、强心苷。', 'Essential oils, resins, rubber, carotenoids, gibberellins, ABA, sterols, saponins, cardiac glycosides.', 'Minyak pati, resin, getah, karotenoid, giberelin, ABA, sterol, saponin, glikosida kardiak.') },
      { id: 'phen', x: 0.5, y: 0.78, label: T('苯丙烷类（酚类）', 'Phenylpropanoids', 'Fenilpropanoid'), cls: 'is-end', note: T('木质素、类黄酮（花青素、异黄酮）、二苯乙烯、单宁；入口酶 PAL。', 'Lignin, flavonoids (anthocyanins, isoflavonoids), stilbenes, tannins; entry enzyme PAL.', 'Lignin, flavonoid (antosianin, isoflavonoid), stilbena, tanin; enzim pintu masuk PAL.') },
      { id: 'alk', x: 1, y: 0.78, label: T('生物碱', 'Alkaloids', 'Alkaloid'), cls: 'is-end', note: T('含氮：吗啡、可待因、毒芹碱、仙人掌毒碱；也有含氰糖苷和硫代葡萄糖苷来自氨基酸。', 'Nitrogen-containing: morphine, codeine, coniine, mescaline; cyanogenic glycosides and glucosinolates also come from amino acids.', 'Mengandungi nitrogen: morfin, kodeina, koniina, meskalina; glikosida sianogenik dan glukosinolat juga daripada asid amino.') },
    ],
    edges: [
      { from: 'ps', to: 'acoa', label: T('糖酵解', 'glycolysis', 'glikolisis'), note: T('经甲羟戊酸或 MEP 途径得到 IPP（第 19 章）。', 'Via the mevalonate or MEP pathway to IPP (Chapter 19).', 'Melalui laluan mevalonat atau MEP kepada IPP (Bab 19).') },
      { from: 'ps', to: 'shik', label: T('E4P + PEP', 'E4P + PEP', 'E4P + PEP'), note: T('赤藓糖-4-磷酸加 PEP；EPSP 合酶是草甘膦的目标。', 'Erythrose-4-phosphate plus PEP; EPSP synthase is glyphosate’s target.', 'Eritrosa-4-fosfat serta PEP; EPSP sintase ialah sasaran glifosat.') },
      { from: 'ps', to: 'aa', label: T('+ 氮', '+ nitrogen', '+ nitrogen'), note: T('氮来自第 11 章的同化。', 'Nitrogen from assimilation, Chapter 11.', 'Nitrogen daripada asimilasi, Bab 11.') },
      { from: 'acoa', to: 'terp', label: T('IPP', 'IPP', 'IPP'), note: T('五碳单位聚合。', 'Five-carbon units joined together.', 'Unit lima karbon disambung.') },
      { from: 'shik', to: 'phen', label: T('苯丙氨酸 → PAL', 'Phe → PAL', 'Phe → PAL'), note: T('苯丙氨酸 → 肉桂酸 → 香豆酸 → 咖啡酸、阿魏酸。', 'Phenylalanine → cinnamic → coumaric → caffeic, ferulic acids.', 'Fenilalanina → sinamik → kumarik → asid kafeik, ferulik.') },
      { from: 'aa', to: 'alk', label: T('含氮', 'N-containing', 'mengandungi N'), note: T('多为杂环；苦味吓阻植食动物。', 'Mostly heterocyclic; bitter, deterring herbivores.', 'Kebanyakannya heterosiklik; pahit, menghalang herbivor.') },
    ] });
}
