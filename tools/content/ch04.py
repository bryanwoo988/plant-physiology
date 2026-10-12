"""Chapter 4 — Plants and inorganic nutrients. Run: python3 tools/content/ch04.py"""
import sys
sys.path.insert(0, 'tools/content')
from build import T, P, L, N, write_chapter

def row(el, form, fn, mob, sym):
    return [T(el, el, el), T(*form), T(*fn), T(*mob), T(*sym)]

HI = ("高", "high", "tinggi")
LO = ("低", "low", "rendah")

chapter = {"id": "ch04", "num": 4, "stage": 1,
 "title": T("植物与无机营养", "Plants and inorganic nutrients", "Tumbuhan dan nutrien tak organik"),
 "sources": ["HH", "LEC"],
 "sections": [
 {"id": "s1", "heading": T("从“吃土”到水培", "From soil to solution culture", "Daripada tanah ke kultur larutan"), "level": "basic", "blocks": [
  P("动物是异养的，靠现成的有机物过活；植物是自养的，可以在完全无机的环境里生存。植物营养分两部分：有机营养是靠光合作用把碳、氢、氧变成有机物；无机营养是从土壤取得矿质元素，也就是本章的主题。",
    "Animals are heterotrophs, living on ready-made organic molecules; plants are autotrophs that can live in an entirely inorganic world. Plant nutrition has two parts: organic nutrition, building carbon compounds from C, H and O by photosynthesis; and inorganic nutrition, taking mineral elements from the soil — the subject of this chapter.",
    "Haiwan ialah heterotrof yang hidup daripada molekul organik sedia ada; tumbuhan ialah autotrof yang boleh hidup dalam persekitaran tak organik sepenuhnya. Pemakanan tumbuhan ada dua bahagian: pemakanan organik, membina sebatian karbon daripada C, H dan O melalui fotosintesis; dan pemakanan tak organik, mengambil unsur mineral dari tanah — topik bab ini.",
    src=["HH:61-62", "LEC"]),
  L(("de Saussure（1767–1845）：用元素分析发现某些元素是生长必需的。", "de Saussure (1767–1845): elemental analysis showed some elements are needed for growth.", "de Saussure (1767–1845): analisis unsur menunjukkan sesetengah unsur diperlukan untuk pertumbuhan."),
    ("Sprengel（1787–1859）：只要缺一种必需元素，土壤就可能长不好。", "Sprengel (1787–1859): a soil may be unproductive if it lacks just one necessary element.", "Sprengel (1787–1859): tanah mungkin tidak produktif jika kekurangan satu unsur yang perlu sahaja."),
    ("Boussingault：豆科植物能利用空气中的氮——后来证实是根瘤里的固氮细菌。", "Boussingault: legumes can use atmospheric nitrogen — later traced to nitrogen-fixing bacteria in root nodules.", "Boussingault: kekacang boleh menggunakan nitrogen atmosfera — kemudian dikesan kepada bakteria pengikat nitrogen dalam nodul akar."),
    ("Sachs（1860）：第一次证明植物可以不用土壤，在配好的营养液里长大。", "Sachs (1860): first showed plants can grow without soil in a defined nutrient solution.", "Sachs (1860): pertama kali menunjukkan tumbuhan boleh membesar tanpa tanah dalam larutan nutrien yang ditentukan."),
    ("Lawes 和 Gilbert：用酸把不溶的磷矿石变成可溶的过磷酸钙，开启化肥工业。", "Lawes and Gilbert: treated insoluble rock phosphate with acid to make soluble superphosphate, starting the fertiliser industry.", "Lawes dan Gilbert: merawat batuan fosfat tak larut dengan asid untuk menghasilkan superfosfat yang larut, memulakan industri baja."),
    src=["HH:62-63", "LEC"]),
  P("{{t:hydroponics}}至今仍是研究植物营养需求的主要方法。现代配方多出自 Hoagland，浓度比土壤溶液高很多倍（土壤可以由颗粒不断补充，营养液不行）。营养液要打气，否则会缺氧，根的呼吸受抑制，吸收养分所需的能量就不够；容器要涂黑或包起来，避免藻类长出来抢养分。植物不断吸收，会选择性地耗尽某些离子、改变 pH，所以营养液要定期更换。",
    "{{t:hydroponics}} is still the main way to study nutrient requirements. Most modern recipes descend from Hoagland and are many times more concentrated than soil solution (soil particles keep topping the soil up; a solution cannot). The solution must be aerated — otherwise it becomes anoxic, root respiration stalls and there is no energy for uptake — and the container blacked out or wrapped so algae do not grow and compete. As plants grow they deplete some ions selectively and shift the pH, so the solution must be replaced regularly.",
    "{{t:hydroponics}} masih merupakan cara utama mengkaji keperluan nutrien. Kebanyakan resipi moden berasal daripada Hoagland dan berkali ganda lebih pekat daripada larutan tanah (zarah tanah terus menambah larutan tanah; larutan tidak boleh). Larutan mesti diudarakan — jika tidak ia menjadi anoksik, respirasi akar terhenti dan tiada tenaga untuk pengambilan — dan bekas dihitamkan atau dibalut supaya alga tidak tumbuh dan bersaing. Apabila tumbuhan membesar, ia menyusutkan sesetengah ion secara memilih dan mengubah pH, jadi larutan mesti diganti dengan kerap.",
    defines=["hydroponics"], src=["HH:63-65", "LEC"]),
  N("tip", "做实验时“没有任何介质是真正不含养分的”：软玻璃会释出钠，硬玻璃会释出硼，塑料会带来氯或氟。Sachs 当年只找到九种必需元素，因为其他元素需要量极少，早已以杂质形式混在他的盐和水里。",
    "In experiments, no medium is truly free of nutrients: soft glass releases sodium, hard glass boron, plastics chloride or fluoride. Sachs found only nine essential elements because the others are needed in such tiny amounts that they were already present as impurities in his salts and water.",
    "Dalam eksperimen, tiada medium yang benar-benar bebas nutrien: kaca lembut membebaskan natrium, kaca keras boron, plastik klorida atau fluorida. Sachs hanya menemui sembilan unsur perlu kerana yang lain diperlukan dalam jumlah yang sangat kecil sehingga sudah wujud sebagai bendasing dalam garam dan airnya.",
    src=["HH:63-65", "LEC"]),
 ]},
 {"id": "s2", "heading": T("什么叫“必需元素”", "What makes an element essential", "Apa yang menjadikan unsur perlu"), "level": "basic", "blocks": [
  P("一个元素符合下面任何一条，就算{{t:essential-element}}：一、缺了它植物就无法完成正常生活史（例如结不出有活力的种子）；二、它是某种必需成分或代谢物的一部分，例如镁是叶绿素的组成。还有第三条：它必须直接参与植物代谢，而不只是改善培养介质里的微生物或化学条件——用营养液培养基本上已排除了这个疑虑。",
    "An element is an {{t:essential-element}} if it meets either of two criteria: without it the plant cannot complete a normal life cycle (for example, it cannot set viable seed); or it is part of an essential constituent or metabolite — magnesium in chlorophyll, for instance. A third criterion says it must act directly in the plant's metabolism, not merely correct an unfavourable microbial or chemical condition in the medium; solution culture largely takes care of that.",
    "Sesuatu unsur ialah {{t:essential-element}} jika ia memenuhi salah satu daripada dua kriteria: tanpanya tumbuhan tidak dapat melengkapkan kitaran hidup normal (contohnya tidak dapat menghasilkan biji benih yang hidup); atau ia sebahagian daripada juzuk atau metabolit yang perlu — magnesium dalam klorofil, misalnya. Kriteria ketiga menyatakan ia mesti bertindak secara langsung dalam metabolisme tumbuhan, bukan sekadar membetulkan keadaan mikrob atau kimia yang tidak sesuai dalam medium; kultur larutan sebahagian besarnya menyelesaikan hal itu.",
    defines=["essential-element"], src=["HH:65", "LEC"]),
  P("目前公认的必需元素有 17 个，按组织中的含量分成两类（分类只看需要量，不代表哪个比较重要）：{{t:macronutrient}}：C、H、O、N、P、K、S、Ca、Mg；{{t:micronutrient}}：Fe、B、Cu、Zn、Mn、Mo、Cl、Ni。需要量大的元素很容易用“缺某元素”的营养液验证；需要量极小的，要等到够纯的盐出现才证实。有些“病”后来发现其实是缺素：例如燕麦灰斑病是缺锰。",
    "Seventeen elements are recognised as essential. They are grouped by the amounts found in tissue — which says nothing about relative importance. {{t:macronutrient}}: C, H, O, N, P, K, S, Ca, Mg. {{t:micronutrient}}: Fe, B, Cu, Zn, Mn, Mo, Cl, Ni. Elements needed in large amounts are easy to test by leaving them out of the solution; those needed in traces could only be confirmed once salts of sufficient purity existed. Some ‘diseases’ turned out to be deficiencies: grey speck of oats is manganese deficiency.",
    "Tujuh belas unsur diiktiraf sebagai perlu. Ia dikumpulkan mengikut jumlah dalam tisu — yang tidak menunjukkan kepentingan relatif. {{t:macronutrient}}: C, H, O, N, P, K, S, Ca, Mg. {{t:micronutrient}}: Fe, B, Cu, Zn, Mn, Mo, Cl, Ni. Unsur yang diperlukan dalam jumlah besar mudah diuji dengan meninggalkannya daripada larutan; yang diperlukan dalam jumlah surih hanya dapat disahkan apabila garam yang cukup tulen wujud. Sesetengah ‘penyakit’ ternyata kekurangan nutrien: bintik kelabu oat ialah kekurangan mangan.",
    defines=["macronutrient", "micronutrient"], src=["HH:65-66", "LEC"]),
  P("有些元素只对部分植物有益，称为有益元素：钠是许多 C₄ 植物必需的（32 种植物的调查发现 C₄ 需要、C₃ 不需要；缺钠会生长减慢、黄化、坏死）；硅累积在细胞壁里，帮植物抵抗真菌、防止倒伏；钴是根瘤里固氮细菌需要的，所以只有靠固氮时豆科植物才显出需要钴。",
    "Some elements help only certain plants — beneficial elements. Sodium is required by many C₄ plants (a survey of 32 species found C₄ but not C₃ plants need it; without it they grow slowly, yellow and develop dead patches). Silicon builds up in cell walls, helping resist fungi and preventing lodging. Cobalt is needed by the nitrogen-fixing bacteria of nodules, so legumes show a cobalt need only when they rely on fixation.",
    "Sesetengah unsur hanya membantu tumbuhan tertentu — unsur bermanfaat. Natrium diperlukan oleh banyak tumbuhan C₄ (tinjauan 32 spesies mendapati C₄ tetapi bukan C₃ memerlukannya; tanpanya ia tumbuh perlahan, menguning dan mengalami bintik mati). Silikon terkumpul dalam dinding sel, membantu menahan kulat dan mencegah rebah. Kobalt diperlukan oleh bakteria pengikat nitrogen dalam nodul, jadi kekacang hanya menunjukkan keperluan kobalt apabila bergantung pada pengikatan.",
    src=["HH:66-67", "LEC"]),
 ]},
 {"id": "s3", "heading": T("够不够？临界浓度与缺素症状", "Enough or not? Critical concentration and symptoms", "Cukup atau tidak? Kepekatan kritikal dan simptom"), "level": "basic", "blocks": [
  P("一个元素供应不足时生长会下降。组织中刚好低于最大生长所需的浓度叫{{t:critical-concentration}}：低于它是缺乏，高于它再多也没好处（足够），太高则所有元素都会中毒。",
    "When an element runs short, growth falls. The tissue concentration just below the level that gives maximum growth is the {{t:critical-concentration}}: below it the plant is deficient; above it more does no good (adequate); and at high enough levels every nutrient becomes toxic.",
    "Apabila sesuatu unsur tidak mencukupi, pertumbuhan menurun. Kepekatan tisu tepat di bawah paras yang memberi pertumbuhan maksimum ialah {{t:critical-concentration}}: di bawahnya tumbuhan kekurangan; di atasnya tambahan tidak memberi manfaat (mencukupi); dan pada paras yang cukup tinggi setiap nutrien menjadi toksik.",
    defines=["critical-concentration"], src=["HH:67-68", "LEC"]),
  P("缺素症状常见的是{{t:chlorosis}}（叶绿素减少而发黄）和坏死（组织死亡）。出现在哪里，取决于元素在体内的移动性：移动性高的元素（N、P、K、Mg、Cl）会从老叶搬到新叶，所以症状先出现在老叶；移动性低的（Ca、S、Fe、B、Cu 等）搬不动，症状先出现在幼叶和顶端。",
    "Common symptoms are {{t:chlorosis}} (yellowing from lost chlorophyll) and necrosis (dead tissue). Where they appear depends on how mobile the element is in the plant. Mobile elements (N, P, K, Mg, Cl) are moved from old leaves to young ones, so symptoms show first in older leaves; immobile ones (Ca, S, Fe, B, Cu and others) cannot be moved, so symptoms show first in young leaves and growing tips.",
    "Simptom biasa ialah {{t:chlorosis}} (penguningan akibat kehilangan klorofil) dan nekrosis (tisu mati). Lokasinya bergantung pada mobiliti unsur dalam tumbuhan. Unsur mudah gerak (N, P, K, Mg, Cl) dipindahkan dari daun tua ke daun muda, jadi simptom muncul dahulu pada daun tua; unsur tidak mudah gerak (Ca, S, Fe, B, Cu dan lain-lain) tidak dapat dipindahkan, jadi simptom muncul dahulu pada daun muda dan hujung yang sedang tumbuh.",
    defines=["chlorosis"], src=["HH:68-69", "LEC"]),
  {"type": "widget", "id": "W4"},
 ]},
 {"id": "s4", "heading": T("每个元素做什么", "What each element does", "Apa yang dilakukan setiap unsur"), "level": "basic", "blocks": [
  {"type": "table", "src": ["HH:69-75", "LEC"],
   "caption": T("必需矿质元素一览", "The essential mineral elements at a glance", "Unsur mineral perlu secara ringkas"),
   "headers": [T("元素", "Element", "Unsur"), T("吸收形式", "Taken up as", "Diambil sebagai"), T("主要功能", "Main roles", "Peranan utama"), T("移动性", "Mobility", "Mobiliti"), T("典型症状", "Typical symptoms", "Simptom biasa")],
   "rows": [
    row("N", ("NO₃⁻、NH₄⁺", "NO₃⁻, NH₄⁺", "NO₃⁻, NH₄⁺"), ("蛋白质、核酸、叶绿素、部分激素", "proteins, nucleic acids, chlorophyll, some hormones", "protein, asid nukleik, klorofil, sesetengah hormon"), HI, ("老叶先黄化、生长慢、花青素累积；过多则地上部徒长", "older leaves yellow first, slow growth, anthocyanin; excess gives lush shoots", "daun tua menguning dahulu, tumbesaran perlahan, antosianin; berlebihan memberi pucuk subur")),
    row("P", ("H₂PO₄⁻ 等（磷酸，受 pH 影响）", "H₂PO₄⁻ etc. (phosphoric acid; pH-dependent)", "H₂PO₄⁻ dll. (asid fosforik; bergantung pH)"), ("磷酸糖、ATP、DNA/RNA、磷脂", "sugar phosphates, ATP, DNA/RNA, phospholipids", "gula fosfat, ATP, DNA/RNA, fosfolipid"), HI, ("深绿、生长受阻、坏死斑", "intense green, stunting, necrotic spots", "hijau pekat, terbantut, bintik nekrosis")),
    row("K", ("K⁺", "K⁺", "K⁺"), ("活化光合与呼吸酶、调节渗透势、气孔开闭", "activates photosynthesis and respiration enzymes; osmotic balance; stomata", "mengaktifkan enzim fotosintesis dan respirasi; keseimbangan osmotik; stoma"), HI, ("老叶斑驳黄化、叶缘坏死；砂土易缺", "mottled older leaves, scorched margins; common on sandy soils", "daun tua bertompok, tepi hangus; biasa di tanah berpasir")),
    row("S", ("SO₄²⁻", "SO₄²⁻", "SO₄²⁻"), ("含硫氨基酸、二硫键、辅酶 A、铁硫蛋白", "S amino acids, disulphide bonds, coenzyme A, iron–sulphur proteins", "asid amino S, ikatan disulfida, koenzim A, protein besi–sulfur"), LO, ("幼叶先黄化；不常见", "young leaves yellow first; uncommon", "daun muda menguning dahulu; jarang")),
    row("Ca", ("Ca²⁺", "Ca²⁺", "Ca²⁺"), ("中胶层的果胶钙、纺锤体、膜的完整、第二信使", "calcium pectate in the middle lamella, spindle, membranes, second messenger", "kalsium pektat dalam lamela tengah, gelendong, membran, utusan kedua"), LO, ("分生组织异常、根生长差、顶端坏死", "abnormal division, poor roots, dying tips", "pembahagian tidak normal, akar lemah, hujung mati")),
    row("Mg", ("Mg²⁺", "Mg²⁺", "Mg²⁺"), ("叶绿素中心原子、核糖体、把 ATP 接到酶上", "centre of chlorophyll, ribosomes, links ATP to enzymes", "pusat klorofil, ribosom, menghubungkan ATP kepada enzim"), HI, ("老叶叶脉间黄化；酸性与砂质土易缺", "interveinal chlorosis of older leaves; acid, sandy soils", "klorosis antara urat daun tua; tanah berasid dan berpasir")),
    row("Fe", ("Fe²⁺、Fe³⁺（螯合）", "Fe²⁺, Fe³⁺ (chelated)", "Fe²⁺, Fe³⁺ (berkelat)"), ("细胞色素、铁硫蛋白；合成叶绿素所需", "cytochromes, iron–sulphur proteins; needed to make chlorophyll", "sitokrom, protein besi–sulfur; diperlukan untuk membuat klorofil"), LO, ("幼叶叶脉间黄化", "interveinal chlorosis of young leaves", "klorosis antara urat daun muda")),
    row("B", ("H₃BO₃", "H₃BO₃", "H₃BO₃"), ("细胞壁；作用机理所知最少", "cell walls; the least understood", "dinding sel; paling kurang difahami"), LO, ("分生组织坏死、节间缩短呈丛生状", "dead meristems, short internodes, bushy habit", "meristem mati, ruas pendek, rupa merimbun")),
    row("Cu", ("Cu²⁺", "Cu²⁺", "Cu²⁺"), ("质体蓝素、细胞色素氧化酶、多酚氧化酶、Cu/Zn-SOD", "plastocyanin, cytochrome oxidase, polyphenol oxidase, Cu/Zn-SOD", "plastosianin, sitokrom oksidase, polifenol oksidase, Cu/Zn-SOD"), LO, ("幼叶扭曲变形", "young leaves distorted", "daun muda herot")),
    row("Zn", ("Zn²⁺", "Zn²⁺", "Zn²⁺"), ("乙醇脱氢酶、碳酸酐酶、SOD；与生长素量有关", "alcohol dehydrogenase, carbonic anhydrase, SOD; linked to auxin levels", "alkohol dehidrogenase, karbonik anhidrase, SOD; berkait dengan paras auksin"), LO, ("节间短、小叶（“小叶病”）", "short internodes, small leaves (‘little leaf’)", "ruas pendek, daun kecil (‘daun kecil’)")),
    row("Mn", ("Mn²⁺", "Mn²⁺", "Mn²⁺"), ("光系统 II 放氧复合体、呼吸中的脱氢与脱羧酶", "oxygen-evolving complex of photosystem II; dehydrogenases, decarboxylases", "kompleks pembebasan oksigen fotosistem II; dehidrogenase, dekarboksilase"), LO, ("燕麦灰斑病、叶脉间斑点", "grey speck of oats, interveinal spots", "bintik kelabu oat, bintik antara urat")),
    row("Mo", ("MoO₄²⁻", "MoO₄²⁻", "MoO₄²⁻"), ("硝酸还原酶、固氮酶", "nitrate reductase, nitrogenase", "nitrat reduktase, nitrogenase"), ("中", "moderate", "sederhana"), ("需要量最低；花椰菜“鞭尾”叶", "smallest requirement; ‘whiptail’ leaves", "keperluan paling kecil; daun ‘ekor cemeti’")),
    row("Cl", ("Cl⁻", "Cl⁻", "Cl⁻"), ("平衡阳离子电荷、光系统 II 放氧", "balances cation charge; oxygen evolution in PSII", "mengimbangi cas kation; pembebasan oksigen PSII"), HI, ("叶尖萎蔫；极少见", "wilting leaf tips; very rare", "hujung daun layu; sangat jarang")),
    row("Ni", ("Ni²⁺", "Ni²⁺", "Ni²⁺"), ("脲酶、氢化酶", "urease, hydrogenase", "urease, hidrogenase"), ("—", "—", "—"), ("叶尖累积尿素而坏死", "urea builds up and kills leaf tips", "urea terkumpul dan membunuh hujung daun")),
   ]},
  P("铁特别值得一提：所有微量元素中植物需要最多的就是铁，但在生物体常见的 pH 下，Fe³⁺ 容易形成不溶的水合氧化物，所以缺铁很普遍。农业上常用{{t:chelate}}供铁，例如 EDTA 铁：螯合剂和金属离子共用电子对，形成稳定又可溶的复合物，根仍然能把铁取出来。",
    "Iron deserves a closer look. Of all the micronutrients it is needed in the largest amounts, yet at biological pH Fe³⁺ readily forms insoluble hydrous oxides, so iron deficiency is common. Growers often supply it as a {{t:chelate}} such as Fe-EDTA: the chelating agent shares electron pairs with the metal ion to form a stable, soluble complex from which the root can still withdraw the iron.",
    "Besi wajar diberi perhatian. Antara semua mikronutrien, ia diperlukan dalam jumlah terbesar, namun pada pH biologi Fe³⁺ mudah membentuk oksida terhidrat yang tidak larut, jadi kekurangan besi biasa berlaku. Penanam sering membekalkannya sebagai {{t:chelate}} seperti Fe-EDTA: agen pengkelat berkongsi pasangan elektron dengan ion logam untuk membentuk kompleks stabil yang larut, daripada mana akar masih boleh mengambil besi.",
    defines=["chelate"], src=["HH:72-73", "LEC"]),
  L(("策略 I（大多数双子叶植物）：根表皮形成特化的传递细胞、向土壤分泌更多 H⁺ 降低 pH、释放咖啡酸等强配体，并在表皮细胞膜上诱导还原酶，把 Fe³⁺ 还原成 Fe²⁺ 再吸收。", "Strategy I (most dicots): transfer cells form in the root epidermis, more H⁺ is secreted to acidify the soil, strong ligands such as caffeic acid are released, and reductases are induced in the epidermal membrane to reduce Fe³⁺ to Fe²⁺ before uptake.", "Strategi I (kebanyakan dikotiledon): sel pemindahan terbentuk dalam epidermis akar, lebih banyak H⁺ dirembeskan untuk mengasidkan tanah, ligan kuat seperti asid kafeik dibebaskan, dan reduktase diaruh dalam membran epidermis untuk menurunkan Fe³⁺ kepada Fe²⁺ sebelum pengambilan."),
    ("策略 II（禾本科等）：根分泌对 Fe³⁺ 亲和力很高的“植物铁载体”，整个复合物被吸收，进入根后再把铁还原成 Fe²⁺ 释放出来。", "Strategy II (grasses): roots release phytosiderophores with a very high affinity for Fe³⁺; the whole complex is taken up and the iron is reduced to Fe²⁺ inside the root.", "Strategi II (rumput): akar membebaskan fitosiderofor yang berafiniti sangat tinggi terhadap Fe³⁺; seluruh kompleks diambil dan besi diturunkan kepada Fe²⁺ di dalam akar."),
    src=["HH:72-73", "LEC"]),
 ]},
 {"id": "s5", "heading": T("太多也不行：毒害", "Too much: toxicity", "Terlalu banyak: ketoksikan"), "level": "basic", "blocks": [
  P("微量元素最能说明“过量的危险”：大多数适宜范围很窄，在较低浓度就会中毒。临界毒害浓度定义为使干物质减少 10 % 的组织浓度。例如淹水土壤常出现锰中毒；葡萄园长期喷含铜农药会累积铜；酸性土壤或施用污泥时也可能出现金属毒害。",
    "Micronutrients show the dangers of excess best: most have a narrow adequate range and become toxic at fairly low concentrations. The critical toxicity level is the tissue concentration that reduces dry matter by 10 %. Manganese toxicity is common in waterlogged soils; copper builds up in vineyards from years of copper sprays; metal toxicity can also appear in acid soils or where sewage sludge is applied.",
    "Mikronutrien paling jelas menunjukkan bahaya berlebihan: kebanyakannya mempunyai julat mencukupi yang sempit dan menjadi toksik pada kepekatan yang agak rendah. Paras ketoksikan kritikal ialah kepekatan tisu yang mengurangkan bahan kering sebanyak 10 %. Ketoksikan mangan biasa berlaku di tanah bertakung air; kuprum terkumpul di ladang anggur akibat semburan kuprum bertahun-tahun; ketoksikan logam juga boleh muncul di tanah berasid atau tempat enap cemar kumbahan digunakan.",
    src=["HH:75-76", "LEC"]),
 ]},
]}

