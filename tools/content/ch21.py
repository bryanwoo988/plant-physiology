"""Chapter 21 — Abscisic acid. Run: python3 tools/content/ch21.py"""
import sys
sys.path.insert(0, 'tools/content')
from build import T, P, L, N, write_chapter

chapter = {"id": "ch21", "num": 21, "stage": 4,
 "title": T("脱落酸", "Abscisic acid", "Asid absisik"),
 "sources": ["HH", "LEC"],
 "sections": [
 {"id": "s1", "heading": T("三条线索，同一个分子", "Three trails, one molecule", "Tiga jejak, satu molekul"), "level": "basic", "blocks": [
  P("1960 年代，三个实验室各自追踪不同现象：马铃薯块茎和腋芽中与休眠有关的“抑制剂 β”；木本植物芽中诱导休眠的物质（Wareing 于 1964 年称之为 dormin，“休眠素”）；以及从衰老的菜豆叶、棉花和羽扇豆果实分离、能加速器官脱落的“脱落素 II”。三者纯化后被证明是同一种物质。1967 年国际植物生长物质会议采用了{{t:aba}}这个名称。它是 15 碳的倍半萜，自成一类，只有这一种化合物。",
    "In the 1960s three laboratories followed three trails: ‘inhibitor β’ in potato tubers and axillary buds, linked to dormancy; dormancy-inducing substances in the buds of woody plants (named ‘dormin’ by Wareing in 1964); and ‘abscisin II’, which accelerated abscission, from senescing bean leaves and from cotton and lupin fruits. Purified, all three proved chemically identical, and the 1967 International Conference on Plant Growth Substances adopted the name {{t:aba}}. It is a 15-carbon sesquiterpene — a hormone class of exactly one compound.",
    "Pada 1960-an tiga makmal mengikuti tiga jejak: ‘perencat β’ dalam ubi kentang dan tunas ketiak, berkait dengan dorman; bahan pengaruh dorman dalam tunas tumbuhan berkayu (dinamakan ‘dormin’ oleh Wareing pada 1964); dan ‘absisin II’, yang mempercepat keguguran, daripada daun kacang yang menua dan buah kapas serta lupin. Setelah ditulenkan, ketiga-tiganya ternyata sama secara kimia, dan Persidangan Antarabangsa Bahan Pertumbuhan Tumbuhan 1967 menerima nama {{t:aba}}. Ia seskuiterpena 15 karbon — kelas hormon yang hanya mempunyai satu sebatian.",
    defines=["aba"], src=["HH:355-357", "LEC"]),
  L(("主要功能：防止种子在母株上提早萌发、诱导和维持种子休眠、控制气孔、保护细胞免于脱水（逆境反应）。", "Main roles: preventing precocious germination, initiating and maintaining seed dormancy, controlling stomata, and protecting cells from desiccation (stress responses).", "Peranan utama: mencegah percambahan pramatang, memulakan dan mengekalkan dorman biji, mengawal stoma, dan melindungi sel daripada pengeringan (tindak balas tekanan)."),
    ("其他可能的作用：诱导种子贮藏蛋白、异形叶、侧根发育、开花与衰老。", "Possible further roles: inducing seed storage proteins, heterophylly, lateral root development, flowering and senescence.", "Peranan lain yang mungkin: mengaruh protein simpanan biji, heterofili, perkembangan akar sisi, pembungaan dan penuaan."),
    src=["HH:355-356", "LEC"]),
 ]},
 {"id": "s2", "heading": T("由类胡萝卜素切出来", "Cut from a carotenoid", "Dipotong daripada karotenoid"), "level": "basic", "blocks": [
  P("ABA 的合成从叶绿体开始：经 MEP 途径得到 IPP，再合成 C₄₀ 的类胡萝卜素 β-胡萝卜素，转成紫黄质。关键酶{{t:nced}}把紫黄质切成 15 碳的黄氧素（xanthoxin）和一个 25 碳的副产物。黄氧素移到细胞质，由醇脱氢酶变成脱落醛，再由脱落醛氧化酶氧化成 ABA。证据之一来自玉米的胎萌突变体：多个缺乏类胡萝卜素的突变体同时缺 ABA，种子在穗上就发芽。",
    "ABA synthesis begins in the chloroplast: IPP from the MEP pathway leads to the C₄₀ carotenoid β-carotene and then violaxanthin. The key enzyme, {{t:nced}}, cleaves violaxanthin into 15-carbon xanthoxin and a 25-carbon by-product. Xanthoxin moves to the cytosol, where an alcohol dehydrogenase converts it to abscisic aldehyde and abscisic aldehyde oxidase oxidises that to ABA. Among the evidence: several viviparous maize mutants lacking carotenoids also lack ABA, and their seeds germinate on the cob.",
    "Sintesis ABA bermula dalam kloroplas: IPP daripada laluan MEP membawa kepada karotenoid C₄₀ β-karotena dan kemudian violaxantin. Enzim utama, {{t:nced}}, membelah violaxantin kepada xantoksin 15 karbon dan hasil sampingan 25 karbon. Xantoksin bergerak ke sitosol, di mana alkohol dehidrogenase menukarnya kepada aldehid absisik dan aldehid absisik oksidase mengoksidakannya kepada ABA. Antara buktinya: beberapa mutan jagung vivipar yang tiada karotenoid juga tiada ABA, dan bijinya bercambah di tongkol.",
    defines=["nced"], src=["HH:357-358", "LEC"]),
  P("ABA 主要在成熟叶片合成，但 NCED 等基因也在保卫细胞、韧皮部伴胞和木质部薄壁细胞中表达，所以这些部位也能合成。ABA 在植物体内移动性很高，常累积在库组织（例如种子）；缺水时可贮存在根里。ABA 代谢很快：一条路是与葡萄糖结合成酯，主要的路则是氧化成红花菜豆酸（PA），再还原成二氢红花菜豆酸（DPA）。",
    "ABA is made mainly in mature leaves, but NCED and other genes are also expressed in guard cells, phloem companion cells and xylem parenchyma, so these too can make it. ABA is highly mobile and tends to accumulate in sinks such as seeds; under water stress it can be stored in roots. It is metabolised quickly — partly by forming a glucose ester, but mainly by oxidation to phaseic acid (PA) and reduction to dihydrophaseic acid (DPA).",
    "ABA dibuat terutamanya dalam daun matang, tetapi NCED dan gen lain juga diekspresikan dalam sel pengawal, sel rakan floem dan parenkima xilem, jadi tempat ini juga boleh membuatnya. ABA sangat mudah bergerak dan cenderung terkumpul dalam sinki seperti biji; semasa tekanan air ia boleh disimpan dalam akar. Ia dimetabolismekan dengan cepat — sebahagiannya dengan membentuk ester glukosa, tetapi terutamanya melalui pengoksidaan kepada asid faseik (PA) dan penurunan kepada asid dihidrofaseik (DPA).",
    src=["HH:358-359", "LEC"]),
  P("贮存在叶绿体靠“阴离子陷阱”（第 13 章）：正在光合的叶肉细胞里，细胞质偏酸（pH 6.0–6.5），叶绿体基质偏碱（pH 7.5–8.0）。不带电的 ABAH 自由扩散进基质，在那里解离成 ABA⁻ 被困住；光合作用停止、基质 pH 下降时，这些 ABA 才被释放出来。",
    "Storage in chloroplasts works as an anion trap (Chapter 13). In a photosynthesising mesophyll cell the cytosol is moderately acidic (pH 6.0–6.5) and the stroma alkaline (pH 7.5–8.0). Uncharged ABAH diffuses into the stroma, dissociates to ABA⁻ and is trapped; it is released when photosynthesis stops and the stromal pH falls.",
    "Penyimpanan dalam kloroplas berfungsi sebagai perangkap anion (Bab 13). Dalam sel mesofil yang berfotosintesis, sitosol sederhana berasid (pH 6.0–6.5) dan stroma beralkali (pH 7.5–8.0). ABAH yang tidak bercas meresap ke dalam stroma, terurai kepada ABA⁻ dan terperangkap; ia dilepaskan apabila fotosintesis berhenti dan pH stroma jatuh.",
    src=["HH:358-359", "HH:231-232"]),
  N("myth", "方向别记反：照光时基质变“碱”（质子被泵进类囊体腔），ABA 被困在叶绿体里；停止光合时基质 pH 下降，ABA 才放出来。有些投影片把两者写反了，以教科书为准。",
    "Don't get the direction backwards: in light the stroma becomes alkaline (protons are pumped into the lumen) and ABA is trapped in the chloroplast; when photosynthesis stops the stromal pH falls and ABA is released. Some slides have this the wrong way round — go by the textbook.",
    "Jangan terbalikkan arahnya: dalam cahaya stroma menjadi beralkali (proton dipam ke dalam lumen) dan ABA terperangkap dalam kloroplas; apabila fotosintesis berhenti pH stroma jatuh dan ABA dilepaskan. Sesetengah slaid menulisnya terbalik — ikut buku teks.",
    src=["HH:358-359", "HH:142"]),
 ]},
 {"id": "s3", "heading": T("种子：休眠与防止胎萌", "Seeds: dormancy and preventing vivipary", "Biji: dorman dan mencegah viviparti"), "level": "basic", "blocks": [
  P("ABA 调节胚的成熟和种子萌发。胚胎发生过程中，ABA 在成熟期达到高峰：它让胚进入休眠，防止{{t:vivipary}}（种子还在母株上就发芽），也诱导种子脱水，进一步维持休眠。缺 ABA 或对 ABA 不敏感的突变体，种子常在果实里就发芽。",
    "ABA regulates embryo maturation and germination. During embryogenesis it peaks in the maturation phase: it imposes dormancy on the embryo, preventing {{t:vivipary}} (germination while still on the parent plant), and induces desiccation of the seed, which also helps maintain dormancy. Mutants lacking ABA or insensitive to it often germinate inside the fruit.",
    "ABA mengawal pematangan embrio dan percambahan. Semasa embriogenesis ia memuncak dalam fasa pematangan: ia mengenakan dorman pada embrio, mencegah {{t:vivipary}} (bercambah semasa masih pada tumbuhan induk), dan mengaruh pengeringan biji, yang juga membantu mengekalkan dorman. Mutan yang tiada ABA atau tidak sensitif kepadanya sering bercambah di dalam buah.",
    defines=["vivipary"], src=["HH:359-360", "LEC"]),
 ]},
 {"id": "s4", "heading": T("干旱信号：关气孔", "The drought signal: closing stomata", "Isyarat kemarau: menutup stoma"), "level": "basic", "blocks": [
  P("缺水的叶片会累积 ABA，抑制气孔张开。一部分 ABA 来自贮存（质外体和叶绿体）；缺水使叶绿体储存的 ABA 释放、运到保卫细胞；之后 ABA 合成加快，维持气孔关闭。土壤变干时，根合成的 ABA 经木质部运到地上部，在叶片水势还没改变之前就让气孔关闭（分根实验，第 13 章）——这是前馈信号，降低气孔导度以保存水分。",
    "Water-stressed leaves accumulate ABA, which inhibits stomatal opening. Some of it comes from stores (apoplast and chloroplasts) released under stress and carried to the guard cells; faster ABA synthesis then keeps the stomata closed. As the soil dries, ABA made in roots travels up the xylem and closes stomata before leaf water potential changes at all (the split-root experiment, Chapter 13) — a feed-forward signal that lowers stomatal conductance and saves water.",
    "Daun yang mengalami tekanan air mengumpul ABA, yang merencat pembukaan stoma. Sebahagiannya datang daripada simpanan (apoplas dan kloroplas) yang dilepaskan semasa tekanan dan dibawa ke sel pengawal; sintesis ABA yang lebih pantas kemudian mengekalkan stoma tertutup. Apabila tanah mengering, ABA yang dibuat dalam akar bergerak naik dalam xilem dan menutup stoma sebelum keupayaan air daun berubah langsung (eksperimen akar terbelah, Bab 13) — isyarat suap depan yang mengurangkan konduktans stoma dan menjimatkan air.",
    src=["HH:360-361", "LEC"]),
  P("在保卫细胞里，ABA 引起胞质 Ca²⁺ 上升（Ca²⁺ 是重要的第二信使），激活质膜上的阴离子通道；阴离子流出使膜去极化，K⁺ 也经外向通道流出，保卫细胞失去溶质和水，膨压下降，气孔关闭——正好把第 8 章开孔的离子流反过来。",
    "In guard cells ABA raises cytosolic Ca²⁺ — a key second messenger — which activates anion channels in the plasma membrane; anion efflux depolarises the membrane, K⁺ leaves through outward channels, the guard cells lose solutes and water, turgor falls and the pore closes — the reverse of the opening fluxes in Chapter 8.",
    "Dalam sel pengawal ABA meningkatkan Ca²⁺ sitosol — utusan kedua yang penting — yang mengaktifkan saluran anion dalam membran plasma; efluks anion menyahkutubkan membran, K⁺ keluar melalui saluran keluar, sel pengawal kehilangan zat terlarut dan air, turgor jatuh dan liang tertutup — kebalikan aliran pembukaan dalam Bab 8.",
    src=["HH:360-362", "LEC"]),
 ]},
 {"id": "s5", "heading": T("受体与信号", "Receptor and signalling", "Reseptor dan pengisyaratan"), "level": "basic", "blocks": [
  P("ABA 的受体曾有多个候选：糊粉层细胞质膜上的 ABAP1、叶绿体镁螯合酶 H 亚基、开花时间蛋白 FCA、G 蛋白偶联受体 GCR2。目前最被接受的是可溶性的 {{t:pyr-pyl}} 受体家族：ABA 与 PYR/PYL 结合后，复合体抑制 2C 型蛋白磷酸酶（PP2C）；PP2C 平时让 SnRK2 激酶保持失活，一旦被抑制，SnRK2 就活化，磷酸化离子通道和转录因子。",
    "Several ABA receptors were proposed: ABAP1 in the plasma membrane of aleurone cells, the H subunit of chloroplast magnesium chelatase, the flowering-time protein FCA and a G-protein-coupled receptor, GCR2. The best accepted today is the soluble {{t:pyr-pyl}} family: ABA-bound PYR/PYL inhibits type 2C protein phosphatases (PP2C), which normally keep SnRK2 kinases inactive; with PP2C inhibited, SnRK2 becomes active and phosphorylates ion channels and transcription factors.",
    "Beberapa reseptor ABA telah dicadangkan: ABAP1 dalam membran plasma sel aleuron, subunit H kelatase magnesium kloroplas, protein masa berbunga FCA dan reseptor berganding protein G, GCR2. Yang paling diterima kini ialah keluarga larut {{t:pyr-pyl}}: PYR/PYL yang terikat ABA merencat protein fosfatase jenis 2C (PP2C), yang biasanya mengekalkan kinase SnRK2 tidak aktif; dengan PP2C direncat, SnRK2 menjadi aktif dan memfosforilkan saluran ion dan faktor transkripsi.",
    defines=["pyr-pyl"], src=["LEC"]),
  {"type": "widget", "id": "W19", "opts": {"hormone": "aba"}},
  P("在基因层次，ABA 响应元件结合因子（ABF/AREB）等转录因子启动 ABA 诱导的基因，促进渗透调节物质（相容性溶质）的合成，帮助细胞耐受脱水和盐害。",
    "At the gene level, transcription factors such as ABA-responsive-element binding factors (ABF/AREB) switch on ABA-induced genes that promote synthesis of osmolytes — compatible solutes — helping cells tolerate desiccation and salt.",
    "Pada peringkat gen, faktor transkripsi seperti faktor pengikat unsur responsif ABA (ABF/AREB) menghidupkan gen yang diaruh ABA yang menggalakkan sintesis osmolit — zat terlarut serasi — membantu sel bertahan terhadap pengeringan dan garam.",
    src=["HH:362", "LEC"]),
 ]},
]}

