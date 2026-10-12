"""Chapter 20 — Cytokinins. Run: python3 tools/content/ch20.py"""
import sys
sys.path.insert(0, 'tools/content')
from build import T, P, L, N, write_chapter

chapter = {"id": "ch20", "num": 20, "stage": 4,
 "title": T("细胞分裂素", "Cytokinins", "Sitokinin"),
 "sources": ["HH", "LEC"],
 "sections": [
 {"id": "s1", "heading": T("发现：鲱鱼精子 DNA 的意外", "Discovery: an accident with herring sperm DNA", "Penemuan: kemalangan dengan DNA sperma hering"), "level": "basic", "blocks": [
  P("1950 年代，Skoog 在威斯康星大学研究烟草茎段的组织培养，发现除了生长素，细胞分裂还需要另一种因子；维管组织、椰子乳和酵母萃取物都有这种活性。他的博士后 Miller 想把它分离出来，发现核酸制剂（富含腺嘌呤）很有效——而且一瓶放了很久的鲱鱼精子 DNA 特别有效，新鲜的反而不行，把 DNA 高压灭菌也能产生活性。1956 年他们报告了这个由高压灭菌鲱鱼精子 DNA 得到的嘌呤衍生物，因为它促进细胞分裂（cytokinesis），命名为{{t:kinetin}}。激动素是 DNA 分解的产物，在植物中并不存在。",
    "In the 1950s Skoog, studying tissue cultures of tobacco stem at the University of Wisconsin, found that cells needed another factor besides auxin to divide; vascular tissue, coconut milk and yeast extract all supplied it. His postdoc Miller set out to isolate it and found nucleic acid preparations — rich in adenine — highly active; an old bottle of herring sperm DNA was especially potent while fresh DNA was not, and autoclaving DNA generated activity. In 1956 they reported a purine derivative from autoclaved herring sperm DNA and, because it promoted cytokinesis, named it {{t:kinetin}}. Kinetin is a breakdown product of DNA and is not found in plants.",
    "Pada 1950-an Skoog, yang mengkaji kultur tisu batang tembakau di Universiti Wisconsin, mendapati sel memerlukan faktor lain selain auksin untuk membahagi; tisu vaskular, susu kelapa dan ekstrak yis semuanya membekalkannya. Penyelidik pascadoktoralnya Miller cuba mengasingkannya dan mendapati sediaan asid nukleik — kaya adenina — sangat aktif; sebotol DNA sperma hering yang lama amat kuat manakala DNA segar tidak, dan mengautoklaf DNA menjana aktiviti. Pada 1956 mereka melaporkan terbitan purina daripada DNA sperma hering yang diautoklaf dan, kerana ia menggalakkan sitokinesis, menamakannya {{t:kinetin}}. Kinetin ialah hasil penguraian DNA dan tidak terdapat dalam tumbuhan.",
    defines=["kinetin"], src=["HH:339-341", "LEC"]),
  P("{{t:cytokinin}}是腺嘌呤（AMP）的衍生物，在 N⁶ 位接一条侧链。侧链与异戊二烯有关的叫类异戊二烯细胞分裂素，天然的有异戊烯基腺嘌呤（iP）、反式玉米素（tZ）和二氢玉米素（DZ）；侧链含芳香环的叫芳香族细胞分裂素，例如苄基腺嘌呤（BA）。",
    "A {{t:cytokinin}} is a derivative of adenine (AMP) with a side chain on N⁶. If the side chain is related to isoprene it is an isoprenoid cytokinin — natural ones are isopentenyladenine (iP), trans-zeatin (tZ) and dihydrozeatin (DZ); if it contains an aromatic ring it is an aromatic cytokinin, such as benzyladenine (BA).",
    "{{t:cytokinin}} ialah terbitan adenina (AMP) dengan rantai sisi pada N⁶. Jika rantai sisi berkaitan isoprena ia sitokinin isoprenoid — yang semula jadi ialah isopenteniladenina (iP), trans-zeatin (tZ) dan dihidrozeatin (DZ); jika ia mengandungi gelang aromatik ia sitokinin aromatik, seperti benziladenina (BA).",
    defines=["cytokinin"], src=["HH:339-341", "LEC"]),
 ]},
 {"id": "s2", "heading": T("合成、失活与运输", "Synthesis, inactivation and transport", "Sintesis, penyahaktifan dan pengangkutan"), "level": "basic", "blocks": [
  P("合成从 AMP 开始：{{t:ipt}}把 DMAPP 的异戊烯基接到 AMP 的 6 号位上，形成 iPRMP。这是限速步骤，所以生物技术常改动 IPT 来调节细胞分裂素含量。接着去掉磷酸和核糖得到活性的 iP；平行反应中侧链被羟基化，得到玉米素。细胞分裂素还可在游离碱基、核苷和核苷酸形式之间转换。",
    "Synthesis starts from AMP: {{t:ipt}} transfers the isopentenyl group of DMAPP to position 6 of AMP, forming iPRMP. This step is rate-limiting, which is why biotechnologists manipulate IPT to change cytokinin levels. Removing phosphate and ribose then gives active iP; in a parallel route the side chain is hydroxylated to give zeatin. Cytokinins can also be interconverted between free bases, ribosides and ribotides.",
    "Sintesis bermula daripada AMP: {{t:ipt}} memindahkan kumpulan isopentenil DMAPP ke kedudukan 6 AMP, membentuk iPRMP. Langkah ini mengehadkan kadar, sebab itu ahli bioteknologi memanipulasi IPT untuk mengubah paras sitokinin. Membuang fosfat dan ribosa kemudian memberi iP aktif; dalam laluan selari rantai sisi dihidroksilkan untuk memberi zeatin. Sitokinin juga boleh ditukar antara bes bebas, ribosida dan ribotida.",
    defines=["ipt"], src=["HH:341-342", "LEC"]),
  L(("结合：与葡萄糖形成 O-糖苷是无活性的贮存形式，可被葡萄糖苷酶水解恢复活性；与嘌呤环上的氮形成 N-糖苷，或与丙氨酸结合，则是永久失活。", "Conjugation: O-glucosides are inactive storage forms that a glucosidase can hydrolyse back to active cytokinin; N-glucosides on the purine ring, or alanine conjugates, inactivate it permanently.", "Konjugasi: O-glukosida ialah bentuk simpanan tidak aktif yang boleh dihidrolisis semula oleh glukosidase kepada sitokinin aktif; N-glukosida pada gelang purina, atau konjugat alanina, menyahaktifkannya secara kekal."),
    ("降解：{{t:ckx}}是控制活性的主要方式，只降解侧链有双键的细胞分裂素；过量表达 CKX 也是降低细胞分裂素的方法。", "Degradation by {{t:ckx}} is the main control; it attacks only cytokinins with a double bond in the side chain. Over-expressing CKX is another way to lower cytokinin.", "Penguraian oleh {{t:ckx}} ialah kawalan utama; ia hanya menyerang sitokinin dengan ikatan ganda dua dalam rantai sisi. Ekspresi berlebihan CKX ialah satu lagi cara merendahkan sitokinin."),
    ("合成部位与运输：主要在根尖合成，经木质部往上运；未成熟种子和发育中的果实浓度也很高（可能是就地合成，也可能是优先运去）。", "Sites and transport: made mainly in root tips and carried up in the xylem; immature seeds and developing fruits also have high levels (made there, or preferentially imported).", "Tapak dan pengangkutan: dibuat terutamanya di hujung akar dan dibawa naik dalam xilem; biji muda dan buah yang sedang berkembang juga mempunyai paras tinggi (dibuat di situ, atau diimport secara keutamaan)."),
    defines=["ckx"], src=["HH:341-343", "LEC"]),
 ]},
 {"id": "s3", "heading": T("细胞分裂与器官形成", "Cell division and organ formation", "Pembahagian sel dan pembentukan organ"), "level": "basic", "blocks": [
  P("细胞分裂素最早就是以“细胞分裂因子”被发现的，但它只有在生长素存在时才刺激分裂，作用在于调控细胞周期的进行。在组织培养中，生长素与细胞分裂素的比例决定愈伤组织长成什么：两者都要有，才能维持未分化的愈伤组织；生长素/细胞分裂素比高，只长根；比值低，只长芽；比例合适，愈伤组织可以再生成完整植株——这正是第 16 章“全能性”的应用。",
    "Cytokinin was first identified as the ‘cell-division factor’, but it stimulates division only in the presence of auxin; its specific role is to regulate progress through the cell cycle. In tissue culture the auxin:cytokinin ratio decides what a callus becomes: both are needed to keep cells as undifferentiated callus; a high auxin:cytokinin ratio gives only roots, a high cytokinin:auxin ratio only shoots, and the right balance regenerates a whole plant — totipotency (Chapter 16) put to work.",
    "Sitokinin mula-mula dikenal pasti sebagai ‘faktor pembahagian sel’, tetapi ia merangsang pembahagian hanya dengan kehadiran auksin; peranan khususnya ialah mengawal kemajuan kitaran sel. Dalam kultur tisu, nisbah auksin:sitokinin menentukan apa yang menjadi kalus: kedua-duanya diperlukan untuk mengekalkan sel sebagai kalus tidak terbeza; nisbah auksin:sitokinin tinggi memberi akar sahaja, nisbah sitokinin:auksin tinggi pucuk sahaja, dan imbangan yang betul menjana semula seluruh tumbuhan — totipotensi (Bab 16) yang diaplikasikan.",
    src=["HH:343-345", "LEC"]),
  {"type": "widget", "id": "W20"},
 ]},
 {"id": "s4", "heading": T("其他作用", "Other effects", "Kesan lain"), "level": "basic", "blocks": [
  L(("拮抗生长素的顶端优势：外施细胞分裂素可让腋芽生长；顶端优势取决于生长素/细胞分裂素比例。寄生物刺激细胞分裂素过量产生，腋芽大量萌发，形成“丛枝病”（witches' broom）。", "Opposing auxin in apical dominance: applied cytokinin lets axillary buds grow; apical dominance depends on the auxin:cytokinin ratio. Parasites that make the host over-produce cytokinin release masses of axillary buds — ‘witches' broom’.", "Menentang auksin dalam dominasi apeks: sitokinin yang diberikan membenarkan tunas ketiak tumbuh; dominasi apeks bergantung pada nisbah auksin:sitokinin. Parasit yang menyebabkan perumah menghasilkan sitokinin berlebihan membebaskan banyak tunas ketiak — ‘penyapu ahli sihir’."),
    ("冠瘿瘤：根癌农杆菌（Agrobacterium tumefaciens）的 Ti 质粒把一段 T-DNA 插入植物基因组；T-DNA 上有合成生长素和细胞分裂素的基因（使细胞不受控地增生），以及合成冠瘿碱（细菌的养分）的基因。这种天然的“基因改造”能力后来被改造成把其他基因转进植物的工具。", "Crown gall: the Ti plasmid of Agrobacterium tumefaciens inserts a piece of T-DNA into the plant genome; it carries genes for auxin and cytokinin synthesis (so cells proliferate uncontrollably) and a gene for opines (food for the bacterium). This natural genetic engineering has been adapted into a tool for putting other genes into plants.", "Gal mahkota: plasmid Ti Agrobacterium tumefaciens memasukkan sekeping T-DNA ke dalam genom tumbuhan; ia membawa gen untuk sintesis auksin dan sitokinin (jadi sel membiak tanpa kawalan) dan gen untuk opina (makanan bakteria). Kejuruteraan genetik semula jadi ini telah diubah suai menjadi alat untuk memasukkan gen lain ke dalam tumbuhan."),
    ("延缓叶片衰老：外施细胞分裂素能延缓衰老；内源细胞分裂素下降与衰老开始呈线性关系。把农杆菌的细胞分裂素合成基因接在热激启动子后，加热就能提高玉米素、延缓衰老。", "Delaying leaf senescence: applied cytokinin delays it, and the fall in endogenous cytokinin tracks the onset of senescence linearly. Put the Agrobacterium cytokinin-synthesis gene behind a heat-shock promoter and a heat treatment raises zeatin and delays senescence.", "Melambatkan penuaan daun: sitokinin yang diberikan melambatkannya, dan penurunan sitokinin endogen menjejak permulaan penuaan secara linear. Letakkan gen sintesis sitokinin Agrobacterium di belakang promoter kejutan haba dan rawatan haba meningkatkan zeatin dan melambatkan penuaan."),
    ("养分分配：在叶上某处点涂细胞分裂素，养分就往那里移动——细胞分裂素刺激代谢，使那里的细胞变成库。", "Nutrient distribution: dab cytokinin on part of a leaf and nutrients move there — cytokinin stimulates metabolism and turns those cells into a sink.", "Taburan nutrien: sapu sitokinin pada sebahagian daun dan nutrien bergerak ke situ — sitokinin merangsang metabolisme dan menjadikan sel itu sinki."),
    src=["HH:345-348", "LEC"]),
 ]},
 {"id": "s5", "heading": T("维持茎顶端分生组织", "Keeping the shoot meristem going", "Mengekalkan meristem pucuk"), "level": "basic", "blocks": [
  P("降低体内细胞分裂素会使茎发育迟缓、植株矮小晚花、茎顶端分生组织变小、叶原基形成变慢、叶细胞变少。LONELY GUY（LOG）基因编码一种磷酸核糖水解酶，把无活性的细胞分裂素核苷酸直接转成活性的游离碱基，调节分生组织活性；LOG 突变体的分生组织很小。",
    "Lowering cytokinin in the plant retards shoot development and gives dwarf, late-flowering plants with smaller shoot meristems, slower leaf-primordium formation and fewer leaf cells. The LONELY GUY (LOG) gene encodes a phosphoribohydrolase that converts inactive cytokinin nucleotides straight into active free bases, regulating meristem activity; log mutants have tiny meristems.",
    "Merendahkan sitokinin dalam tumbuhan melambatkan perkembangan pucuk dan memberi tumbuhan kerdil yang lambat berbunga dengan meristem pucuk lebih kecil, pembentukan primordium daun lebih perlahan dan kurang sel daun. Gen LONELY GUY (LOG) mengekod fosforibohidrolase yang menukar nukleotida sitokinin tidak aktif terus kepada bes bebas aktif, mengawal aktiviti meristem; mutan log mempunyai meristem yang sangat kecil.",
    src=["HH:348-349", "LEC"]),
  P("细胞分化由含同源框序列的基因控制；植物的同源框蛋白是 {{t:knox}}。KNOX 基因通常只在茎顶端分生组织表达，不在叶原基和叶片表达。功能获得型突变让 KNOX 在叶片中表达，叶上就长出细胞团或异位芽；功能缺失的 SHOOTMERISTEMLESS（STM）突变则在胚胎发生时根本长不出顶端分生组织。KNOX 是转录因子：上调 IPT（细胞分裂素合成）、抑制 GA20-氧化酶（赤霉素合成），维持分生组织所需的“高细胞分裂素、低赤霉素”。",
    "Cell differentiation is controlled by genes with homeobox sequences; in plants the homeobox proteins are {{t:knox}} proteins. KNOX genes are normally expressed in the shoot apical meristem but not in leaf primordia or leaves. A gain-of-function mutation that expresses KNOX in leaves produces knots of cells or ectopic shoots on them; the loss-of-function SHOOTMERISTEMLESS (STM) mutant fails to form an apical meristem at all during embryogenesis. KNOX proteins are transcription factors that up-regulate IPT (cytokinin synthesis) and suppress GA20-oxidase (gibberellin synthesis), maintaining the high-cytokinin, low-gibberellin state a meristem needs.",
    "Pembezaan sel dikawal oleh gen dengan jujukan homeobox; dalam tumbuhan protein homeobox ialah protein {{t:knox}}. Gen KNOX biasanya diekspresikan dalam meristem apeks pucuk tetapi tidak dalam primordium daun atau daun. Mutasi peningkatan fungsi yang mengekspresikan KNOX dalam daun menghasilkan simpulan sel atau pucuk ektopik padanya; mutan kehilangan fungsi SHOOTMERISTEMLESS (STM) gagal membentuk meristem apeks langsung semasa embriogenesis. Protein KNOX ialah faktor transkripsi yang meningkatkan IPT (sintesis sitokinin) dan menindas GA20-oksidase (sintesis giberelin), mengekalkan keadaan sitokinin tinggi, giberelin rendah yang diperlukan meristem.",
    defines=["knox"], src=["HH:349-350", "LEC"]),
 ]},
 {"id": "s6", "heading": T("受体：双组分系统", "The receptor: a two-component system", "Reseptor: sistem dua komponen"), "level": "basic", "blocks": [
  P("细胞分裂素受体是用下胚轴试验找到的：外植体加细胞分裂素通常会增生并长芽，但 cre1（cytokinin response 1）突变体完全没有反应，因为缺少受体。另一个突变 WOODEN LEG（wol）影响同一个基因 AHK4，使根生长迟缓。",
    "The cytokinin receptor was found with the hypocotyl test: explants given cytokinin normally proliferate and form shoots, but the cre1 (cytokinin response 1) mutant does not respond at all, because it lacks the receptor. Another mutant, wooden leg (wol), hits the same gene — AHK4 — and stunts root growth.",
    "Reseptor sitokinin ditemui dengan ujian hipokotil: eksplan yang diberi sitokinin biasanya membiak dan membentuk pucuk, tetapi mutan cre1 (cytokinin response 1) tidak bertindak balas langsung, kerana ia tiada reseptor. Mutan lain, wooden leg (wol), mengenai gen yang sama — AHK4 — dan membantutkan pertumbuhan akar.",
    src=["HH:350", "LEC"]),
  P("受体是{{t:two-component-system}}（第 1 章）：CRE1/AHK4 是有三个结构域的组氨酸激酶，感应结构域有两个跨膜区，激酶结构域在细胞质一侧。植物有许多组氨酸激酶，但只有 CRE1、AHK2 和 AHK3 三个是细胞分裂素受体（其他的是乙烯受体或渗透压感受器）。细胞分裂素结合后，受体二聚体的组氨酸被磷酸化，磷酸基团转到受体自己的天冬氨酸接收结构域，再交给组氨酸磷酸转移蛋白（AHP）；AHP 进入细胞核，把磷酸交给 B 型反应调节蛋白（ARR，转录因子），启动基因表达——包括起负反馈作用的 A 型 ARR。",
    "The receptor is a {{t:two-component-system}} (Chapter 1). CRE1/AHK4 is a histidine kinase with three domains: a sensor domain with two membrane-spanning regions and a kinase domain on the cytosolic side. Plants have many histidine kinases, but only three — CRE1, AHK2 and AHK3 — are cytokinin receptors (others are ethylene receptors or osmosensors). Cytokinin binding phosphorylates a histidine in each protein of the receptor dimer; the phosphate passes to the receptor's own aspartate receiver domain, then to histidine phosphotransfer proteins (AHPs), which enter the nucleus and hand it to type-B response regulators (ARRs) — transcription factors that switch on genes, including the negative-feedback type-A ARRs.",
    "Reseptor ialah {{t:two-component-system}} (Bab 1). CRE1/AHK4 ialah histidina kinase dengan tiga domain: domain penderia dengan dua kawasan merentas membran dan domain kinase di sebelah sitosol. Tumbuhan mempunyai banyak histidina kinase, tetapi hanya tiga — CRE1, AHK2 dan AHK3 — reseptor sitokinin (yang lain reseptor etilena atau penderia osmotik). Pengikatan sitokinin memfosforilkan histidina dalam setiap protein dimer reseptor; fosfat berpindah ke domain penerima aspartat reseptor itu sendiri, kemudian ke protein pemindahan fosfo histidina (AHP), yang masuk ke nukleus dan menyerahkannya kepada pengawal atur tindak balas jenis B (ARR) — faktor transkripsi yang menghidupkan gen, termasuk ARR jenis A suap balik negatif.",
    src=["HH:350-352", "LEC"]),
  {"type": "widget", "id": "W19", "opts": {"hormone": "ck"}},
 ]},
]}

