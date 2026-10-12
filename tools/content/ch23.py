"""Chapter 23 — Brassinosteroids. Run: python3 tools/content/ch23.py"""
import sys
sys.path.insert(0, 'tools/content')
from build import T, P, L, N, write_chapter

chapter = {"id": "ch23", "num": 23, "stage": 4,
 "title": T("油菜素甾醇", "Brassinosteroids", "Brasinosteroid"),
 "sources": ["HH", "LEC"],
 "sections": [
 {"id": "s1", "heading": T("从油菜花粉里找到的甾醇激素", "A steroid hormone found in rape pollen", "Hormon steroid yang ditemui dalam debunga kanola"), "level": "basic", "blocks": [
  P("1970 年代初，农业研究者筛选花粉中促进生长的物质，得到一种能促进菜豆第二节间伸长的复杂脂质混合物；活性最强的来自油菜（Brassica napus）花粉，统称“芸苔素”。它的效果很像赤霉素，起初很多人以为只是粗提的赤霉素。1979 年 Grove 等人鉴定出活性成分是{{t:brassinolide}}——为了得到 4 毫克纯结晶，用了约 40 公斤蜜蜂采集的油菜花粉；两年后它就被人工合成了。",
    "In the early 1970s agricultural researchers screening pollen for growth-promoting substances obtained a complex lipid mixture that stimulated elongation of bean second internodes; the most active came from rape (Brassica napus) pollen, and the substances were called brassins. Their effects resembled gibberellin's, and many thought they were just crude gibberellin extracts. In 1979 Grove and co-workers identified the active compound as {{t:brassinolide}} — about 40 kg of bee-collected rape pollen yielded only 4 mg of pure crystals. It was chemically synthesised two years later.",
    "Pada awal 1970-an penyelidik pertanian yang menyaring debunga untuk bahan penggalak pertumbuhan memperoleh campuran lipid kompleks yang merangsang pemanjangan ruas kedua kacang; yang paling aktif datang daripada debunga kanola (Brassica napus), dan bahan itu dipanggil brasin. Kesannya menyerupai giberelin, dan ramai menyangka ia hanya ekstrak kasar giberelin. Pada 1979 Grove dan rakan sekerja mengenal pasti sebatian aktif sebagai {{t:brassinolide}} — kira-kira 40 kg debunga kanola yang dikumpul lebah hanya menghasilkan 4 mg hablur tulen. Ia disintesis secara kimia dua tahun kemudian.",
    defines=["brassinolide"], src=["HH:367-368", "LEC"]),
  P("{{t:brassinosteroid}}是植物的甾醇激素；作用和赤霉素相似，也参与一些生长素的功能。很长一段时间人们不承认它是激素，因为只能用外施证明效果；直到找到缺乏合成或感知能力的突变体（植株矮小），才确立它的地位。",
    "{{t:brassinosteroid}}s are the plant steroid hormones; their effects resemble gibberellin's and overlap with some of auxin's. For years they were not accepted as hormones because effects could be shown only by application; mutants unable to make or perceive them — dwarfs — settled the question.",
    "{{t:brassinosteroid}} ialah hormon steroid tumbuhan; kesannya menyerupai giberelin dan bertindih dengan sesetengah kesan auksin. Selama bertahun-tahun ia tidak diterima sebagai hormon kerana kesannya hanya boleh ditunjukkan melalui aplikasi; mutan yang tidak dapat membuat atau mengesannya — tumbuhan kerdil — menyelesaikan persoalan itu.",
    defines=["brassinosteroid"], src=["HH:367-368", "LEC"]),
 ]},
 {"id": "s2", "heading": T("合成与失活", "Synthesis and inactivation", "Sintesis dan penyahaktifan"), "level": "basic", "blocks": [
  P("油菜素甾醇由细胞质的萜类途径而来（第 19 章）：两个法尼基焦磷酸头对头连成 C₃₀ 的鲨烯，环化成环阿屯醇；环阿屯醇是许多植物甾醇的前体，经一连串氧化和甲基化成为 C₂₈ 的菜油甾醇，再转成油菜素内酯。活性的控制有多种方式：与脂肪酸酯化、糖基化、切掉侧链，以及在一个或多个羟基上结合。",
    "Brassinosteroids come from the cytosolic terpene pathway (Chapter 19): two farnesyl pyrophosphates join head to head into C₃₀ squalene, which cyclises to cycloartenol, the precursor of many plant sterols; oxidations and methylations give C₂₈ campesterol, which is converted to brassinolide. Activity is controlled by esterification with fatty acids, glucosylation, side-chain cleavage and conjugation at one or more hydroxyl groups.",
    "Brasinosteroid berasal daripada laluan terpena sitosol (Bab 19): dua farnesil pirofosfat bergabung kepala ke kepala menjadi skualena C₃₀, yang mengitar menjadi sikloartenol, prekursor banyak sterol tumbuhan; pengoksidaan dan pemetilan memberi kampesterol C₂₈, yang ditukar kepada brasinolida. Aktiviti dikawal melalui pengesteran dengan asid lemak, glukosilasi, pemotongan rantai sisi dan konjugasi pada satu atau lebih kumpulan hidroksil.",
    src=["HH:368-369", "LEC"]),
 ]},
 {"id": "s3", "heading": T("作用", "What brassinosteroids do", "Apa yang dilakukan brasinosteroid"), "level": "basic", "blocks": [
  L(("促进茎和花粉管伸长：例如促进大豆上胚轴伸长，增加细胞壁的可塑伸展性，并影响微管排列。", "Stem and pollen-tube elongation: in soybean epicotyls, for example, they increase plastic wall extensibility and affect microtubule arrangement.", "Pemanjangan batang dan tiub debunga: dalam epikotil kacang soya, contohnya, ia meningkatkan keterlanjuran plastik dinding dan mempengaruhi susunan mikrotubul."),
    ("与生长素、细胞分裂素一起促进细胞分裂；与 IAA 协同促进侧根发育。", "With auxin and cytokinin, they promote cell division; with IAA they act synergistically on lateral root development.", "Bersama auksin dan sitokinin, ia menggalakkan pembahagian sel; dengan IAA ia bertindak secara sinergi dalam perkembangan akar sisi."),
    ("促进种子萌发、叶片形态建成、维管分化；参与顶端优势。", "Seed germination, leaf morphogenesis and vascular differentiation; involvement in apical dominance.", "Percambahan biji, morfogenesis daun dan pembezaan vaskular; terlibat dalam dominasi apeks."),
    ("抑制根伸长；加速衰老和程序性细胞死亡；参与对生物和非生物逆境的反应。", "Inhibiting root elongation; accelerating senescence and programmed cell death; responses to biotic and abiotic stress.", "Merencat pemanjangan akar; mempercepat penuaan dan kematian sel terprogram; tindak balas terhadap tekanan biotik dan abiotik."),
    ("合成抑制剂芸苔素唑（brassinazole, Brz）处理拟南芥幼苗，会造成类似合成缺陷突变体的矮化表型。", "The synthesis inhibitor brassinazole (Brz) gives Arabidopsis seedlings a dwarf phenotype like that of biosynthesis mutants.", "Perencat sintesis brasinazol (Brz) memberi anak benih Arabidopsis fenotip kerdil seperti mutan biosintesis."),
    src=["HH:367", "HH:369-370", "LEC"]),
 ]},
 {"id": "s4", "heading": T("受体在细胞表面", "A receptor on the cell surface", "Reseptor di permukaan sel"), "level": "basic", "blocks": [
  P("和动物的甾醇激素（受体在细胞核）不同，油菜素甾醇的受体在质膜上：由富含亮氨酸重复的丝氨酸/苏氨酸受体激酶 {{t:bri1}} 和它的伙伴 BAK1 组成。平时 BRI1 被抑制蛋白 BKI1 压着；油菜素甾醇与 BRI1 结合后，BKI1 脱离，BRI1 与 BAK1 二聚并自身磷酸化，启动信号。下游的激酶 BIN2 平时把转录因子 BZR1（和 BES1）磷酸化，让它们留在细胞质；信号传来时 BIN2 被抑制，BZR1 去磷酸化后进入细胞核，启动油菜素甾醇响应基因。",
    "Unlike animal steroid hormones, whose receptors are nuclear, brassinosteroids are perceived at the plasma membrane by a leucine-rich-repeat serine/threonine receptor kinase, {{t:bri1}}, with its partner BAK1. At rest BRI1 is held by the inhibitory protein BKI1; brassinosteroid binding releases BKI1, and BRI1 dimerises with BAK1 and autophosphorylates, starting the signal. Downstream, the kinase BIN2 normally phosphorylates the transcription factors BZR1 (and BES1), keeping them in the cytosol; when the signal arrives BIN2 is inhibited, and dephosphorylated BZR1 moves to the nucleus and switches on brassinosteroid-response genes.",
    "Tidak seperti hormon steroid haiwan, yang reseptornya di nukleus, brasinosteroid dikesan di membran plasma oleh kinase reseptor serina/treonina ulangan kaya leusina, {{t:bri1}}, bersama rakannya BAK1. Semasa rehat BRI1 ditahan oleh protein perencat BKI1; pengikatan brasinosteroid melepaskan BKI1, dan BRI1 berdimer dengan BAK1 dan memfosforil diri, memulakan isyarat. Di hiliran, kinase BIN2 biasanya memfosforilkan faktor transkripsi BZR1 (dan BES1), mengekalkannya di sitosol; apabila isyarat tiba BIN2 direncat, dan BZR1 yang dinyahfosforil bergerak ke nukleus dan menghidupkan gen tindak balas brasinosteroid.",
    defines=["bri1"], src=["HH:369-370", "LEC"]),
  {"type": "widget", "id": "W19", "opts": {"hormone": "br"}},
  N("key", "问答题“描述生长素、赤霉素、ABA、乙烯和油菜素甾醇的受体”可以这样归纳：生长素 TIR1、赤霉素 GID1——核内、可溶，都靠 SCF 降解抑制蛋白；ABA PYR/PYL——可溶，抑制 PP2C；乙烯 ETR1——内质网膜上的双组分受体，无乙烯时主动抑制；油菜素甾醇 BRI1/BAK1——质膜上的受体激酶。上面的图可以逐一切换比较。",
    "For ‘describe the receptors for auxin, GA, ABA, ethylene and BR’, sum it up like this: auxin TIR1 and GA GID1 — soluble, nuclear, both acting through SCF destruction of a repressor; ABA PYR/PYL — soluble, inhibiting PP2C; ethylene ETR1 — a two-component receptor in the ER membrane that represses the response when ethylene is absent; brassinosteroid BRI1/BAK1 — receptor kinases in the plasma membrane. Switch between them in the figure above to compare.",
    "Untuk ‘terangkan reseptor auksin, GA, ABA, etilena dan BR’, ringkaskan begini: auksin TIR1 dan GA GID1 — larut, nukleus, kedua-duanya bertindak melalui pemusnahan penindas oleh SCF; ABA PYR/PYL — larut, merencat PP2C; etilena ETR1 — reseptor dua komponen dalam membran RE yang menindas tindak balas apabila etilena tiada; brasinosteroid BRI1/BAK1 — kinase reseptor dalam membran plasma. Tukar antara mereka dalam rajah di atas untuk membandingkan.",
    src=["HH:318-319", "HH:333-335", "HH:367-370", "LEC"]),
 ]},
]}

