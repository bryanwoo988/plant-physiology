/* Language resolution and the interface string table.

   Every translatable value is a {zh, en, ms} object; pick() is the single
   place that turns one into a string. Knows nothing about the DOM. */

import { get as getPrefs } from './prefs.js';

const FALLBACK = ['en', 'zh', 'ms'];

// The header button shows the language currently in use.
export const LANG_GLYPH = { zh: '中', en: 'EN', ms: 'BM' };

// Each language named in itself: the first-run picker appears before any
// language has been chosen to label the others in.
export const LANG_NATIVE = { zh: '中文', en: 'English', ms: 'Bahasa Melayu' };

export function current() {
  return getPrefs().lang;
}

export function pick(value, lang = current()) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (value[lang]) return value[lang];
  for (const f of FALLBACK) {
    if (value[f]) {
      // The content linter stops this shipping; in development, make it findable.
      console.warn(`[i18n] missing "${lang}":`, String(value[f]).slice(0, 40));
      return value[f];
    }
  }
  return '';
}

export function t(key, vars, lang = current()) {
  let s = pick(UI[key], lang);
  if (!s) console.warn(`[i18n] no UI string "${key}"`);
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

export const UI = {
  appName: { zh: '植物生理学', en: 'Plant Physiology', ms: 'Fisiologi Tumbuhan' },
  tagline: {
    zh: '从细胞怎样吸水，到光合作用、激素和开花——离线可读的三语植物生理学',
    en: 'From how a cell takes up water to photosynthesis, hormones and flowering — an offline course in three languages',
    ms: 'Daripada cara sel menyerap air hingga fotosintesis, hormon dan pembungaan — kursus luar talian dalam tiga bahasa',
  },
  pickTitle: { zh: '选择语言', en: 'Choose your language', ms: 'Pilih bahasa anda' },
  pickHint: { zh: '之后随时可以在右上角切换', en: 'You can change it any time from the top bar', ms: 'Anda boleh menukarnya bila-bila masa di bar atas' },

  home: { zh: '首页', en: 'Home', ms: 'Utama' },
  stageN: { zh: '阶段 {n}', en: 'Stage {n}', ms: 'Peringkat {n}' },
  chapterN: { zh: '第 {n} 章', en: 'Chapter {n}', ms: 'Bab {n}' },
  chaptersCount: { zh: '{n} 章', en: '{n} chapters', ms: '{n} bab' },
  progress: { zh: '已读 {done}/{total}', en: '{done} of {total} read', ms: '{done}/{total} dibaca' },
  continueReading: { zh: '继续上次阅读', en: 'Continue reading', ms: 'Sambung membaca' },
  startHere: { zh: '从第一章开始', en: 'Start with Chapter 1', ms: 'Mula dengan Bab 1' },
  newTerms: { zh: '本章新名词', en: 'New in this chapter', ms: 'Istilah baharu bab ini' },
  advanced: { zh: '进阶', en: 'Going deeper', ms: 'Lanjutan' },
  sources: { zh: '本章来源', en: 'Sources for this chapter', ms: 'Sumber bab ini' },
  prev: { zh: '上一章', en: 'Previous', ms: 'Sebelumnya' },
  next: { zh: '下一章', en: 'Next', ms: 'Seterusnya' },
  markRead: { zh: '标记为已读', en: 'Mark as read', ms: 'Tanda sudah dibaca' },
  isRead: { zh: '已读', en: 'Read', ms: 'Sudah dibaca' },
  detailIn: { zh: '详见第 {n} 章', en: 'Explained in Chapter {n}', ms: 'Diterangkan dalam Bab {n}' },
  openChapter: { zh: '打开这一章', en: 'Open the chapter', ms: 'Buka bab' },
  close: { zh: '关闭', en: 'Close', ms: 'Tutup' },
  schematic: { zh: '示意图', en: 'Schematic', ms: 'Ilustrasi' },
  source: { zh: '来源', en: 'Source', ms: 'Sumber' },
  needsNet: { zh: '需要网络', en: 'Needs internet', ms: 'Perlu internet' },

  noteTip: { zh: '小提示', en: 'Tip', ms: 'Tip' },
  noteWarn: { zh: '注意', en: 'Caution', ms: 'Awas' },
  noteKey: { zh: '重点', en: 'Key point', ms: 'Perkara utama' },
  noteMyth: { zh: '常见误解', en: 'Common misconception', ms: 'Salah faham biasa' },

  search: { zh: '搜索', en: 'Search', ms: 'Cari' },
  searchHint: { zh: '搜索章节和名词（三种语言都可以）', en: 'Search chapters and terms, in any of the three languages', ms: 'Cari bab dan istilah, dalam mana-mana tiga bahasa' },
  noResults: { zh: '找不到结果', en: 'No results', ms: 'Tiada hasil' },

  tools: { zh: '工具', en: 'Tools', ms: 'Alatan' },
  glossary: { zh: '名词词典', en: 'Glossary', ms: 'Glosari' },
  abbr: { zh: '缩写表', en: 'Abbreviations', ms: 'Singkatan' },
  conceptMap: { zh: '名词地图', en: 'Concept map', ms: 'Peta konsep' },
  flashcards: { zh: '名词闪卡', en: 'Flashcards', ms: 'Kad imbas' },
  quiz: { zh: '自测题', en: 'Self-test', ms: 'Uji diri' },
  notebook: { zh: '我的笔记本', en: 'My notebook', ms: 'Buku nota saya' },
  notebookHint: { zh: '你收藏的章节、书签、划线和笔记都在这里，只存在这部手机上，离线也能用。', en: 'Your favourite chapters, bookmarks, highlights and notes, all in one place. They are saved on this device only and work offline.', ms: 'Bab kegemaran, penanda buku, serlahan dan nota anda di satu tempat. Disimpan pada peranti ini sahaja dan berfungsi luar talian.' },
  notebookEmpty: { zh: '还没有内容。在章节里点 ☆ 收藏、点 🔖 加书签，或选取文字来划线和写笔记。', en: 'Nothing yet. In a chapter, tap ☆ to favourite, 🔖 to bookmark a section, or select text to highlight it and add a note.', ms: 'Belum ada apa-apa. Dalam bab, ketik ☆ untuk kegemaran, 🔖 untuk menanda bahagian, atau pilih teks untuk menyerlah dan menambah nota.' },
  favourites: { zh: '收藏的章节', en: 'Favourite chapters', ms: 'Bab kegemaran' },
  favourite: { zh: '收藏这一章', en: 'Add chapter to favourites', ms: 'Tambah bab ke kegemaran' },
  unfavourite: { zh: '取消收藏', en: 'Remove from favourites', ms: 'Buang daripada kegemaran' },
  bookmarks: { zh: '书签', en: 'Bookmarks', ms: 'Penanda buku' },
  addBookmark: { zh: '为这一节加书签', en: 'Bookmark this section', ms: 'Tanda bahagian ini' },
  removeBookmark: { zh: '取消书签', en: 'Remove bookmark', ms: 'Buang penanda' },
  highlights: { zh: '划线与重点', en: 'Highlights', ms: 'Serlahan' },
  highlight: { zh: '荧光笔', en: 'Highlight', ms: 'Serlah' },
  underline: { zh: '画底线', en: 'Underline', ms: 'Garis bawah' },
  colour_yellow: { zh: '黄', en: 'yellow', ms: 'kuning' },
  colour_green: { zh: '绿', en: 'green', ms: 'hijau' },
  colour_pink: { zh: '粉红', en: 'pink', ms: 'merah jambu' },
  colour_blue: { zh: '蓝', en: 'blue', ms: 'biru' },
  addNote: { zh: '划线并写笔记', en: 'Highlight and add a note', ms: 'Serlah dan tambah nota' },
  editNote: { zh: '编辑笔记', en: 'Edit note', ms: 'Sunting nota' },
  removeMark: { zh: '删除划线', en: 'Remove highlight', ms: 'Buang serlahan' },
  noteOnMark: { zh: '这段文字的笔记', en: 'Note on this passage', ms: 'Nota untuk petikan ini' },
  notePlaceholder: { zh: '写下你的想法、记忆口诀或考试重点…', en: 'Your thoughts, a memory aid, an exam point…', ms: 'Fikiran anda, cara mengingat, poin peperiksaan…' },
  myNotes: { zh: '我的笔记', en: 'My notes', ms: 'Nota saya' },
  chapterNoteHint: { zh: '这一章的笔记（自动保存）', en: 'Notes for this chapter (saved automatically)', ms: 'Nota untuk bab ini (disimpan secara automatik)' },
  markHint: { zh: '选取文字可以划线、画底线或写笔记；点 🔖 为一节加书签，点 ☆ 收藏整章。', en: 'Select text to highlight, underline or add a note; tap 🔖 to bookmark a section and ☆ to favourite the chapter.', ms: 'Pilih teks untuk menyerlah, menggaris bawah atau menambah nota; ketik 🔖 untuk menanda bahagian dan ☆ untuk menggemari bab.' },
  save: { zh: '保存', en: 'Save', ms: 'Simpan' },
  saved: { zh: '已保存', en: 'Saved', ms: 'Disimpan' },
  exportNotes: { zh: '导出全部笔记', en: 'Export all notes', ms: 'Eksport semua nota' },
  hormones: { zh: '激素对照表', en: 'Hormone comparison', ms: 'Perbandingan hormon' },
  essays: { zh: '问答题复习', en: 'Essay-question review', ms: 'Ulang kaji soalan esei' },
  essaysHint: {
    zh: '期末考常见的问答题方向。先自己在纸上写提纲、画图，再点开看参考要点。',
    en: 'The kinds of long-answer questions finals tend to ask. Outline and sketch your answer on paper first, then open the key points.',
    ms: 'Jenis soalan jawapan panjang yang biasa keluar dalam peperiksaan akhir. Tulis rangka dan lakar jawapan di atas kertas dahulu, kemudian buka perkara utama.',
  },
  showOutline: { zh: '看参考要点', en: 'Show key points', ms: 'Tunjuk perkara utama' },
  examUnit: { zh: '对应期中考 {n}', en: 'Midterm {n} material', ms: 'Bahan Ujian Pertengahan {n}' },

  info: { zh: '关于', en: 'About', ms: 'Perihal' },
  share: { zh: '分享', en: 'Share', ms: 'Kongsi' },
  shareHint: { zh: '扫描二维码，用浏览器直接打开这个 App', en: 'Scan to open the app in a browser', ms: 'Imbas untuk membuka aplikasi dalam pelayar' },
  shareButton: { zh: '分享链接', en: 'Share link', ms: 'Kongsi pautan' },
  copyLink: { zh: '复制链接', en: 'Copy link', ms: 'Salin pautan' },
  copied: { zh: '已复制', en: 'Copied', ms: 'Disalin' },
  createdBy: { zh: 'Apps created by Bryan Woo', en: 'Apps created by Bryan Woo', ms: 'Apps created by Bryan Woo' },
  version: { zh: '版本', en: 'Version', ms: 'Versi' },
  offline: { zh: '离线', en: 'Offline', ms: 'Luar talian' },
  offlineReady: { zh: '已可离线使用', en: 'Ready to use offline', ms: 'Sedia digunakan luar talian' },
  offlineNotYet: { zh: '尚未完成离线下载', en: 'Offline download not finished yet', ms: 'Muat turun luar talian belum selesai' },
  contents: { zh: '目录', en: 'Contents', ms: 'Kandungan' },
  allSources: { zh: '资料来源', en: 'Sources', ms: 'Sumber' },

  updateReady: { zh: '有新版本', en: 'A new version is ready', ms: 'Versi baharu sedia' },
  updateNow: { zh: '立即更新', en: 'Update now', ms: 'Kemas kini sekarang' },
  updatedTo: { zh: '已更新到 v{v}', en: 'Updated to v{v}', ms: 'Dikemas kini ke v{v}' },
  allUpdates: { zh: '更新记录', en: "What's new", ms: 'Apa yang baharu' },
  ok: { zh: '好的', en: 'OK', ms: 'OK' },

  langButton: { zh: '切换语言', en: 'Change language', ms: 'Tukar bahasa' },
  themeButton: { zh: '切换深浅色', en: 'Change theme', ms: 'Tukar tema' },
  scaleButton: { zh: '字体大小', en: 'Text size', ms: 'Saiz teks' },
  more: { zh: '更多', en: 'More', ms: 'Lagi' },
  loading: { zh: '载入中…', en: 'Loading…', ms: 'Memuatkan…' },
  loadError: { zh: '内容载入失败', en: 'Could not load this page', ms: 'Gagal memuatkan halaman ini' },
};
