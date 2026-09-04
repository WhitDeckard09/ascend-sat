# Ascend — a Duolingo-shaped SAT tutor

**Live: https://whitdeckard09.github.io/ascend-sat/**

On iPhone, open that link in Safari and tap **Share → Add to Home Screen**. It
launches fullscreen with no browser chrome and its own icon, like a native app.
Progress is stored in your browser, so each device keeps its own streak.


A gamified SAT study app. You tell it how long you have, what score you want, and
your name; it generates two lesson trails — Reading & Writing and Math — and
walks you down whichever one you pick. Every lesson is 12 questions split into two
adaptive modules, the same structure as the real digital SAT. Runs entirely in the
browser, saves to `localStorage`, no account, no server.

```bash
npm install
npm run dev      # http://localhost:5180
npm test         # bank, planner, extend, grading, streak
npm run build
```

Pushing to `main` runs the tests and redeploys via GitHub Actions
(`.github/workflows/deploy.yml`). The site is served from `/ascend-sat/`, which
is why `vite.config.ts` sets `base` — change it if the repo is ever renamed.

On your phone: open the dev URL on the same Wi-Fi (or `npm run build && npm run
preview`), then **Share → Add to Home Screen**. It launches fullscreen with no
browser chrome.

## How faithful it is to the real test

The blueprint is taken from College Board's published specifications, not
guessed:

| | Reading & Writing | Math |
|---|---|---|
| Domains | Craft & Structure 28%, Information & Ideas 26%, Standard English Conventions 26%, Expression of Ideas 20% | Algebra 35%, Advanced Math 35%, Problem-Solving & Data 15%, Geometry & Trig 15% |
| Format | 1 short passage (25–150 words) per question, all multiple choice | ~75% multiple choice, ~25% student-produced response (grid-ins) |

The real test runs two modules per section — 27 questions each for R&W, 22 for
Math — where module 1 is a broad difficulty mix and module 2 gets harder or
easier based on how you did. A lesson here compresses that into **6 + 6**: it
keeps the adaptive mechanic and the 12-question ceiling that makes a session
finishable.

## The parts worth knowing about

**`src/engine/planner.ts` — plan generation.** Available time sets the lesson
count (`weeks × 5 days × daily minutes ÷ 11 min per lesson`, clamped to 12–90).
The goal score sets *which* domains get the surplus: at 1150 the plan front-loads
grammar and linear algebra, where the fastest points are; at 1550 it shifts to
Craft & Structure and Advanced Math, where the hardest questions live.

The plan splits into **two independent trails**, one per section, so you can
spend a day on just Math. Splitting changes where lessons live, not how many
there are. The two sections are apportioned *separately*, each getting half the
budget — doing it in one pass over all eight domains let rounding drift the split
(27 lessons came out 15/12 because every remainder fell to R&W). Within a trail,
domains rotate so you never get eight grammar lessons in a row.

**`src/engine/rating.ts` — skill tracking.** Each of the 8 domains carries a
0–100 rating updated per question with an Elo rule. Getting an easy question
right barely moves it; a hard one moves it a lot. This is what reproduces the
real test's behaviour where an easier second module caps your ceiling — you can
answer easy questions perfectly forever and still not project 1500. Early
projections are blended toward a goal-derived prior so they don't swing wildly on
day one.

**`src/engine/selection.ts` — question selection.** Picks a difficulty mix per
tier, avoids questions you've already seen until the pool runs dry, then falls
back to least-recently-seen. Caps grid-ins at 2 per half-module, because the bank
runs 38% SPR while the real test is ~25%.

**Alignment.** Every icon is drawn so its bounding box centres exactly on
`12,12` in the 24×24 box — the star is generated from pentagon math rather than
hand-plotted, because a 5-point star's box is not symmetric about its centroid.
The path's current-node halo carries the same 6px bottom edge as the button it
surrounds, so the two 3D discs stay concentric; a flat ring sits visibly high
against a button that has a drop edge.

**`src/engine/streak.ts` — streaks.** Consecutive days, freezes earned every 5th
day that forgive one missed day. Pure functions, so the date edge cases (DST, new
year, month rollover) are actually tested.

## The question bank

