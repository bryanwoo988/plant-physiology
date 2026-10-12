"""Chapter 28 — Secondary metabolites. Run: python3 tools/content/ch28.py"""
import sys
sys.path.insert(0, 'tools/content')
from build import T, P, L, N, write_chapter

chapter = {"id": "ch28", "num": 28, "stage": 5,
 "title": T("次生代谢物", "Secondary metabolites", "Metabolit sekunder"),
 "sources": ["HH", "LEC"],
 "sections": [
 {"id": "s1", "heading": T("主要与次生", "Primary and secondary", "Primer dan sekunder"), "level": "basic", "blocks": [
  P("参与呼吸、光合等核心代谢的有机分子是初生代谢物。植物还把相当一部分同化的碳和能量投入{{t:secondary-metabolite}}（天然产物）：它们由初生代谢物衍生而来，对细胞运作不是必需的，却很有用——防御、吸引传粉者、与共生者沟通——浓度通常低得多，许多有药用或经济价值。主要有四大类：萜类、糖苷、苯丙烷类（酚类）和生物碱。",
    "The organic molecules of respiration, photosynthesis and other core pathways are primary metabolites. Plants also put a significant share of assimilated carbon and energy into {{t:secondary-metabolite}}s (natural products): derived from primary metabolites, not essential to the cell but beneficial — for defence, attracting pollinators, talking to symbionts — usually at much lower concentrations, and often of medicinal or economic value. There are four big groups: terpenes, glycosides, phenylpropanoids (phenolics) and alkaloids.",
    "Molekul organik respirasi, fotosintesis dan laluan teras lain ialah metabolit primer. Tumbuhan juga melaburkan sebahagian besar karbon dan tenaga yang diasimilasi ke dalam {{t:secondary-metabolite}} (hasil semula jadi): berasal daripada metabolit primer, tidak penting kepada sel tetapi bermanfaat — untuk pertahanan, menarik pendebunga, berkomunikasi dengan simbion — biasanya pada kepekatan yang jauh lebih rendah, dan sering bernilai perubatan atau ekonomi. Terdapat empat kumpulan besar: terpena, glikosida, fenilpropanoid (fenolik) dan alkaloid.",
    defines=["secondary-metabolite"], src=["HH:459-460", "LEC"]),
  {"type": "widget", "id": "W27"},
 ]},
 {"id": "s2", "heading": T("萜类与糖苷", "Terpenes and glycosides", "Terpena dan glikosida"), "level": "basic", "blocks": [
  P("萜类（第 19 章）是种类最多的一群：除了赤霉素、类胡萝卜素和甾醇，还包括精油、树脂，以及乳胶中的天然橡胶——商业来源主要是原产巴西的橡胶树（Hevea brasiliensis），乳胶里约 30–40 % 是橡胶。",
    "Terpenes (Chapter 19) are the largest group: besides gibberellins, carotenoids and sterols they include essential oils, resins and the natural rubber of latex — commercially from the rubber tree Hevea brasiliensis, native to Brazil, whose latex is about 30–40 % rubber.",
    "Terpena (Bab 19) ialah kumpulan terbesar: selain giberelin, karotenoid dan sterol, ia termasuk minyak pati, resin dan getah asli lateks — secara komersial daripada pokok getah Hevea brasiliensis, berasal dari Brazil, yang lateksnya kira-kira 30–40 % getah.",
    src=["HH:460-463"]),
  P("{{t:glycoside}}是糖与含羟基的分子缩合而成，大多是吓阻植食动物的物质：",
    "A {{t:glycoside}} is a sugar condensed with a molecule bearing a hydroxyl group; most deter herbivores:",
    "{{t:glycoside}} ialah gula yang berkondensasi dengan molekul yang mempunyai kumpulan hidroksil; kebanyakannya menghalang herbivor:",
    defines=["glycoside"], src=["HH:463", "LEC"]),
  L(("皂苷：亲水的糖加疏水的萜类，像清洁剂，在水中摇动会起稳定的泡沫；与入侵真菌细胞膜中的甾醇结合，破坏膜。对哺乳动物毒性不大（但味苦、刺激胃），对鱼毒性很高，曾被用来毒鱼。", "Saponins: a hydrophilic sugar plus a hydrophobic terpenoid, so they behave like detergents and foam when shaken in water; they bind sterols in the membranes of invading fungi and disrupt them. Not very toxic to mammals (though bitter and irritating to the gut), but highly toxic to fish — they have been used as fish poisons.", "Saponin: gula hidrofilik serta terpenoid hidrofobik, jadi ia berkelakuan seperti detergen dan berbuih apabila digoncang dalam air; ia terikat pada sterol dalam membran kulat yang menyerang dan merosakkannya. Tidak begitu toksik kepada mamalia (walaupun pahit dan merengsakan perut), tetapi sangat toksik kepada ikan — ia pernah digunakan sebagai racun ikan."),
    ("强心苷（卡烯内酯）：结构类似甾体皂苷，影响心肌。", "Cardiac glycosides (cardenolides): structurally like steroid saponins, acting on heart muscle.", "Glikosida kardiak (kardenolida): strukturnya seperti saponin steroid, bertindak ke atas otot jantung."),
    ("含氰糖苷：组织受伤时被酶分解，放出有毒的氰化氢。", "Cyanogenic glycosides: broken down by enzymes when tissue is damaged, releasing poisonous hydrogen cyanide.", "Glikosida sianogenik: diuraikan oleh enzim apabila tisu rosak, membebaskan hidrogen sianida yang beracun."),
    ("硫代葡萄糖苷：分解成的硫氰酸盐和异硫氰酸盐，就是芥末辛辣味的来源（第 4 章）。", "Glucosinolates: their breakdown products, thiocyanates and isothiocyanates, give mustards their pungency (Chapter 4).", "Glukosinolat: hasil penguraiannya, tiosianat dan isotiosianat, memberi mustard kepedasannya (Bab 4)."),
    src=["HH:463-467", "LEC"]),
 ]},
 {"id": "s3", "heading": T("苯丙烷类：从莽草酸到木质素和类黄酮", "Phenylpropanoids: from shikimate to lignin and flavonoids", "Fenilpropanoid: daripada shikimat kepada lignin dan flavonoid"), "level": "basic", "blocks": [
  P("芳香族氨基酸是{{t:phenylpropanoid}}（又称酚类、多酚）的前体，由莽草酸途径合成（第 18 章）。从莽草酸到分支酸的步骤之一由 EPSP 合酶（5-烯醇丙酮酸莽草酸-3-磷酸合酶）催化——它就是除草剂草甘膦（Roundup 的有效成分）的作用目标。",
    "The aromatic amino acids, made by the shikimic acid pathway (Chapter 18), are the precursors of {{t:phenylpropanoid}}s (phenolics, polyphenols). One step from shikimate to chorismate is catalysed by EPSP synthase (5-enolpyruvylshikimate-3-phosphate synthase) — the target of glyphosate, the active ingredient of Roundup.",
    "Asid amino aromatik, yang dibuat oleh laluan asid shikimik (Bab 18), ialah prekursor {{t:phenylpropanoid}} (fenolik, polifenol). Satu langkah daripada shikimat kepada korismat dimangkinkan oleh EPSP sintase (5-enolpiruvilshikimat-3-fosfat sintase) — sasaran glifosat, bahan aktif Roundup.",
    defines=["phenylpropanoid"], src=["HH:467-469", "LEC"]),
  P("进入酚类合成的关键酶是{{t:pal}}：它把苯丙氨酸脱氨，生成肉桂酸；肉桂酸再转成对香豆酸，然后是咖啡酸和阿魏酸——它们是其余酚类的前体。",
    "The gateway enzyme to the phenolics is {{t:pal}}, which deaminates phenylalanine to cinnamic acid; cinnamic acid becomes p-coumaric acid and then caffeic and ferulic acids, the precursors of the other phenolics.",
    "Enzim pintu masuk kepada fenolik ialah {{t:pal}}, yang menyahaminasi fenilalanina kepada asid sinamik; asid sinamik menjadi asid p-kumarik dan kemudian asid kafeik dan ferulik, prekursor fenolik lain.",
    defines=["pal"], src=["HH:469-470", "LEC"]),
  L(("木质素：由单木质醇聚合成的大而不规则的聚合物，合成需要过氧化物酶；沉积在木质部的次生壁中，提供支撑，也是防御物质（第 17 章）。", "Lignin: a large, irregular polymer of monolignols, made with the help of peroxidase; deposited in xylem secondary walls for support and as a defence (Chapter 17).", "Lignin: polimer besar dan tidak teratur monolignol, dibuat dengan bantuan peroksidase; dimendapkan dalam dinding sekunder xilem untuk sokongan dan sebagai pertahanan (Bab 17)."),
    ("{{t:flavonoid}}：超过 4500 种、有 A、B、C 三个环。它们由苯丙烷单位加上来自丙二酰-CoA 的部分合成，查耳酮合酶催化第一个专一步骤（例如生成柚皮素，再到山奈酚、槲皮素等黄酮醇）。功能包括：花青素吸引传粉者；异黄酮类是植保素和抗菌物质（第 13 章）；共生识别——根瘤菌就是被类黄酮吸引的（第 11 章）。", "{{t:flavonoid}}s: more than 4,500 compounds with three rings, A, B and C, built from a phenylpropanoid unit plus parts from malonyl-CoA; chalcone synthase catalyses the first committed step (to naringenin, then flavonols such as kaempferol and quercetin). Roles include anthocyanins attracting pollinators, isoflavonoids acting as phytoalexins and antimicrobials (Chapter 13), and symbiont recognition — rhizobia are attracted by flavonoids (Chapter 11).", "{{t:flavonoid}}: lebih 4,500 sebatian dengan tiga gelang, A, B dan C, dibina daripada unit fenilpropanoid serta bahagian daripada malonil-KoA; kalkon sintase memangkinkan langkah komited pertama (kepada naringenin, kemudian flavonol seperti kaempferol dan kuersetin). Peranannya termasuk antosianin menarik pendebunga, isoflavonoid bertindak sebagai fitoaleksin dan antimikrob (Bab 13), dan pengecaman simbion — rizobia ditarik oleh flavonoid (Bab 11)."),
    ("二苯乙烯类：也由丙二酰-CoA 衍生，由二苯乙烯合酶决定走这条路；保护心材免受真菌入侵。", "Stilbenes: also from malonyl-CoA, committed by stilbene synthase; they defend heartwood against fungi.", "Stilbena: juga daripada malonil-KoA, dikomitkan oleh stilbena sintase; ia melindungi teras kayu daripada kulat."),
    ("单宁：缩合单宁是类黄酮单位以强碳键连成的聚合物；可水解单宁则是糖（通常葡萄糖）与没食子酸酯化而成。单宁吓阻动物取食，也可能降低膳食蛋白质的消化率。", "Tannins: condensed tannins are polymers of flavonoid units joined by strong carbon bonds; hydrolysable tannins are a sugar (usually glucose) esterified to gallic acid. Tannins deter feeding and may lower the digestibility of dietary protein.", "Tanin: tanin terkondensasi ialah polimer unit flavonoid yang disambung ikatan karbon yang kuat; tanin boleh dihidrolisis ialah gula (biasanya glukosa) yang diesterkan kepada asid galik. Tanin menghalang pemakanan dan mungkin mengurangkan kebolehcernaan protein makanan."),
    defines=["flavonoid"], src=["HH:470-474", "LEC"]),
 ]},
 {"id": "s4", "heading": T("生物碱", "Alkaloids", "Alkaloid"), "level": "basic", "blocks": [
  P("{{t:alkaloid}}是含氮、溶于水、生物活性很高的次生代谢物，大多是杂环，但也有脂肪族的例子（例如仙人掌毒碱、秋水仙素）。许多药物是生物碱：鸦片里的吗啡、可待因和罂粟碱；毒芹含毒芹碱；佩奥特仙人掌含仙人掌毒碱。对植物来说，生物碱是防御物质：苦味吓阻植食动物，大多对昆虫或动物有毒，很多也抗菌；它们倾向累积在容易被吃的幼嫩组织。",
    "{{t:alkaloid}}s are nitrogen-containing, water-soluble secondary metabolites of high biological activity, mostly heterocyclic but with some aliphatic examples such as mescaline and colchicine. Many drugs are alkaloids: morphine, codeine and papaverine from opium; coniine in hemlock; mescaline in peyote. For the plant they are defences: the bitter taste deters herbivores, most are toxic to insects or animals, many are antimicrobial, and they tend to accumulate in young tissues most at risk of being eaten.",
    "{{t:alkaloid}} ialah metabolit sekunder yang mengandungi nitrogen, larut air dan sangat aktif secara biologi, kebanyakannya heterosiklik tetapi dengan beberapa contoh alifatik seperti meskalina dan kolkisina. Banyak ubat ialah alkaloid: morfin, kodeina dan papaverina daripada candu; koniina dalam hemlock; meskalina dalam peyote. Bagi tumbuhan ia pertahanan: rasa pahit menghalang herbivor, kebanyakannya toksik kepada serangga atau haiwan, banyak yang antimikrob, dan ia cenderung terkumpul dalam tisu muda yang paling berisiko dimakan.",
    defines=["alkaloid"], src=["HH:476-478", "LEC"]),
  N("key", "把整门课串起来：次生代谢物的原料来自光合作用的碳（第 8 章）、呼吸的中间产物（第 10 章）和同化的氮（第 11 章）；它们又回过头参与逆境防御（第 13 章）、共生（第 11 章）和激素（茉莉酸、水杨酸）。",
    "Tying the course together: secondary metabolites are built from photosynthetic carbon (Chapter 8), respiratory intermediates (Chapter 10) and assimilated nitrogen (Chapter 11), and they feed back into stress defence (Chapter 13), symbiosis (Chapter 11) and hormones (jasmonate, salicylate).",
    "Menyatukan kursus ini: metabolit sekunder dibina daripada karbon fotosintesis (Bab 8), perantaraan respirasi (Bab 10) dan nitrogen yang diasimilasi (Bab 11), dan ia kembali menyumbang kepada pertahanan tekanan (Bab 13), simbiosis (Bab 11) dan hormon (jasmonat, salisilat).",
    src=["HH:459-460", "HH:476", "LEC"]),
 ]},
]}