terms = [
 ("kinetin", T("激动素", "kinetin", "kinetin"),
  T("从高压灭菌的鲱鱼精子 DNA 得到的第一个细胞分裂素；植物中不存在。", "The first cytokinin, obtained from autoclaved herring sperm DNA; not found in plants.", "Sitokinin pertama, diperoleh daripada DNA sperma hering yang diautoklaf; tidak terdapat dalam tumbuhan.")),
 ("cytokinin", T("细胞分裂素", "cytokinin", "sitokinin"),
  T("N⁶ 取代的腺嘌呤衍生物，与生长素一起促进细胞分裂、延缓衰老；例如玉米素。", "N⁶-substituted adenine derivatives that promote cell division with auxin and delay senescence, e.g. zeatin.", "Terbitan adenina tertukar ganti N⁶ yang menggalakkan pembahagian sel bersama auksin dan melambatkan penuaan, cth. zeatin.")),
 ("ipt", T("异戊烯基转移酶", "isopentenyl transferase", "isopentenil transferase"),
  T("把异戊烯基接到 AMP 上的酶，是细胞分裂素合成的限速步骤。", "The enzyme adding an isopentenyl group to AMP; the rate-limiting step of cytokinin synthesis.", "Enzim yang menambah kumpulan isopentenil kepada AMP; langkah pengehad kadar sintesis sitokinin."), "IPT"),
 ("ckx", T("细胞分裂素氧化酶/脱氢酶", "cytokinin oxidase/dehydrogenase", "sitokinin oksidase/dehidrogenase"),
  T("降解侧链有双键的细胞分裂素，是控制其活性的主要方式。", "Degrades cytokinins with a side-chain double bond; the main control on their activity.", "Menguraikan sitokinin dengan ikatan ganda dua rantai sisi; kawalan utama aktivitinya."), "CKX"),
 ("knox", T("KNOX 同源框蛋白", "KNOX homeobox proteins", "protein homeobox KNOX"),
  T("维持茎顶端分生组织的转录因子：上调细胞分裂素合成、抑制赤霉素合成。", "Transcription factors maintaining the shoot meristem by raising cytokinin and lowering gibberellin synthesis.", "Faktor transkripsi yang mengekalkan meristem pucuk dengan meningkatkan sintesis sitokinin dan menurunkan sintesis giberelin."), "KNOX"),
]