258 hand-written questions in `src/data/questions/`, tagged by domain, sub-skill,
and difficulty. Every one has a worked explanation, and most have a `trap` note
naming why the most seductive wrong answer is wrong — that note is what shows up
in the recap.

Coverage per domain: 36 / 36 / 36 / 30 for the four R&W domains, 36 / 36 / 24 /
24 for Math, split evenly across easy/medium/hard. Minimum pool for any
domain-difficulty pair is 8, which is enough that a single lesson never repeats.

`npm test` checks the bank structurally: no duplicate ids, exactly 4 choices per
multiple-choice question, valid answer indices, grid-ins with accepted-answer
lists, and no leftover drafting text. It also builds all 260 possible plans and
asserts the two trails stay within one lesson of each other, contain only their
own section's domains, and never share a lesson id.

## The two trails

A segmented toggle at the top of the Learn tab switches between them — book for
Reading & Writing, radical for Math — and shows how far along each one you are.
The choice persists across reloads. Each trail has its own palette (blue/purple
for R&W, green/orange for Math) so the two feel distinct, and lesson ids are
namespaced per trail (`rw-u0-l0`, `math-u0-l0`) so completion never collides.

Gold is deliberately absent from unit banners: white text on `#FFC800` is
unreadable.

## Adding more lessons

**Settings → Add more lessons** has a stepper per trail: pick how many Reading &
Writing and how many Math lessons to append, up to 20 of each at a time and 250
in the plan overall.

New lessons fill any partial final unit before opening a new one, and a unit that
reaches five gains a review as its last step — the same rule the initial build
follows. Which domains they cover is decided by *deficit*: each new lesson goes to
whichever domain is furthest below its blueprint share of that trail so far, so a
trail stays proportionally correct no matter how many times it is extended.

Extending never renumbers or reorders an existing lesson, because completion is
keyed by lesson id — `tests/extend.test.mjs` asserts that explicitly, along with
id uniqueness, the unit-filling rules, and that the input plan is not mutated.

## Onboarding

Three questions: name, how long you have, and a goal score set with a slider —
1000 to 1600 in steps of 50. It's a native `<input type="range">` under the
chunky styling, so arrow keys, touch drag, and screen readers all work; the value
snaps to the step and clamps at both ends.

## On the Duolingo resemblance

Game mechanics — streaks, XP, hearts, a node path, unit banners — aren't
protectable, and copying them is fine. What *is* protected is the specific trade
dress: Duo the owl, the Feather Bold typeface, the logo. So the mascot here is
**Ace**, a pencil, drawn from scratch as inline SVG, and the typeface is Nunito
(open source, and the closest free relative of Feather). The palette is built
around the same chunky, saturated, hard-bottom-edge language without lifting
Duolingo's exact hex values.

## Icons

Ace is drawn as inline SVG and rasterised to PNG for the places that need it:
`apple-touch-icon.png` (180px, opaque — iOS paints black behind transparency),
`icon-192/512.png` for the web manifest, and a 32px favicon. The maskable icon
keeps him inside the central 80% safe circle so Android's crop never clips him;
the tab favicon uses a tighter crop, since 16px leaves no room for margins.

## Structure

```
src/
  data/         types.ts (SAT taxonomy) · bank.ts (index) · questions/ (8 files)
  engine/       planner · rating · selection · answers (grading) · streak · sound
  store/        store.ts — state, localStorage, hearts, XP
  screens/      Onboarding · Path · Lesson · Recap · Stats · Review · Settings
  components/   Mascot · TopBar · QuestionBody · ui · icons
tests/          bank · planner · extend · grading · streak
```

## Known limits

- **Finite bank.** 258 questions is enough for a 40-lesson plan without heavy
  repeats, but a 90-lesson plan will revisit questions. Selection handles this
  gracefully (least-recently-seen first) rather than breaking.
- **No figures.** Geometry questions are worded to avoid needing a diagram, and
  data questions use tables rather than scatterplots.
- **The projected score is an estimate,** calibrated to feel directionally right,
  not a concordance with a real scaled score.
- **A save from before the trails were split** is migrated automatically: the plan
  is rebuilt from the stored profile and ratings, XP, streak and misses all carry
  over, but path position resets because lesson ids changed.
