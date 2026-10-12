"""Chapter 12 — Carbon, nitrogen and plant productivity. Run: python3 tools/content/ch12.py"""
import sys
sys.path.insert(0, 'tools/content')
from build import T, P, L, N, write_chapter

chapter = {"id": "ch12", "num": 12, "stage": 3,
 "title": T("碳、氮与植物生产力", "Carbon, nitrogen and plant productivity", "Karbon, nitrogen dan produktiviti tumbuhan"),
 "sources": ["HH", "LEC"],
 "sections": [
 {"id": "s1", "heading": T("生产力：生物量的增加", "Productivity: an increase in biomass", "Produktiviti: peningkatan biojisim"), "level": "basic", "blocks": [
  P("植物固定的碳构成生物量，养活人类和所有异养生物；了解生产力也是研究生态系统能量与养分流动的基础。{{t:primary-productivity}}是光合生物把太阳能转成有机物。光合作用同化的总碳叫总初级生产力（GPP）；扣掉呼吸用掉的部分，真正用于生长的叫净初级生产力（NPP）。所以生长取决于光合与呼吸之间的碳平衡。",
    "Carbon fixed by plants becomes biomass, feeding humans and every other heterotroph; knowing productivity is also the basis for studying energy and nutrient flow in ecosystems. {{t:primary-productivity}} is the conversion of solar energy into organic matter by photosynthetic organisms. The total carbon assimilated is gross primary productivity (GPP); subtract what respiration uses and what remains for growth is net primary productivity (NPP). Growth therefore depends on the carbon balance between photosynthesis and respiration.",
    "Karbon yang diikat tumbuhan menjadi biojisim, memberi makan manusia dan semua heterotrof lain; memahami produktiviti juga asas mengkaji aliran tenaga dan nutrien dalam ekosistem. {{t:primary-productivity}} ialah penukaran tenaga suria kepada bahan organik oleh organisma fotosintetik. Jumlah karbon yang diasimilasi ialah produktiviti primer kasar (GPP); tolak apa yang digunakan respirasi dan baki untuk pertumbuhan ialah produktiviti primer bersih (NPP). Pertumbuhan oleh itu bergantung pada imbangan karbon antara fotosintesis dan respirasi.",
    defines=["primary-productivity"], src=["HH:213-214", "LEC"]),
 ]},
 {"id": "s2", "heading": T("碳经济：维持与生长", "The carbon economy: maintenance and growth", "Ekonomi karbon: penyelenggaraan dan pertumbuhan"), "level": "basic", "blocks": [
  P("碳经济是碳的取得与使用之间的平衡。呼吸的成本可分成两部分：{{t:maintenance-respiration}}——维持现有组织（蛋白质更新、维持离子梯度等），成熟叶片的呼吸几乎全是这一类，根又比地上部高（吸收离子要耗能，根里交替途径也较活跃）；以及{{t:growth-respiration}}——建造新组织的碳成本。",
    "The carbon economy is the balance between acquiring carbon and using it. Respiration's costs fall into two parts: {{t:maintenance-respiration}}, which keeps existing tissue going (protein turnover, ion gradients and so on) — practically all the respiration of a mature leaf, and higher in roots than in shoots because of ion uptake and a more active alternative pathway; and {{t:growth-respiration}}, the carbon cost of building new tissue.",
    "Ekonomi karbon ialah imbangan antara memperoleh karbon dan menggunakannya. Kos respirasi terbahagi kepada dua: {{t:maintenance-respiration}}, yang mengekalkan tisu sedia ada (pusing ganti protein, kecerunan ion dan sebagainya) — hampir semua respirasi daun matang, dan lebih tinggi dalam akar berbanding pucuk kerana pengambilan ion dan laluan alternatif yang lebih aktif; dan {{t:growth-respiration}}, kos karbon membina tisu baharu.",
    defines=["maintenance-respiration", "growth-respiration"], src=["HH:214-215", "LEC"]),
  P("比较不同的植物，整体上呼吸与生长率呈负相关：维持呼吸较低（呼吸碳代谢较有效率）的植物长得较快；降低线粒体交替途径的活性也可能有助于提高生长率。能不能用这一点来育种，提高生产力，仍是研究问题。",
    "Comparing plants, respiration and growth rate are negatively related overall: plants with lower maintenance respiration — more efficient respiratory carbon use — grow faster, and lower activity of the mitochondrial alternative pathway may also help. Whether this can be exploited to breed for higher productivity is still an open question.",
    "Membandingkan tumbuhan, respirasi dan kadar pertumbuhan secara keseluruhannya berhubung negatif: tumbuhan dengan respirasi penyelenggaraan lebih rendah — penggunaan karbon respirasi yang lebih cekap — tumbuh lebih cepat, dan aktiviti laluan alternatif mitokondria yang lebih rendah juga mungkin membantu. Sama ada hal ini boleh dimanfaatkan untuk membiak baka bagi produktiviti lebih tinggi masih persoalan terbuka.",
    src=["HH:214-215", "LEC"]),
 ]},
 {"id": "s3", "heading": T("光和 CO₂", "Light and CO₂", "Cahaya dan CO₂"), "level": "basic", "blocks": [
  P("除了遗传因素，光合作用还受光、CO₂、温度、土壤水分、养分、叶片本身、病害和污染物限制。先看光：C₃ 植物的光合速率随光量上升，直到{{t:light-saturation}}——再多光也不会更快，这时的限制是 CO₂。在黑暗中叶片只有呼吸，净释放 CO₂；光增加到吸收的 CO₂ 刚好等于放出的那一点，叫{{t:light-compensation-point}}。光合作用只有在补偿点以上才对生产力有贡献。",
    "Besides genetics, photosynthesis is limited by light, CO₂, temperature, soil water, nutrients, the leaf itself, disease and pollutants. Light first: in C₃ plants the rate rises with fluence until {{t:light-saturation}} — more light no longer helps, because CO₂ is now limiting. In the dark a leaf only respires and releases CO₂; the light level at which CO₂ uptake exactly balances release is the {{t:light-compensation-point}}. Photosynthesis contributes to productivity only above it.",
    "Selain genetik, fotosintesis dihadkan oleh cahaya, CO₂, suhu, air tanah, nutrien, daun itu sendiri, penyakit dan bahan cemar. Cahaya dahulu: dalam tumbuhan C₃ kadarnya meningkat dengan fluens sehingga {{t:light-saturation}} — lebih banyak cahaya tidak lagi membantu, kerana CO₂ kini mengehadkan. Dalam gelap daun hanya berespirasi dan membebaskan CO₂; paras cahaya di mana pengambilan CO₂ tepat mengimbangi pembebasan ialah {{t:light-compensation-point}}. Fotosintesis hanya menyumbang kepada produktiviti di atasnya.",
    defines=["light-saturation", "light-compensation-point"], src=["HH:215-216", "LEC"]),
  {"type": "widget", "id": "W12"},
  P("在一般光照下，C₃ 植物的光合速率随细胞间 CO₂ 浓度上升而呈饱和曲线；大气 CO₂ 相对较低，所以 C₃ 植物在正常空气中其实受 CO₂ 限制。光合吸收与呼吸放出 CO₂ 相等时的浓度叫{{t:co2-compensation-point}}。CO₂ 低时，限制是 rubisco 的羧化能力；CO₂ 高时，限制变成电子传递链再生 RuBP 的能力。最有效率的是两者之间的过渡区，由气孔调节。光越强，CO₂ 的影响越大。",
    "Under ordinary light, C₃ photosynthesis rises with intercellular CO₂ along a saturating curve; atmospheric CO₂ is relatively low, so C₃ plants in normal air are in fact CO₂-limited. The concentration at which photosynthetic uptake equals respiratory release is the {{t:co2-compensation-point}}. At low CO₂ the limit is rubisco's carboxylation capacity; at high CO₂ it becomes the electron transport chain's capacity to regenerate RuBP. The most efficient range is the transition between them, which stomata regulate. The stronger the light, the greater the effect of CO₂.",
    "Di bawah cahaya biasa, fotosintesis C₃ meningkat dengan CO₂ antara sel mengikut lengkung tepu; CO₂ atmosfera agak rendah, jadi tumbuhan C₃ dalam udara biasa sebenarnya dihadkan oleh CO₂. Kepekatan di mana pengambilan fotosintetik sama dengan pembebasan respirasi ialah {{t:co2-compensation-point}}. Pada CO₂ rendah, hadnya ialah kapasiti pengkarboksilan rubisco; pada CO₂ tinggi ia menjadi kapasiti rantai pengangkutan elektron untuk menjana semula RuBP. Julat paling cekap ialah peralihan antara keduanya, yang dikawal stoma. Semakin kuat cahaya, semakin besar kesan CO₂.",
    defines=["co2-compensation-point"], src=["HH:216-218", "LEC"]),
 ]},
 {"id": "s4", "heading": T("温度", "Temperature", "Suhu"), "level": "basic", "blocks": [
  P("生物反应对温度的反应曲线有三个“基点”：最低温度、最适温度和最高温度（超过就酶失活）。温度依赖性常用 {{t:q10}} 表示：温度升高 10 °C 时速率变成原来的几倍。大多数生物过程 Q₁₀ 约 2–3；光化学反应在 0–50 °C 之间几乎不受温度影响（Q₁₀ ≈ 1）。",
    "A biological rate plotted against temperature has three cardinal points: a minimum, an optimum and a maximum (beyond which enzymes are inactivated). Temperature dependence is often expressed as {{t:q10}}, the factor by which the rate changes for a 10 °C rise. For most biological processes Q₁₀ is about 2–3; photochemical reactions are almost insensitive to temperature between 0 and 50 °C (Q₁₀ ≈ 1).",
    "Kadar biologi yang diplot melawan suhu mempunyai tiga titik kardinal: minimum, optimum dan maksimum (melampauinya enzim dinyahaktifkan). Kebergantungan suhu sering dinyatakan sebagai {{t:q10}}, faktor perubahan kadar bagi kenaikan 10 °C. Bagi kebanyakan proses biologi Q₁₀ kira-kira 2–3; tindak balas fotokimia hampir tidak sensitif kepada suhu antara 0 dan 50 °C (Q₁₀ ≈ 1).",
    defines=["q10"], src=["HH:218-219", "LEC"]),
  P("所以光合作用对温度的短期反应，主要反映碳代谢和光系统间电子传递的反应；长时间高温则会让光系统 II 不稳定，降低光化学能力（光系统 I 比 II 稳定得多）。在光下，叶片的表观光合 AP = GP − (R + PR)：总光合减去线粒体呼吸和光呼吸。三者对温度的反应不同——总光合随酶被热活化而上升，直到酶失活或气孔关闭；呼吸上升较慢、最适温度较高、但高温时下降得快；光呼吸大致像呼吸——所以净光合的最适温度和总光合不一样。",
    "The short-term temperature response of photosynthesis therefore mostly reflects carbon metabolism and inter-system electron transport; prolonged heat destabilises photosystem II and lowers photochemical capacity (photosystem I is far more stable). In light, a leaf's apparent photosynthesis AP = GP − (R + PR): gross photosynthesis minus mitochondrial respiration and photorespiration. Each responds differently to temperature — gross photosynthesis climbs as enzymes are thermally activated until enzyme inactivation or stomatal closure; respiration rises more slowly, has a higher optimum but falls faster at high temperature; photorespiration behaves roughly like respiration — so net photosynthesis has a different optimum from gross.",
    "Tindak balas jangka pendek fotosintesis terhadap suhu oleh itu kebanyakannya mencerminkan metabolisme karbon dan pengangkutan elektron antara sistem; haba berpanjangan menjejaskan kestabilan fotosistem II dan mengurangkan kapasiti fotokimia (fotosistem I jauh lebih stabil). Dalam cahaya, fotosintesis ketara daun AP = GP − (R + PR): fotosintesis kasar tolak respirasi mitokondria dan fotorespirasi. Setiap satu bertindak balas berbeza terhadap suhu — fotosintesis kasar meningkat apabila enzim diaktifkan haba sehingga enzim dinyahaktifkan atau stoma tertutup; respirasi meningkat lebih perlahan, mempunyai optimum lebih tinggi tetapi menurun lebih cepat pada suhu tinggi; fotorespirasi lebih kurang seperti respirasi — jadi fotosintesis bersih mempunyai optimum yang berbeza daripada kasar.",
    src=["HH:219-221", "LEC"]),
 ]},
 {"id": "s5", "heading": T("水、氮与叶片", "Water, nitrogen and the leaf", "Air, nitrogen dan daun"), "level": "basic", "blocks": [
  L(("土壤水分：缺水时气孔关闭，CO₂ 供应减少；如果同时长时间照光，还会造成光抑制（第 13、14 章）。水势低使叶细胞膨压下降、叶片扩展变慢，光合面积变小。C₄ 植物的水分利用效率较高（第 15 章）。", "Soil water: under drought stomata close and CO₂ supply falls; with prolonged light this can also cause photoinhibition (Chapters 13 and 14). Low water potential lowers turgor in leaf cells, slows leaf expansion and shrinks the photosynthetic area. C₄ plants have higher water-use efficiency (Chapter 15).", "Air tanah: semasa kemarau stoma tertutup dan bekalan CO₂ jatuh; dengan cahaya berpanjangan ini juga boleh menyebabkan fotoperencatan (Bab 13 dan 14). Keupayaan air rendah merendahkan turgor sel daun, melambatkan pengembangan daun dan mengecilkan kawasan fotosintesis. Tumbuhan C₄ mempunyai kecekapan penggunaan air yang lebih tinggi (Bab 15)."),
    ("氮：光合能力对氮供应特别敏感，因为氨基酸、酶（尤其 rubisco）、叶绿素和电子载体都需要氮。光合、呼吸和氮代谢互相依赖：TCA 循环的中间产物加上硝酸盐同化做出氨基酸，再做成光合与呼吸所需的酶；光合与呼吸则提供能量和碳骨架。GS/GOGAT 和 PII 蛋白就在这个交会点上调控。", "Nitrogen: photosynthetic capacity is especially sensitive to nitrogen, needed for amino acids, enzymes (rubisco above all), chlorophyll and electron carriers. Photosynthesis, respiration and nitrogen metabolism depend on one another: TCA-cycle intermediates plus nitrate assimilation make amino acids, which become the enzymes of photosynthesis and respiration; photosynthesis and respiration supply energy and carbon skeletons. GS/GOGAT and the PII proteins regulate this junction.", "Nitrogen: kapasiti fotosintesis sangat sensitif kepada nitrogen, yang diperlukan untuk asid amino, enzim (terutamanya rubisco), klorofil dan pembawa elektron. Fotosintesis, respirasi dan metabolisme nitrogen saling bergantung: perantaraan kitaran TCA serta asimilasi nitrat membuat asid amino, yang menjadi enzim fotosintesis dan respirasi; fotosintesis dan respirasi membekalkan tenaga dan rangka karbon. GS/GOGAT dan protein PII mengawal persimpangan ini."),
    ("叶片发育与类型：叶片的光合能力随发育和老化大幅改变。常绿叶的光合能力低、发育期长、建造成本高，但仍比每年长新叶划算。", "Leaf age and type: a leaf's capacity changes greatly as it develops and ages. Evergreen leaves have low capacity and long development, an expensive construction — still cheaper than growing new leaves.", "Umur dan jenis daun: kapasiti daun berubah besar apabila ia berkembang dan menua. Daun malar hijau mempunyai kapasiti rendah dan perkembangan panjang, pembinaan yang mahal — masih lebih murah daripada menumbuhkan daun baharu."),
    src=["HH:221-222", "LEC"]),
  P("整个冠层的组织也影响净初级生产力：叶片的年龄、形态、角度和间距。植株上下有叶龄梯度，上部叶片贡献较多；下部叶片依次衰老，减轻维持呼吸的负担，并在落叶前回收约一半干重的元素。{{t:lai}}是叶面积与地面面积之比；每个物种的 LAI 大致已经优化，能把光分配给整个冠层。种得太密，叶片互相遮荫，阴暗而不产生净光合的叶片仍在呼吸，总生物量反而下降。有些植物的叶片会追踪太阳（向日性），一天中调整角度以截获最多的光。",
    "The organisation of the canopy also shapes net primary productivity: the age, form, angle and spacing of the leaves. There is a gradient of leaf age up the plant, with upper leaves contributing most; lower leaves senesce in turn, cutting the maintenance burden and recycling about half their dry weight in elements before they fall. The {{t:lai}} is leaf area divided by ground area; each species' LAI is broadly optimised to share light through the canopy. Planted too densely, leaves shade one another, and shaded, unproductive leaves still respire, so total biomass falls. Some plants' leaves track the sun (heliotropism), changing angle through the day to intercept the most light.",
    "Susunan kanopi juga membentuk produktiviti primer bersih: umur, bentuk, sudut dan jarak daun. Terdapat kecerunan umur daun ke atas tumbuhan, dengan daun atas paling banyak menyumbang; daun bawah menua secara berturutan, mengurangkan beban penyelenggaraan dan mengitar semula kira-kira separuh berat keringnya dalam bentuk unsur sebelum gugur. {{t:lai}} ialah luas daun dibahagi luas tanah; LAI setiap spesies secara amnya dioptimumkan untuk membahagikan cahaya ke seluruh kanopi. Jika ditanam terlalu padat, daun saling meneduhkan, dan daun yang terlindung dan tidak produktif masih berespirasi, jadi jumlah biojisim jatuh. Daun sesetengah tumbuhan menjejak matahari (heliotropisme), mengubah sudut sepanjang hari untuk memintas cahaya paling banyak.",
    defines=["lai"], src=["HH:222", "LEC"]),
 ]},
]}

