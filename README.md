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
- **Study tools**: favourite chapters (★), bookmark sections (🔖), select text
  to highlight in four colours or underline, attach a note to any mark, and a
  free note per chapter. Everything appears in the **Notebook**, which can be
  exported as plain text. All of it stays on the device.
- **Revision**: glossary, hormone table, 14 essay-question outlines,
  flashcards, stage quizzes with explanations, search across all three
  languages.
- **House conventions**: first-run language picker (default English), 中 → EN →
  BM toggle that keeps your place, light / dark / auto theme, AAA reading
  scale, offline after the first visit, auto-updating service worker with a
  "what's new" sheet, QR-code / share / copy-link page, Info page.

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
three languages, every widget, highlights surviving a reload, quiz, share
page…).

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