terms = [
 ("secondary-metabolite", T("次生代谢物", "secondary metabolite", "metabolit sekunder"),
  T("由初生代谢物衍生、非细胞必需但有益的化合物：萜类、糖苷、酚类、生物碱。", "A compound derived from primary metabolism, not essential to the cell but beneficial: terpenes, glycosides, phenolics, alkaloids.", "Sebatian yang berasal daripada metabolisme primer, tidak penting kepada sel tetapi bermanfaat: terpena, glikosida, fenolik, alkaloid.")),
 ("glycoside", T("糖苷", "glycoside", "glikosida"),
  T("糖与含羟基分子缩合成的化合物，例如皂苷、强心苷、含氰糖苷、硫代葡萄糖苷。", "A sugar condensed with a hydroxyl-bearing molecule: saponins, cardiac glycosides, cyanogenic glycosides, glucosinolates.", "Gula yang berkondensasi dengan molekul berhidroksil: saponin, glikosida kardiak, glikosida sianogenik, glukosinolat.")),
 ("phenylpropanoid", T("苯丙烷类（酚类）", "phenylpropanoid (phenolic)", "fenilpropanoid (fenolik)"),
  T("由苯丙氨酸经莽草酸途径衍生的化合物：木质素、类黄酮、单宁等。", "Compounds derived from phenylalanine via the shikimate pathway: lignin, flavonoids, tannins.", "Sebatian yang berasal daripada fenilalanina melalui laluan shikimat: lignin, flavonoid, tanin.")),
 ("pal", T("苯丙氨酸解氨酶", "phenylalanine ammonia-lyase", "fenilalanina amonia-liase"),
  T("把苯丙氨酸脱氨成肉桂酸，是酚类合成的入口酶。", "Deaminates phenylalanine to cinnamic acid; the entry enzyme to phenolics.", "Menyahaminasi fenilalanina kepada asid sinamik; enzim pintu masuk kepada fenolik."), "PAL"),
 ("flavonoid", T("类黄酮", "flavonoid", "flavonoid"),
  T("有 A、B、C 三环的酚类，包括花青素、异黄酮；查耳酮合酶催化第一步。", "Three-ringed (A, B, C) phenolics including anthocyanins and isoflavonoids; chalcone synthase makes the first committed step.", "Fenolik tiga gelang (A, B, C) termasuk antosianin dan isoflavonoid; kalkon sintase membuat langkah komited pertama.")),
 ("alkaloid", T("生物碱", "alkaloid", "alkaloid"),
  T("含氮、生物活性高的防御性次生代谢物，例如吗啡、尼古丁。", "A nitrogen-containing, highly active defensive secondary metabolite, such as morphine.", "Metabolit sekunder pertahanan yang mengandungi nitrogen dan sangat aktif, seperti morfin.")),
]

