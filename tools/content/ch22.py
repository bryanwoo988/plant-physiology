"""Chapter 22 — Ethylene. Run: python3 tools/content/ch22.py"""
import sys
sys.path.insert(0, 'tools/content')
from build import T, P, L, N, write_chapter

chapter = {"id": "ch22", "num": 22, "stage": 4,
 "title": T("乙烯", "Ethylene", "Etilena"),
 "sources": ["HH", "LEC"],
 "sections": [
 {"id": "s1", "heading": T("一种气体激素", "A hormone that is a gas", "Hormon yang berupa gas"), "level": "basic", "blocks": [
  P("{{t:ethylene}}（C₂H₄）是最简单的烯烃，是一种挥发性气体。它在所有植物组织中都有，浓度各不相同；能影响根和茎的生长，但主要与逆境、衰老和果实成熟相关。1886 年俄国研究生 Neljubov 发现，黑暗中豌豆幼苗的异常生长来自照明用煤气里的乙烯。1910 年 Cousins 在牙买加农业部的报告中指出，成熟的柑橘会放出挥发物，加速放在一起的香蕉成熟。直到 1960 年代有了气相层析，才能测出植物组织里的微量乙烯。",
    "{{t:ethylene}} (C₂H₄), the simplest alkene, is a volatile gas. It occurs in all plant tissues at varying levels; it can affect root and shoot growth but is associated above all with stress, senescence and fruit ripening. In 1886 the Russian graduate student Neljubov traced the abnormal growth of dark-grown pea seedlings to ethylene in illuminating gas. In 1910 Cousins, in a Jamaican Department of Agriculture report, noted that ripe oranges released a volatile that hastened the ripening of bananas stored with them. Only with gas chromatography in the 1960s could the tiny amounts in plant tissue be measured.",
    "{{t:ethylene}} (C₂H₄), alkena paling ringkas, ialah gas meruap. Ia terdapat dalam semua tisu tumbuhan pada paras berbeza; ia boleh mempengaruhi pertumbuhan akar dan pucuk tetapi terutamanya berkait dengan tekanan, penuaan dan pemasakan buah. Pada 1886 pelajar siswazah Rusia Neljubov mengesan pertumbuhan tidak normal anak benih kacang pis dalam gelap kepada etilena dalam gas penerangan. Pada 1910 Cousins, dalam laporan Jabatan Pertanian Jamaica, mencatatkan bahawa oren masak membebaskan bahan meruap yang mempercepat pemasakan pisang yang disimpan bersamanya. Hanya dengan kromatografi gas pada 1960-an jumlah yang sangat kecil dalam tisu tumbuhan dapat diukur.",
    defines=["ethylene"], src=["HH:362-364", "LEC"]),
 ]},
 {"id": "s2", "heading": T("合成：三个关键酶", "Synthesis: three key enzymes", "Sintesis: tiga enzim utama"), "level": "basic", "blocks": [
  P("1977–1979 年，Adams 和 Yang 证明苹果组织把甲硫氨酸转成乙烯，中间产物是 ACC（1-氨基环丙烷-1-羧酸，一种非蛋白氨基酸）。乙烯合成只有三步，每一步一个关键酶（常考，最好画出来）：",
    "In 1977–79 Adams and Yang showed that apple tissue converts methionine to ethylene via ACC (1-aminocyclopropane-1-carboxylic acid, a non-protein amino acid). The pathway has just three steps, each with a key enzyme (a favourite exam question — draw it):",
    "Pada 1977–79 Adams dan Yang menunjukkan bahawa tisu epal menukar metionina kepada etilena melalui ACC (asid 1-aminosiklopropana-1-karboksilik, asid amino bukan protein). Laluan ini hanya tiga langkah, setiap satu dengan enzim utama (soalan peperiksaan kegemaran — lukiskannya):",
    src=["HH:363-365", "LEC"]),
  L(("甲硫氨酸 → S-腺苷甲硫氨酸（SAM）：SAM 合成酶，用一个 ATP。", "Methionine → S-adenosylmethionine (SAM): SAM synthetase, using one ATP.", "Metionina → S-adenosilmetionina (SAM): SAM sintetase, menggunakan satu ATP."),
    ("SAM → ACC：{{t:acc-synthase}}（ACS）。这是限速步骤，受生长素、伤害、水分胁迫、温度和乙烯本身（自催化）调节——都发生在 ACS 基因的转录层次；RNA 和蛋白质合成抑制剂会阻断诱导。", "SAM → ACC: {{t:acc-synthase}} (ACS). This is the rate-limiting step, regulated by auxin, wounding, water stress, temperature and ethylene itself (autocatalysis) — all at the level of ACS transcription; inhibitors of RNA and protein synthesis block the induction.", "SAM → ACC: {{t:acc-synthase}} (ACS). Ini langkah pengehad kadar, dikawal oleh auksin, luka, tekanan air, suhu dan etilena itu sendiri (autokatalisis) — semuanya pada peringkat transkripsi ACS; perencat sintesis RNA dan protein menyekat aruhan."),
    ("ACC → 乙烯：ACC 氧化酶（ACO），需要 O₂。", "ACC → ethylene: ACC oxidase (ACO), which needs O₂.", "ACC → etilena: ACC oksidase (ACO), yang memerlukan O₂."),
    ordered=True, defines=["acc-synthase"], src=["HH:364-365", "LEC"]),
  {"type": "widget", "id": "W21"},
  P("ACS 反应会放出一个含硫的副产物（5′-甲硫腺苷）。要持续合成乙烯，硫必须回收成甲硫氨酸，这条回收路线叫{{t:yang-cycle}}，以 S. F. Yang 命名。",
    "The ACS reaction releases a sulphur-containing by-product (5′-methylthioadenosine). To keep making ethylene, the sulphur must be recycled back to methionine, by the route named after S. F. Yang — the {{t:yang-cycle}}.",
    "Tindak balas ACS membebaskan hasil sampingan yang mengandungi sulfur (5′-metiltioadenosina). Untuk terus membuat etilena, sulfur mesti dikitar semula kepada metionina, melalui laluan yang dinamakan sempena S. F. Yang — {{t:yang-cycle}}.",
    defines=["yang-cycle"], src=["HH:364-365", "LEC"]),
  P("乙烯的活性可经氧化成 CO₂、转成环氧乙烷或乙二醇而消失。农业上用{{t:ethephon}}（2-氯乙基膦酸）：它在植物组织中分解放出乙烯，比直接施用气体方便得多。",
    "Ethylene's activity is removed by oxidation to CO₂ or conversion to ethylene oxide or ethylene glycol. In agriculture, {{t:ethephon}} (2-chloroethylphosphonic acid) is used: it breaks down in plant tissue to release ethylene, far easier than applying the gas.",
    "Aktiviti etilena dihapuskan melalui pengoksidaan kepada CO₂ atau penukaran kepada etilena oksida atau etilena glikol. Dalam pertanian, {{t:ethephon}} (asid 2-kloroetilfosfonik) digunakan: ia terurai dalam tisu tumbuhan untuk membebaskan etilena, jauh lebih mudah daripada menggunakan gas.",
    defines=["ethephon"], src=["HH:365-366", "LEC"]),
 ]},
 {"id": "s3", "heading": T("三重反应", "The triple response", "Tindak balas tiga serangkai"), "level": "basic", "blocks": [
  P("在黑暗中长出的双子叶幼苗遇到乙烯，会出现著名的{{t:triple-response}}：下胚轴（和根）伸长受抑制；下胚轴横向膨大；顶端弯钩弯得更厉害。这个反应很容易筛选，所以各种三重反应突变体成了解开乙烯信号途径的关键：对乙烯不敏感的突变体（例如 etr1）在乙烯中仍长得又直又长；“组成型三重反应”突变体（ctr1）即使没有乙烯也表现三重反应。",
    "Dark-grown dicot seedlings exposed to ethylene show the famous {{t:triple-response}}: inhibited elongation of the hypocotyl (and root), radial swelling of the hypocotyl, and an exaggerated plumular hook. The response is easy to screen, so triple-response mutants became the key to the ethylene signalling pathway: ethylene-insensitive mutants (such as etr1) grow long and straight in ethylene, while the constitutive triple response mutant (ctr1) shows the triple response even without ethylene.",
    "Anak benih dikotiledon yang tumbuh dalam gelap dan terdedah kepada etilena menunjukkan {{t:triple-response}} yang terkenal: pemanjangan hipokotil (dan akar) direncat, hipokotil membengkak secara jejarian, dan cangkuk plumul yang berlebihan. Tindak balas ini mudah disaring, jadi mutan tindak balas tiga serangkai menjadi kunci kepada laluan isyarat etilena: mutan tidak sensitif etilena (seperti etr1) tumbuh panjang dan lurus dalam etilena, manakala mutan tindak balas tiga serangkai konstitutif (ctr1) menunjukkan tindak balas itu walaupun tanpa etilena.",
    defines=["triple-response"], src=["HH:366-367", "LEC"]),
  N("tip", "问答题“分别定义并说明光形态建成和三重反应”：三重反应是乙烯对黑暗中幼苗的效应（短、粗、钩弯）；光形态建成是光对发育的调控（第 24 章）。两者常一起考。",
    "For ‘define and describe photomorphogenesis and the triple response’: the triple response is ethylene's effect on dark-grown seedlings (short, thick, tight hook); photomorphogenesis is light's control of development (Chapter 24). They are often asked together.",
    "Untuk ‘takrif dan terangkan fotomorfogenesis dan tindak balas tiga serangkai’: tindak balas tiga serangkai ialah kesan etilena pada anak benih dalam gelap (pendek, tebal, cangkuk ketat); fotomorfogenesis ialah kawalan cahaya ke atas perkembangan (Bab 24). Kedua-duanya sering ditanya bersama.",
    src=["HH:366-367", "LEC"]),
 ]},
 {"id": "s4", "heading": T("受体：没有乙烯时反而在工作", "The receptor: busy when ethylene is absent", "Reseptor: sibuk apabila etilena tiada"), "level": "basic", "blocks": [
  P("乙烯由一个五成员的膜结合双组分组氨酸激酶受体家族感知，代表是 {{t:etr1}}。和多数双组分受体不同，ETR1 位于内质网膜上。感应结构域有三个跨膜区，以二聚体运作，含有结合乙烯所必需的铜辅因子。乙烯系统的特别之处在于受体是“组成型活化”的：没有乙烯时，受体与下游的 CTR1（一种蛋白激酶）一起积极地压住反应；乙烯结合后，受体失活，等于把这条抑制关掉，乙烯反应基因才表达。",
    "Ethylene is perceived by a family of five membrane-bound, two-component histidine kinase receptors, typified by {{t:etr1}}. Unlike most two-component receptors, ETR1 sits in the endoplasmic reticulum membrane. Its sensor domain has three membrane-spanning regions, works as a dimer and holds a copper cofactor needed to bind ethylene. The peculiarity of the system is that the receptors are constitutively active: without ethylene, the receptor and the downstream kinase CTR1 actively hold the response down; ethylene binding switches the receptor off, lifting this repression so ethylene-response genes are expressed.",
    "Etilena dikesan oleh keluarga lima reseptor histidina kinase dua komponen yang terikat membran, diwakili oleh {{t:etr1}}. Tidak seperti kebanyakan reseptor dua komponen, ETR1 terletak dalam membran retikulum endoplasma. Domain penderianya mempunyai tiga kawasan merentas membran, berfungsi sebagai dimer dan mengandungi kofaktor kuprum yang diperlukan untuk mengikat etilena. Keistimewaan sistem ini ialah reseptor aktif secara konstitutif: tanpa etilena, reseptor dan kinase hiliran CTR1 secara aktif menahan tindak balas; pengikatan etilena mematikan reseptor, mengangkat penindasan ini supaya gen tindak balas etilena diekspresikan.",
    defines=["etr1"], src=["HH:367-368", "LEC"]),
  {"type": "widget", "id": "W19", "opts": {"hormone": "eth"}},
  P("所以突变的逻辑和其他激素相反：受体坏掉（etr1）反而对乙烯不敏感，因为突变的受体无法被乙烯关闭；CTR1 坏掉（ctr1）则一直表现乙烯反应。番茄的 never ripe 突变体的乙烯受体有缺陷，果实长到全大，却永远不会变红、变软、产生风味。（在 CTR1 下游，EIN2 与 EIN3 类转录因子把信号传进细胞核——这是后来补上的部分。）",
    "Mutant logic is therefore reversed: a broken receptor (etr1) makes the plant ethylene-insensitive, because ethylene can no longer switch the mutant receptor off; a broken CTR1 (ctr1) gives a permanent ethylene response. The tomato never ripe mutant has a defective ethylene receptor: its fruit reaches full size but never reddens, softens or develops flavour. (Downstream of CTR1, EIN2 and the EIN3-type transcription factors carry the signal into the nucleus — a later addition to the model.)",
    "Logik mutan oleh itu terbalik: reseptor yang rosak (etr1) menjadikan tumbuhan tidak sensitif etilena, kerana etilena tidak lagi dapat mematikan reseptor mutan; CTR1 yang rosak (ctr1) memberi tindak balas etilena kekal. Mutan tomato never ripe mempunyai reseptor etilena yang cacat: buahnya mencapai saiz penuh tetapi tidak pernah merah, lembut atau berperisa. (Di hiliran CTR1, EIN2 dan faktor transkripsi jenis EIN3 membawa isyarat ke nukleus — tambahan kemudian kepada model.)",
    src=["HH:366-368", "LEC"]),
 ]},
 {"id": "s5", "heading": T("成熟、衰老与其他作用", "Ripening, senescence and more", "Pemasakan, penuaan dan lain-lain"), "level": "basic", "blocks": [
  P("乙烯最出名的是促进果实成熟和衰老。{{t:climacteric}}果实（番茄、苹果、香蕉等）发育到某个阶段，呼吸会突然大增（跃变上升），伴随乙烯大量产生，接着一组“成熟基因”表达，发展出颜色、风味和质地。因为乙烯合成是自催化的，这类果实可以青着采收，运到目的地再用乙烯催熟。非跃变果实则没有这种爆发。",
    "Ethylene is best known for promoting fruit ripening and senescence. {{t:climacteric}} fruits (tomato, apple, banana) reach a developmental point where respiration suddenly surges — the climacteric rise — accompanied by a burst of ethylene, after which a set of ripening genes develops colour, flavour and texture. Because ethylene synthesis is autocatalytic, such fruits can be picked green and ripened artificially with ethylene at their destination. Non-climacteric fruits show no such burst.",
    "Etilena paling terkenal kerana menggalakkan pemasakan dan penuaan buah. Buah {{t:climacteric}} (tomato, epal, pisang) mencapai titik perkembangan di mana respirasi melonjak secara tiba-tiba — kenaikan klimakterik — disertai letusan etilena, selepas itu satu set gen pemasakan membangunkan warna, perisa dan tekstur. Oleh sebab sintesis etilena autokatalitik, buah sebegini boleh dipetik semasa hijau dan dimasakkan secara buatan dengan etilena di destinasinya. Buah bukan klimakterik tidak menunjukkan letusan sebegini.",
    defines=["climacteric"], src=["HH:366", "LEC"]),
  L(("生长：促进地上营养组织伸长，但抑制根伸长；赤霉素可拮抗乙烯对根和茎生长的效应。", "Growth: stimulates elongation of above-ground vegetative tissue but inhibits root elongation; gibberellin can oppose ethylene's effects on root and shoot growth.", "Pertumbuhan: merangsang pemanjangan tisu vegetatif atas tanah tetapi merencat pemanjangan akar; giberelin boleh menentang kesan etilena ke atas pertumbuhan akar dan pucuk."),
    ("叶片偏上生长（epinasty）：叶柄上侧细胞伸长较多，叶片向下弯，是怕淹水植物的典型反应。", "Epinasty: cells on the upper side of the petiole elongate more and the leaf bends down — a typical response of flood-sensitive plants.", "Epinasti: sel di sebelah atas petiol memanjang lebih dan daun membengkok ke bawah — tindak balas biasa tumbuhan yang sensitif banjir."),
    ("另外：促进种子萌发、抑制芽萌发、减弱顶端优势；促进器官脱落；生长素诱导凤梨开花和苹果疏果，其实是经由乙烯。", "Also: promotes seed germination, inhibits bud break, weakens apical dominance and promotes abscission; the auxin-induced flowering of pineapple and thinning of apples work through ethylene.", "Juga: menggalakkan percambahan biji, merencat pecah tunas, melemahkan dominasi apeks dan menggalakkan keguguran; pembungaan nanas dan penjarangan epal yang diaruh auksin berfungsi melalui etilena."),
    src=["HH:316", "HH:366-367", "LEC"]),
 ]},
]}

