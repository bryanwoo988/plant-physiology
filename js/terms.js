/* The glossary: lookups, the term sheet, and the "new in this chapter" box. */

import { pick, t } from './i18n.js';
import { el, loadData } from './content.js';

let byId = null;

export async function loadTerms() {
  if (!byId) byId = new Map((await loadData('terms')).map(x => [x.id, x]));
  return byId;
}

export const termById = id => byId?.get(id);

const cid = n => `ch${String(n).padStart(2, '0')}`;

// Bottom sheet with a one-line definition and a link to where it is taught.
export function openTermSheet(id, { lang, openSheet, currentChapter }) {
  const term = termById(id);
  if (!term) return;
  const here = currentChapter === term.chapter;
  openSheet(el('div', { class: 'term-sheet' },
    el('p', { class: 'term-sheet-kicker' }, t('detailIn', { n: term.chapter }, lang)),
    el('h3', {}, pick(term.name, lang), term.abbr ? el('span', { class: 'abbr' }, ` · ${term.abbr}`) : null),
    el('p', {}, pick(term.short, lang)),
    here ? null : el('a', { class: 'button', href: `#/ch/${cid(term.chapter)}` }, t('openChapter', null, lang))));
}

export function renderNewTerms(ids, { lang, onTerm }) {
  if (!ids?.length) return null;
  return el('aside', { class: 'new-terms' },
    el('p', { class: 'new-terms-label' }, t('newTerms', null, lang)),
    el('ul', {}, ids.map(id => {
      const term = termById(id);
      return el('li', {}, el('button', { class: 'chip', type: 'button', onclick: () => onTerm(id) }, term ? pick(term.name, lang) : id));
    })));
}