terms = [
 ("hydroponics", T("水培（营养液培养）", "solution culture (hydroponics)", "kultur larutan (hidroponik)"),
  T("不用土壤、把植物种在配好的营养液里；研究营养需求的基本方法。", "Growing plants without soil in a defined nutrient solution; the basic method for studying nutrient needs.", "Menanam tumbuhan tanpa tanah dalam larutan nutrien yang ditentukan; kaedah asas mengkaji keperluan nutrien.")),
 ("essential-element", T("必需元素", "essential element", "unsur perlu"),
  T("缺了它植物无法完成生活史，或它是必需成分的一部分；共 17 个。", "An element without which a plant cannot complete its life cycle, or which is part of an essential constituent; there are 17.", "Unsur yang tanpanya tumbuhan tidak dapat melengkapkan kitaran hidup, atau yang sebahagian daripada juzuk perlu; ada 17.")),
 ("macronutrient", T("大量元素", "macronutrient", "makronutrien"),
  T("组织中含量高的必需元素：C、H、O、N、P、K、S、Ca、Mg。", "Essential elements present in large amounts: C, H, O, N, P, K, S, Ca, Mg.", "Unsur perlu yang hadir dalam jumlah besar: C, H, O, N, P, K, S, Ca, Mg.")),
 ("micronutrient", T("微量元素", "micronutrient (trace element)", "mikronutrien (unsur surih)"),
  T("需要量很少的必需元素：Fe、B、Cu、Zn、Mn、Mo、Cl、Ni。", "Essential elements needed in small amounts: Fe, B, Cu, Zn, Mn, Mo, Cl, Ni.", "Unsur perlu yang diperlukan dalam jumlah kecil: Fe, B, Cu, Zn, Mn, Mo, Cl, Ni.")),
 ("critical-concentration", T("临界浓度", "critical concentration", "kepekatan kritikal"),
  T("组织中刚好低于最大生长所需的养分浓度；低于它即缺乏。", "The tissue nutrient level just below that giving maximum growth; below it the plant is deficient.", "Paras nutrien tisu tepat di bawah paras yang memberi pertumbuhan maksimum; di bawahnya tumbuhan kekurangan.")),
 ("chlorosis", T("黄化（失绿）", "chlorosis", "klorosis"),
  T("叶绿素减少导致叶片发黄；是许多缺素症的共同症状。", "Yellowing from loss of chlorophyll; a common sign of many deficiencies.", "Penguningan akibat kehilangan klorofil; tanda biasa banyak kekurangan nutrien.")),
 ("chelate", T("螯合物", "chelate", "kelat"),
  T("金属离子与有机配体共用电子对形成的稳定可溶复合物，例如 Fe-EDTA。", "A stable, soluble complex of a metal ion and an organic ligand sharing electron pairs, e.g. Fe-EDTA.", "Kompleks stabil yang larut antara ion logam dan ligan organik yang berkongsi pasangan elektron, cth. Fe-EDTA.")),
]