terms = [
 ("ethylene", T("乙烯", "ethylene", "etilena"),
  T("气体激素 C₂H₄，主要与逆境、衰老和果实成熟相关。", "The gaseous hormone C₂H₄, linked chiefly to stress, senescence and fruit ripening.", "Hormon gas C₂H₄, terutamanya berkait dengan tekanan, penuaan dan pemasakan buah.")),
 ("acc-synthase", T("ACC 合成酶", "ACC synthase", "ACC sintase"),
  T("把 SAM 转成 ACC 的酶，是乙烯合成的限速步骤，受多种因素在转录层次诱导。", "The enzyme converting SAM to ACC; the rate-limiting step of ethylene synthesis, induced transcriptionally by many factors.", "Enzim yang menukar SAM kepada ACC; langkah pengehad kadar sintesis etilena, diaruh secara transkripsi oleh banyak faktor."), "ACS"),
 ("yang-cycle", T("Yang 循环", "Yang cycle", "kitaran Yang"),
  T("把 ACC 合成产生的含硫副产物回收成甲硫氨酸的循环。", "The cycle recycling the sulphur by-product of ACC synthesis back to methionine.", "Kitaran yang mengitar semula hasil sampingan sulfur sintesis ACC kepada metionina.")),
 ("ethephon", T("乙烯利", "ethephon", "etefon"),
  T("在植物组织中分解放出乙烯的农用化合物（2-氯乙基膦酸）。", "An agricultural compound (2-chloroethylphosphonic acid) that releases ethylene in plant tissue.", "Sebatian pertanian (asid 2-kloroetilfosfonik) yang membebaskan etilena dalam tisu tumbuhan.")),
 ("triple-response", T("三重反应", "triple response", "tindak balas tiga serangkai"),
  T("乙烯使黑暗中的幼苗下胚轴变短、变粗、顶钩加剧。", "Ethylene's effect on dark-grown seedlings: short, swollen hypocotyl and an exaggerated hook.", "Kesan etilena pada anak benih dalam gelap: hipokotil pendek dan bengkak serta cangkuk berlebihan.")),
 ("etr1", T("ETR1（乙烯受体）", "ETR1 (ethylene receptor)", "ETR1 (reseptor etilena)"),
  T("内质网膜上含铜的双组分乙烯受体；没有乙烯时组成型活化、抑制反应。", "A copper-containing two-component ethylene receptor in the ER membrane; active without ethylene, repressing the response.", "Reseptor etilena dua komponen mengandungi kuprum dalam membran RE; aktif tanpa etilena, menindas tindak balas."), "ETR1"),
 ("climacteric", T("呼吸跃变", "climacteric", "klimakterik"),
  T("某些果实成熟时呼吸突然增加并伴随乙烯爆发。", "The sudden rise in respiration, with a burst of ethylene, as certain fruits ripen.", "Kenaikan mendadak respirasi, dengan letusan etilena, semasa buah tertentu masak.")),
]