terms = [
 ("primary-productivity", T("初级生产力", "primary productivity", "produktiviti primer"),
  T("光合生物把太阳能转成有机物的速率；GPP 是总量，NPP 是扣除呼吸后的净量。", "The rate at which photosynthetic organisms turn solar energy into organic matter; GPP is the total, NPP what remains after respiration.", "Kadar organisma fotosintetik menukar tenaga suria kepada bahan organik; GPP ialah jumlah, NPP baki selepas respirasi."), "GPP / NPP"),
 ("maintenance-respiration", T("维持呼吸", "maintenance respiration", "respirasi penyelenggaraan"),
  T("维持现有组织运作所消耗的呼吸。", "Respiration spent keeping existing tissue running.", "Respirasi yang digunakan untuk mengekalkan tisu sedia ada.")),
 ("growth-respiration", T("生长呼吸", "growth respiration", "respirasi pertumbuhan"),
  T("建造新组织所消耗的碳。", "The carbon cost of building new tissue.", "Kos karbon membina tisu baharu.")),
 ("light-saturation", T("光饱和", "light saturation", "ketepuan cahaya"),
  T("光再增加也不再提高光合速率的状态；C₃ 植物此时受 CO₂ 限制。", "The point beyond which more light no longer raises photosynthesis; C₃ plants are then CO₂-limited.", "Titik di mana lebih banyak cahaya tidak lagi meningkatkan fotosintesis; tumbuhan C₃ kemudian dihadkan CO₂.")),
 ("light-compensation-point", T("光补偿点", "light compensation point", "titik pampasan cahaya"),
  T("光合吸收的 CO₂ 刚好等于呼吸放出的 CO₂ 时的光量。", "The light level at which photosynthetic CO₂ uptake equals respiratory release.", "Paras cahaya di mana pengambilan CO₂ fotosintesis sama dengan pembebasan respirasi.")),
 ("co2-compensation-point", T("CO₂ 补偿点", "CO₂ compensation point", "titik pampasan CO₂"),
  T("光合吸收与呼吸（含光呼吸）放出 CO₂ 相等时的 CO₂ 浓度。", "The CO₂ concentration at which photosynthetic uptake equals release by respiration and photorespiration.", "Kepekatan CO₂ di mana pengambilan fotosintesis sama dengan pembebasan oleh respirasi dan fotorespirasi.")),
 ("q10", T("温度系数 Q₁₀", "temperature coefficient (Q₁₀)", "pekali suhu (Q₁₀)"),
  T("温度升高 10 °C 时速率变化的倍数；多数生物过程约 2–3。", "The factor by which a rate changes for a 10 °C rise; about 2–3 for most biological processes.", "Faktor perubahan kadar bagi kenaikan 10 °C; kira-kira 2–3 bagi kebanyakan proses biologi."), "Q₁₀"),
 ("lai", T("叶面积指数", "leaf area index", "indeks luas daun"),
  T("叶片总面积与其覆盖地面面积之比。", "Total leaf area divided by the ground area it covers.", "Jumlah luas daun dibahagi luas tanah yang diliputinya."), "LAI"),
]

