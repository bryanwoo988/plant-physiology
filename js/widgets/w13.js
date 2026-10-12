/* W13 — The two layers of plant immunity (PTI and ETI) as a clickable
   flow, after the lecture notes and Hopkins & Hüner 2009, pp. 235–237. */

import { flowDiagram } from './flow.js';

const T = (zh, en, ms) => ({ zh, en, ms });
export function mount(el, { lang }) {
  return flowDiagram(el, { lang, aspect: 0.8,
    title: T('植物免疫的两层：点方框和箭头', 'Two layers of plant immunity: tap boxes and arrows', 'Dua lapisan keimunan tumbuhan: ketik kotak dan anak panah'),
    hint: T('从左上的“病原”开始看', 'Start from ‘Pathogen’ at the top left', 'Mulakan dari ‘Patogen’ di kiri atas'),
    source: 'Lecture notes; Hopkins & Hüner 2009, pp. 235–237',
    nodes: [
      { id: 'pat', x: 0, y: 0, label: T('病原', 'Pathogen', 'Patogen'), note: T('细菌、真菌等；带有保守分子（PAMP/MAMP）。', 'Bacteria, fungi and so on, carrying conserved molecules (PAMPs/MAMPs).', 'Bakteria, kulat dan lain-lain, membawa molekul terpelihara (PAMP/MAMP).') },
      { id: 'prr', x: 1, y: 0, label: T('模式识别受体', 'Pattern receptor', 'Reseptor corak'), note: T('细胞表面的受体，认出鞭毛蛋白、几丁质、脂多糖等。', 'Cell-surface receptors that recognise flagellin, chitin, lipopolysaccharide and the like.', 'Reseptor permukaan sel yang mengenal pasti flagelin, kitin, lipopolisakarida dan seumpamanya.') },
      { id: 'pti', x: 1, y: 0.36, label: T('PTI', 'PTI', 'PTI'), note: T('快速、广谱：加强细胞壁、活性氧、胼胝质、抗菌物质。', 'Fast and general: wall strengthening, reactive oxygen, callose, antimicrobials.', 'Pantas dan umum: pengukuhan dinding, oksigen reaktif, kalos, antimikrob.') },
      { id: 'eff', x: 0, y: 0.36, label: T('效应蛋白', 'Effectors', 'Efektor'), note: T('病原经 III 型分泌系统注入细胞，压制 PTI。', 'Injected through the type III secretion system to suppress PTI.', 'Disuntik melalui sistem rembesan jenis III untuk menindas PTI.') },
      { id: 'r', x: 0, y: 0.7, label: T('R 蛋白', 'R protein', 'Protein R'), note: T('抗病基因的产物；每个 R 蛋白认一个特定效应蛋白。', 'Product of a resistance gene; each recognises a specific effector.', 'Hasil gen rintangan; setiap satu mengenal pasti efektor tertentu.') },
      { id: 'eti', x: 0.5, y: 0.7, label: T('ETI', 'ETI', 'ETI'), note: T('强烈、专一的防御。', 'Strong, specific defence.', 'Pertahanan kuat dan khusus.') },
      { id: 'hr', x: 1, y: 0.7, label: T('过敏反应 HR', 'Hypersensitive response', 'Tindak balas hipersensitif'), note: T('感染点细胞程序性死亡；活性氧、植保素、PR 蛋白。', 'Programmed death at the infection site; reactive oxygen, phytoalexins, PR proteins.', 'Kematian terprogram di tapak jangkitan; oksigen reaktif, fitoaleksin, protein PR.') },
      { id: 'sar', x: 1, y: 1, label: T('SAR（全株）', 'SAR (whole plant)', 'SAR (seluruh tumbuhan)'), note: T('水杨酸经韧皮部（或以水杨酸甲酯经空气）传出，全株获得持久、广谱的抗性。', 'Salicylic acid travels in the phloem (or as airborne methyl salicylate) and the whole plant gains lasting, broad resistance.', 'Asid salisilik bergerak dalam floem (atau sebagai metil salisilat bawaan udara) dan seluruh tumbuhan memperoleh rintangan tahan lama dan luas.') },
    ],
    edges: [
      { from: 'pat', to: 'prr', label: T('PAMP', 'PAMP', 'PAMP'), note: T('保守的病原分子被识别。', 'Conserved pathogen molecules are recognised.', 'Molekul patogen terpelihara dikenal pasti.') },
      { from: 'prr', to: 'pti', label: T('触发', 'triggers', 'mencetus'), note: T('第一层防御。', 'The first layer of defence.', 'Lapisan pertahanan pertama.') },
      { from: 'pat', to: 'eff', label: T('注入', 'injects', 'menyuntik'), note: T('病原的反击。', 'The pathogen strikes back.', 'Patogen membalas.') },
      { from: 'eff', to: 'pti', label: T('压制', 'suppress', 'menindas'), note: T('效应蛋白关掉 PTI，病原才能成功感染。', 'Effectors switch PTI off so infection can succeed.', 'Efektor mematikan PTI supaya jangkitan berjaya.'), cls: 'is-bad' },
      { from: 'eff', to: 'r', label: T('被识别', 'recognised', 'dikenal pasti'), note: T('植物演化出能认出效应蛋白的 R 蛋白。', 'Plants evolved R proteins that recognise the effectors.', 'Tumbuhan berevolusi protein R yang mengenal pasti efektor.') },
      { from: 'r', to: 'eti', label: T('激活', 'activates', 'mengaktifkan'), note: T('第二层防御。', 'The second layer of defence.', 'Lapisan pertahanan kedua.') },
      { from: 'eti', to: 'hr', label: T('局部', 'local', 'setempat'), note: T('在感染点把病原困死。', 'Traps the pathogen at the infection site.', 'Memerangkap patogen di tapak jangkitan.') },
      { from: 'hr', to: 'sar', label: T('水杨酸', 'salicylic acid', 'asid salisilik'), note: T('信号从感染点传到全株。', 'The signal spreads from the infection site to the whole plant.', 'Isyarat merebak dari tapak jangkitan ke seluruh tumbuhan.') },
    ] });
}