quiz = [
 {"stage": 4, "chapter": "ch20",
  "q": T("组织培养中，生长素/细胞分裂素比值很高时，愈伤组织会长出什么？", "In tissue culture, a high auxin:cytokinin ratio makes callus form…", "Dalam kultur tisu, nisbah auksin:sitokinin yang tinggi menjadikan kalus membentuk…"),
  "options": [T("芽", "Shoots", "Pucuk"), T("根", "Roots", "Akar"), T("花", "Flowers", "Bunga"), T("完整植株", "Whole plants", "Tumbuhan lengkap")],
  "answer": 1, "why": T("高生长素长根，高细胞分裂素长芽，比例合适才再生整株。", "High auxin gives roots, high cytokinin shoots; the right balance regenerates a plant.", "Auksin tinggi memberi akar, sitokinin tinggi pucuk; imbangan yang betul menjana semula tumbuhan.")},
 {"stage": 4, "chapter": "ch20",
  "q": T("细胞分裂素合成的限速酶是？", "The rate-limiting enzyme of cytokinin synthesis is…", "Enzim pengehad kadar sintesis sitokinin ialah…"),
  "options": [T("CKX", "CKX", "CKX"), T("IPT", "IPT", "IPT"), T("LOG", "LOG", "LOG"), T("AHK4", "AHK4", "AHK4")],
  "answer": 1, "why": T("IPT 把 DMAPP 的异戊烯基接到 AMP 上；CKX 是降解酶。", "IPT adds DMAPP's isopentenyl group to AMP; CKX is the degrading enzyme.", "IPT menambah kumpulan isopentenil DMAPP kepada AMP; CKX ialah enzim pengurai.")},
 {"stage": 4, "chapter": "ch20",
  "q": T("细胞分裂素信号中，把磷酸从受体带进细胞核的是？", "In cytokinin signalling, what carries the phosphate from the receptor into the nucleus?", "Dalam pengisyaratan sitokinin, apakah yang membawa fosfat dari reseptor ke nukleus?"),
  "options": [T("A 型 ARR", "Type-A ARR", "ARR jenis A"), T("AHP（组氨酸磷酸转移蛋白）", "AHP (histidine phosphotransfer protein)", "AHP (protein pemindahan fosfo histidina)"), T("DELLA", "DELLA", "DELLA"), T("TIR1", "TIR1", "TIR1")],
  "answer": 1, "why": T("His → Asp（受体）→ AHP → B 型 ARR（转录因子）。", "His → Asp (receptor) → AHP → type-B ARR (transcription factor).", "His → Asp (reseptor) → AHP → ARR jenis B (faktor transkripsi).")},
 {"stage": 4, "chapter": "ch20",
  "q": T("冠瘿瘤的 T-DNA 带有哪些基因？", "What genes does crown-gall T-DNA carry?", "Gen apakah yang dibawa T-DNA gal mahkota?"),
  "options": [T("固氮基因", "Nitrogen-fixation genes", "Gen pengikatan nitrogen"), T("生长素与细胞分裂素合成基因，以及冠瘿碱合成基因", "Auxin and cytokinin synthesis genes, plus an opine-synthesis gene", "Gen sintesis auksin dan sitokinin, serta gen sintesis opina"), T("抗病 R 基因", "R resistance genes", "Gen rintangan R"), T("叶绿素合成基因", "Chlorophyll-synthesis genes", "Gen sintesis klorofil")],
  "answer": 1, "why": T("激素基因让细胞增生成瘤，冠瘿碱是细菌的养分。", "The hormone genes make the cells proliferate into a tumour; opines feed the bacterium.", "Gen hormon menjadikan sel membiak menjadi tumor; opina memberi makan bakteria.")},
]

if __name__ == "__main__":
    write_chapter(chapter, terms, [], quiz)