quiz = [
 {"stage": 1, "chapter": "ch04",
  "q": T("一株植物的老叶先发黄，幼叶正常。最可能缺什么？", "A plant's older leaves yellow first while young leaves look normal. Most likely deficiency?", "Daun tua tumbuhan menguning dahulu manakala daun muda kelihatan normal. Kekurangan yang paling mungkin?"),
  "options": [T("铁", "Iron", "Besi"), T("钙", "Calcium", "Kalsium"), T("氮", "Nitrogen", "Nitrogen"), T("硼", "Boron", "Boron")],
  "answer": 2, "why": T("氮移动性高，会从老叶搬去新叶，所以老叶先出现症状。", "Nitrogen is mobile and is moved from old leaves to new ones, so old leaves show it first.", "Nitrogen mudah gerak dan dipindahkan dari daun tua ke daun baharu, jadi daun tua menunjukkannya dahulu.")},
 {"stage": 1, "chapter": "ch04",
  "q": T("下面哪一个是微量元素？", "Which of these is a micronutrient?", "Antara berikut, yang manakah mikronutrien?"),
  "options": [T("镁", "Magnesium", "Magnesium"), T("硫", "Sulphur", "Sulfur"), T("钼", "Molybdenum", "Molibdenum"), T("钾", "Potassium", "Kalium")],
  "answer": 2, "why": T("钼的需要量是所有微量元素中最低的；Mg、S、K 是大量元素。", "Molybdenum has the smallest requirement of all; Mg, S and K are macronutrients.", "Molibdenum mempunyai keperluan paling kecil; Mg, S dan K ialah makronutrien.")},
 {"stage": 1, "chapter": "ch04",
  "q": T("为什么水培营养液一定要打气？", "Why must a nutrient solution be aerated?", "Mengapa larutan nutrien mesti diudarakan?"),
  "options": [T("让藻类生长", "To let algae grow", "Untuk membiarkan alga tumbuh"), T("避免缺氧抑制根的呼吸，吸收养分需要能量", "To avoid anoxia; roots need respiration to power nutrient uptake", "Untuk mengelakkan anoksia; akar memerlukan respirasi untuk menjana pengambilan nutrien"), T("提高 pH", "To raise the pH", "Untuk menaikkan pH"), T("补充氮气", "To supply nitrogen gas", "Untuk membekalkan gas nitrogen")],
  "answer": 1, "why": T("缺氧时根细胞无法有氧呼吸，主动吸收就缺乏能量。", "Without oxygen, root cells cannot respire aerobically and active uptake lacks energy.", "Tanpa oksigen, sel akar tidak dapat berespirasi secara aerobik dan pengambilan aktif kekurangan tenaga.")},
 {"stage": 1, "chapter": "ch04",
  "q": T("禾本科植物在缺铁时的“策略 II”是什么？", "What is the ‘Strategy II’ iron response of grasses?", "Apakah tindak balas besi ‘Strategi II’ rumput?"),
  "options": [T("分泌植物铁载体，吸收 Fe³⁺ 复合物", "Releasing phytosiderophores and taking up the Fe³⁺ complex", "Membebaskan fitosiderofor dan mengambil kompleks Fe³⁺"), T("关闭气孔", "Closing stomata", "Menutup stoma"), T("把铁储存在液泡", "Storing iron in the vacuole", "Menyimpan besi dalam vakuol"), T("合成更多叶绿素", "Making more chlorophyll", "Menghasilkan lebih banyak klorofil")],
  "answer": 0, "why": T("策略 I 是酸化与还原；策略 II 是分泌高亲和力的铁载体。", "Strategy I acidifies and reduces; Strategy II releases high-affinity siderophores.", "Strategi I mengasidkan dan menurunkan; Strategi II membebaskan siderofor berafiniti tinggi.")},
]

if __name__ == "__main__":
    write_chapter(chapter, terms, [], quiz)