terms = [
 ("brassinolide", T("油菜素内酯", "brassinolide", "brasinolida"),
  T("最主要、活性最强的油菜素甾醇；1979 年由油菜花粉鉴定出来。", "The principal and most active brassinosteroid, identified from rape pollen in 1979.", "Brasinosteroid utama dan paling aktif, dikenal pasti daripada debunga kanola pada 1979."), "BL"),
 ("brassinosteroid", T("油菜素甾醇", "brassinosteroid", "brasinosteroid"),
  T("植物的甾醇激素，促进茎伸长和细胞分裂，效果类似赤霉素。", "The plant steroid hormones, promoting stem elongation and cell division much like gibberellin.", "Hormon steroid tumbuhan, menggalakkan pemanjangan batang dan pembahagian sel seperti giberelin."), "BR"),
 ("bri1", T("BRI1（油菜素甾醇受体）", "BRI1 (brassinosteroid receptor)", "BRI1 (reseptor brasinosteroid)"),
  T("质膜上富含亮氨酸重复的受体激酶，与 BAK1 一起感知油菜素甾醇。", "A leucine-rich-repeat receptor kinase in the plasma membrane that, with BAK1, perceives brassinosteroids.", "Kinase reseptor ulangan kaya leusina dalam membran plasma yang, bersama BAK1, mengesan brasinosteroid."), "BRI1"),
]

