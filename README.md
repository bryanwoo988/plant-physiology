# 植物生理学 · Plant Physiology

An offline, trilingual (中文 / English / Bahasa Melayu) course in plant
physiology — from water potential to flowering and secondary metabolites —
built for revising a three-midterm university course. A static PWA: no build
step, no npm dependencies, no CDN.

Live: <https://bryanwoo988.github.io/plant-physiology/>

## What is in it

- **28 chapters in 5 stages**, in a beginner order: each chapter uses only terms
  taught before it, and each is tagged with the midterm it belongs to
  (I, II, III). Water and solutes → membranes and nutrients → energy and
  photosynthesis → respiration, nitrogen and transport → growth, hormones,
  light, flowering and plant defence.
- **27 interactive figures you drag with a finger** — a cell in solution, the
  soil–plant–air water-potential ladder, the Nernst test, a nutrient-deficiency
  detective, ATP ΔG, pigment spectra, the Z-scheme, Calvin-cycle bookkeeping,
  pressure flow, light-response curves, C3 / C4 / CAM timelines, the Lockhart
  equation, polar auxin transport, hormone signalling switches, R / FR lettuce
  germination, night breaks, the ABC model, vernalization and more. All are
  redrawn; none is copied from a book or slide.
- **Highlights, notes, bookmarks, read aloud.** Tap any paragraph, list item,
  table row, key/value pair or note box to highlight or underline it in one of
  five colours, add a note, bookmark it, copy it, or start reading aloud from
  it. Those marks are keyed by chapter, section and position, so they stay on
  the same block in all three languages. Long-press to select just a few words
  instead: those marks are character offsets in that language and show only
  there; the Notes list says which. Read aloud uses the phone's own voices,
  paragraph by paragraph, and carries on into the next chapter (Malay falls
  back to an Indonesian voice). `js/reader.js` and `css/reader.css` are shared
  with OPWiki and Oil Palm Basics — keep all copies identical. Stored in the
  browser (`pphys.reader`); Settings exports and imports a backup. Marks and
  section bookmarks made before 1.2.0 are moved over once (`js/migrate.js`).
- **Bottom bar**: Contents, Read aloud, Notes (notes and highlights, plus the
  free note per chapter), Bookmarks (plus favourite chapters ★) and Settings
  (language, theme, text size, read-aloud voice and speed, notes backup, then
  version, offline status and sources). Search and the tools menu stay at the
  top.
- **Revision**: glossary, hormone table, 14 essay-question outlines,
  flashcards, stage quizzes with explanations, search across all three
  languages.
- **House conventions**: first-run language picker (default English);
  language, light / dark / auto theme and text size in Settings; offline after
  the first visit; auto-updating service worker with a "what's new" sheet;
  QR-code / share / copy-link page.

## Sources

Main text: Hopkins & Hüner, *Introduction to Plant Physiology* (4th ed., 2009),
cited by printed page number, with the course lecture notes. Where the lecture
slides and the textbook disagree the app follows the textbook and says so.
The book, slides and past papers are **not** in this repository; the text is
written afresh and every paragraph shows its sources in the app.

## Run it locally

```bash
python3 tools/serve.py
```

Open <http://127.0.0.1:4200/>. The service worker is skipped on localhost unless
you add `?sw=1`.

## Tests and checks

```bash
node --test 'tests/*.test.js'     # logic: plant maths, study layer, prefs, i18n, updates, SW, lint, quiz…
node tools/lint-content.mjs       # content: three languages, term order, sources, widgets, quiz
node tools/check-links.mjs        # every outside link still answers
```

Browser tests run at <http://127.0.0.1:4200/tests/> (overflow at 375 px in all
three languages, every widget, highlights and notes in every language, marks
moved over from before 1.2.0, read aloud, quiz, share page…).

## Editing content

Chapters are written as Python in `tools/content/chNN.py` and compiled to
`data/chNN.json`, `terms.json`, `sources.json` and `quiz.json`;
`tools/content/extras.py` writes the hormone table and essay outlines:

```bash
python3 tools/content/ch16.py && node tools/lint-content.mjs
node tools/build-sw.mjs           # refresh the precache list after any change
```

Inline markup: `{{t:water-potential}}` makes a tappable glossary term,
`{{ch:ch09|Chapter 9}}` a link to a chapter.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: lint → build the service
worker → tests → publish to GitHub Pages. A weekly workflow re-checks links.

## Licences

App code and original text © Bryan Woo.