quiz = [
 {"stage": 5, "chapter": "ch28",
  "q": T("草甘膦抑制哪一个酶？", "Which enzyme does glyphosate inhibit?", "Enzim manakah yang direncat oleh glifosat?"),
  "options": [T("PAL", "PAL", "PAL"), T("EPSP 合酶（莽草酸途径）", "EPSP synthase (shikimate pathway)", "EPSP sintase (laluan shikimat)"), T("查耳酮合酶", "Chalcone synthase", "Kalkon sintase"), T("rubisco", "Rubisco", "Rubisco")],
  "answer": 1, "why": T("阻断莽草酸途径，芳香族氨基酸就合成不了。", "It blocks the shikimate pathway, so aromatic amino acids cannot be made.", "Ia menyekat laluan shikimat, jadi asid amino aromatik tidak dapat dibuat.")},
 {"stage": 5, "chapter": "ch28",
  "q": T("酚类合成的入口酶是？", "The entry enzyme of phenolic synthesis is…", "Enzim pintu masuk sintesis fenolik ialah…"),
  "options": [T("苯丙氨酸解氨酶（PAL）", "Phenylalanine ammonia-lyase (PAL)", "Fenilalanina amonia-liase (PAL)"), T("ACC 合成酶", "ACC synthase", "ACC sintase"), T("NCED", "NCED", "NCED"), T("IPT", "IPT", "IPT")],
  "answer": 0, "why": T("PAL 把苯丙氨酸脱氨成肉桂酸。", "PAL deaminates phenylalanine to cinnamic acid.", "PAL menyahaminasi fenilalanina kepada asid sinamik.")},
 {"stage": 5, "chapter": "ch28",
  "q": T("生物碱有什么共同特点？", "What do alkaloids have in common?", "Apakah persamaan alkaloid?"),
  "options": [T("都是萜类", "They are all terpenes", "Semuanya terpena"), T("含氮、溶于水、生物活性高", "They contain nitrogen, are water-soluble and highly active", "Ia mengandungi nitrogen, larut air dan sangat aktif"), T("都是糖苷", "They are all glycosides", "Semuanya glikosida"), T("都带颜色", "They are all coloured", "Semuanya berwarna")],
  "answer": 1, "why": T("例如吗啡、可待因、毒芹碱。", "Morphine, codeine and coniine, for example.", "Morfin, kodeina dan koniina, contohnya.")},
]

if __name__ == "__main__":
    write_chapter(chapter, terms, [], quiz)