quiz = [
 {"stage": 4, "chapter": "ch22",
  "q": T("乙烯合成的限速酶是？", "The rate-limiting enzyme of ethylene synthesis is…", "Enzim pengehad kadar sintesis etilena ialah…"),
  "options": [T("SAM 合成酶", "SAM synthetase", "SAM sintetase"), T("ACC 合成酶", "ACC synthase", "ACC sintase"), T("ACC 氧化酶", "ACC oxidase", "ACC oksidase"), T("NCED", "NCED", "NCED")],
  "answer": 1, "why": T("生长素、伤害、逆境和乙烯本身都在转录层次诱导 ACS。", "Auxin, wounding, stress and ethylene itself all induce ACS transcriptionally.", "Auksin, luka, tekanan dan etilena itu sendiri semuanya mengaruh ACS secara transkripsi.")},
 {"stage": 4, "chapter": "ch22",
  "q": T("etr1 突变体在乙烯中会怎样？", "How does an etr1 mutant behave in ethylene?", "Bagaimana mutan etr1 berkelakuan dalam etilena?"),
  "options": [T("表现很强的三重反应", "A strong triple response", "Tindak balas tiga serangkai yang kuat"), T("对乙烯不敏感，长得又直又长", "Ethylene-insensitive: long and straight", "Tidak sensitif etilena: panjang dan lurus"), T("不能合成乙烯", "It cannot make ethylene", "Ia tidak dapat membuat etilena"), T("立刻死亡", "It dies at once", "Ia mati serta-merta")],
  "answer": 1, "why": T("突变的受体无法被乙烯关闭，抑制一直存在。", "The mutant receptor cannot be switched off by ethylene, so the repression stays.", "Reseptor mutan tidak dapat dimatikan oleh etilena, jadi penindasan kekal.")},
 {"stage": 4, "chapter": "ch22",
  "q": T("为什么香蕉可以青着采收、到市场再催熟？", "Why can bananas be picked green and ripened at market?", "Mengapa pisang boleh dipetik hijau dan dimasakkan di pasaran?"),
  "options": [T("它们是非跃变果实", "They are non-climacteric", "Ia bukan klimakterik"), T("它们是跃变果实，乙烯合成自催化", "They are climacteric and ethylene synthesis is autocatalytic", "Ia klimakterik dan sintesis etilena autokatalitik"), T("赤霉素让它们成熟", "Gibberellin ripens them", "Giberelin memasakkannya"), T("它们在黑暗中成熟", "They ripen in the dark", "Ia masak dalam gelap")],
  "answer": 1, "why": T("给一点乙烯就引发更多乙烯，带动整个成熟过程。", "A little ethylene triggers more, driving the whole ripening programme.", "Sedikit etilena mencetuskan lebih banyak, memacu seluruh program pemasakan.")},
 {"stage": 4, "chapter": "ch22",
  "q": T("ETR1 结合乙烯需要哪种金属辅因子？", "What metal cofactor does ETR1 need to bind ethylene?", "Kofaktor logam apakah yang diperlukan ETR1 untuk mengikat etilena?"),
  "options": [T("铁", "Iron", "Besi"), T("铜", "Copper", "Kuprum"), T("锌", "Zinc", "Zink"), T("镁", "Magnesium", "Magnesium")],
  "answer": 1, "why": T("感应结构域含铜。", "The sensor domain holds a copper cofactor.", "Domain penderia mengandungi kofaktor kuprum.")},
]

if __name__ == "__main__":
    write_chapter(chapter, terms, [], quiz)