terms = [
 ("aba", T("脱落酸", "abscisic acid", "asid absisik"),
  T("15 碳倍半萜激素：诱导种子休眠、防止胎萌、在干旱时关闭气孔。", "A 15-carbon sesquiterpene hormone: imposes seed dormancy, prevents vivipary and closes stomata under drought.", "Hormon seskuiterpena 15 karbon: mengenakan dorman biji, mencegah viviparti dan menutup stoma semasa kemarau."), "ABA"),
 ("nced", T("9-顺式环氧类胡萝卜素双加氧酶", "9-cis-epoxycarotenoid dioxygenase", "9-cis-epoksikarotenoid dioksigenase"),
  T("把紫黄质切成黄氧素的叶绿体酶，是 ABA 合成的关键步骤。", "The plastid enzyme cleaving violaxanthin to xanthoxin; the key step of ABA synthesis.", "Enzim plastid yang membelah violaxantin kepada xantoksin; langkah utama sintesis ABA."), "NCED"),
 ("vivipary", T("胎萌", "vivipary", "viviparti"),
  T("种子还在母株上就发芽；ABA 缺乏或不敏感时常见。", "Germination of seeds while still on the parent plant; common when ABA is lacking or not perceived.", "Percambahan biji semasa masih pada tumbuhan induk; biasa apabila ABA tiada atau tidak dikesan.")),
 ("pyr-pyl", T("PYR/PYL/RCAR 受体", "PYR/PYL/RCAR receptors", "reseptor PYR/PYL/RCAR"),
  T("可溶性 ABA 受体：结合 ABA 后抑制 PP2C，使 SnRK2 激酶活化。", "Soluble ABA receptors: with ABA bound they inhibit PP2C, releasing SnRK2 kinases.", "Reseptor ABA larut: dengan ABA terikat ia merencat PP2C, membebaskan kinase SnRK2."), "PYR/PYL"),
]