quiz = [
 {"stage": 4, "chapter": "ch23",
  "q": T("油菜素甾醇的受体在哪里？", "Where is the brassinosteroid receptor?", "Di manakah reseptor brasinosteroid?"),
  "options": [T("细胞核", "In the nucleus", "Dalam nukleus"), T("质膜", "In the plasma membrane", "Dalam membran plasma"), T("内质网膜", "In the ER membrane", "Dalam membran RE"), T("叶绿体", "In the chloroplast", "Dalam kloroplas")],
  "answer": 1, "why": T("BRI1/BAK1 是质膜上的受体激酶——和动物甾醇激素的核内受体不同。", "BRI1/BAK1 are plasma-membrane receptor kinases — unlike the nuclear receptors of animal steroids.", "BRI1/BAK1 ialah kinase reseptor membran plasma — tidak seperti reseptor nukleus steroid haiwan.")},
 {"stage": 4, "chapter": "ch23",
  "q": T("没有油菜素甾醇时，BZR1 为什么留在细胞质？", "Without brassinosteroid, why does BZR1 stay in the cytosol?", "Tanpa brasinosteroid, mengapa BZR1 kekal di sitosol?"),
  "options": [T("被 BIN2 磷酸化", "It is phosphorylated by BIN2", "Ia difosforilkan oleh BIN2"), T("被泛素化降解", "It is ubiquitinated and destroyed", "Ia diubikuitinkan dan dimusnahkan"), T("被 BRI1 结合", "It is bound by BRI1", "Ia terikat pada BRI1"), T("缺少 ATP", "There is no ATP", "Tiada ATP")],
  "answer": 0, "why": T("信号来时 BIN2 被抑制，BZR1 去磷酸化后进核。", "When the signal arrives BIN2 is inhibited and dephosphorylated BZR1 enters the nucleus.", "Apabila isyarat tiba BIN2 direncat dan BZR1 yang dinyahfosforil masuk ke nukleus.")},
 {"stage": 4, "chapter": "ch23",
  "q": T("油菜素甾醇由哪种前体经环化而来？", "Brassinosteroids derive from the cyclisation of which precursor?", "Brasinosteroid berasal daripada pengitaran prekursor yang mana?"),
  "options": [T("GGPP", "GGPP", "GGPP"), T("鲨烯（来自法尼基焦磷酸）", "Squalene (from farnesyl pyrophosphate)", "Skualena (daripada farnesil pirofosfat)"), T("色氨酸", "Tryptophan", "Triptofan"), T("紫黄质", "Violaxanthin", "Violaxantin")],
  "answer": 1, "why": T("鲨烯 → 环阿屯醇 → 菜油甾醇 → 油菜素内酯。", "Squalene → cycloartenol → campesterol → brassinolide.", "Skualena → sikloartenol → kampesterol → brasinolida.")},
]

if __name__ == "__main__":
    write_chapter(chapter, terms, [], quiz)