quiz = [
 {"stage": 3, "chapter": "ch12",
  "q": T("光补偿点是什么？", "What is the light compensation point?", "Apakah titik pampasan cahaya?"),
  "options": [T("光合速率达到最大的光量", "The light level giving maximum photosynthesis", "Paras cahaya yang memberi fotosintesis maksimum"), T("光合吸收 CO₂ 等于呼吸放出 CO₂ 时的光量", "The light level where CO₂ uptake equals CO₂ release", "Paras cahaya di mana pengambilan CO₂ sama dengan pembebasan CO₂"), T("植物开始开花的光量", "The light level that triggers flowering", "Paras cahaya yang mencetuskan pembungaan"), T("叶绿素开始被破坏的光量", "The light level that destroys chlorophyll", "Paras cahaya yang memusnahkan klorofil")],
  "answer": 1, "why": T("低于这个光量，叶片净损失碳。", "Below it the leaf is a net loser of carbon.", "Di bawahnya daun kehilangan karbon secara bersih.")},
 {"stage": 3, "chapter": "ch12",
  "q": T("高 CO₂ 下，C₃ 光合作用主要受什么限制？", "At high CO₂, what mainly limits C₃ photosynthesis?", "Pada CO₂ tinggi, apakah yang terutamanya mengehadkan fotosintesis C₃?"),
  "options": [T("rubisco 的羧化能力", "Rubisco's carboxylation capacity", "Kapasiti pengkarboksilan rubisco"), T("电子传递链再生 RuBP 的能力", "The electron transport chain's capacity to regenerate RuBP", "Kapasiti rantai pengangkutan elektron menjana semula RuBP"), T("气孔数目", "Stomatal number", "Bilangan stoma"), T("光呼吸", "Photorespiration", "Fotorespirasi")],
  "answer": 1, "why": T("低 CO₂ 时受 rubisco 羧化限制，高 CO₂ 时受 RuBP 再生（电子传递）限制。", "Rubisco limits at low CO₂; RuBP regeneration (electron transport) at high CO₂.", "Rubisco mengehadkan pada CO₂ rendah; penjanaan semula RuBP (pengangkutan elektron) pada CO₂ tinggi.")},
 {"stage": 3, "chapter": "ch12",
  "q": T("某反应 20 °C 时速率为 4，30 °C 时为 10，Q₁₀ 是多少？", "A rate is 4 at 20 °C and 10 at 30 °C. What is Q₁₀?", "Kadar ialah 4 pada 20 °C dan 10 pada 30 °C. Berapakah Q₁₀?"),
  "options": [T("0.4", "0.4", "0.4"), T("2.5", "2.5", "2.5"), T("6", "6", "6"), T("10", "10", "10")],
  "answer": 1, "why": T("Q₁₀ = 10 / 4 = 2.5，在一般生物过程的 2–3 范围内。", "Q₁₀ = 10 / 4 = 2.5, within the usual 2–3 for biological processes.", "Q₁₀ = 10 / 4 = 2.5, dalam julat biasa 2–3 bagi proses biologi.")},
 {"stage": 3, "chapter": "ch12",
  "q": T("植株种得太密，总生物量为什么反而下降？", "Why does total biomass fall when a crop is planted too densely?", "Mengapa jumlah biojisim jatuh apabila tanaman ditanam terlalu padat?"),
  "options": [T("土壤中的氮用光了", "Soil nitrogen runs out", "Nitrogen tanah habis"), T("叶片互相遮荫，阴暗的叶片仍在呼吸消耗碳", "Leaves shade each other and shaded leaves still burn carbon in respiration", "Daun saling meneduhkan dan daun terlindung masih membakar karbon dalam respirasi"), T("光呼吸停止", "Photorespiration stops", "Fotorespirasi berhenti"), T("CO₂ 浓度太高", "CO₂ is too high", "CO₂ terlalu tinggi")],
  "answer": 1, "why": T("LAI 太高时下层叶片低于光补偿点，成为净消耗者。", "At too high an LAI, lower leaves fall below the compensation point and become net consumers.", "Pada LAI terlalu tinggi, daun bawah jatuh di bawah titik pampasan dan menjadi pengguna bersih.")},
]

if __name__ == "__main__":
    write_chapter(chapter, terms, [], quiz)