quiz = [
 {"stage": 4, "chapter": "ch21",
  "q": T("ABA 合成中，哪一步由 NCED 催化？", "Which step of ABA synthesis does NCED catalyse?", "Langkah sintesis ABA manakah yang dimangkinkan oleh NCED?"),
  "options": [T("黄氧素 → 脱落醛", "Xanthoxin → abscisic aldehyde", "Xantoksin → aldehid absisik"), T("紫黄质 → 黄氧素（C₄₀ 切成 C₁₅）", "Violaxanthin → xanthoxin (C₄₀ cut to C₁₅)", "Violaxantin → xantoksin (C₄₀ dipotong kepada C₁₅)"), T("ABA → 红花菜豆酸", "ABA → phaseic acid", "ABA → asid faseik"), T("IPP → GGPP", "IPP → GGPP", "IPP → GGPP")],
  "answer": 1, "why": T("这是在叶绿体中的关键步骤；之后在细胞质完成。", "That is the key step, in the chloroplast; the rest happens in the cytosol.", "Itulah langkah utama, dalam kloroplas; selebihnya berlaku dalam sitosol.")},
 {"stage": 4, "chapter": "ch21",
  "q": T("照光时 ABA 为什么会累积在叶绿体里？", "Why does ABA accumulate in chloroplasts in the light?", "Mengapa ABA terkumpul dalam kloroplas dalam cahaya?"),
  "options": [T("叶绿体合成 ABA", "Chloroplasts make ABA", "Kloroplas membuat ABA"), T("基质偏碱，ABAH 进入后解离成 ABA⁻ 被困住", "The stroma is alkaline, so ABAH that enters dissociates to ABA⁻ and is trapped", "Stroma beralkali, jadi ABAH yang masuk terurai kepada ABA⁻ dan terperangkap"), T("有 ABA 泵", "There is an ABA pump", "Terdapat pam ABA"), T("基质偏酸", "The stroma is acidic", "Stroma berasid")],
  "answer": 1, "why": T("阴离子陷阱：带电的 ABA⁻ 不能穿膜。", "An anion trap: charged ABA⁻ cannot cross the membrane.", "Perangkap anion: ABA⁻ yang bercas tidak dapat merentasi membran.")},
 {"stage": 4, "chapter": "ch21",
  "q": T("ABA 与 PYR/PYL 结合后直接抑制的是？", "What does ABA-bound PYR/PYL directly inhibit?", "Apakah yang direncat secara langsung oleh PYR/PYL yang terikat ABA?"),
  "options": [T("SnRK2 激酶", "SnRK2 kinase", "Kinase SnRK2"), T("PP2C 磷酸酶", "PP2C phosphatase", "Fosfatase PP2C"), T("H⁺-ATP 酶", "H⁺-ATPase", "H⁺-ATPase"), T("NCED", "NCED", "NCED")],
  "answer": 1, "why": T("PP2C 被抑制后，SnRK2 才能活化——“抑制一个抑制者”。", "With PP2C inhibited, SnRK2 becomes active — inhibiting an inhibitor.", "Dengan PP2C direncat, SnRK2 menjadi aktif — merencat perencat.")},
 {"stage": 4, "chapter": "ch21",
  "q": T("玉米胎萌突变体为什么在穗上就发芽？", "Why do viviparous maize mutants germinate on the cob?", "Mengapa mutan jagung vivipar bercambah di tongkol?"),
  "options": [T("赤霉素太少", "Too little gibberellin", "Terlalu sedikit giberelin"), T("缺乏 ABA（多数也缺类胡萝卜素）", "They lack ABA (most also lack carotenoids)", "Ia tiada ABA (kebanyakannya juga tiada karotenoid)"), T("乙烯太多", "Too much ethylene", "Terlalu banyak etilena"), T("胚乳太大", "The endosperm is too large", "Endosperma terlalu besar")],
  "answer": 1, "why": T("ABA 由类胡萝卜素合成；没有 ABA，胚就不进入休眠。", "ABA is made from carotenoids; without ABA the embryo never becomes dormant.", "ABA dibuat daripada karotenoid; tanpa ABA embrio tidak pernah dorman.")},
]

if __name__ == "__main__":
    write_chapter(chapter, terms, [], quiz)
