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
npm test         # bank, planner, extend, grading, streak, pace, commit
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
count at **one lesson a day** (two a day at the most intensive setting), so 30
days is 30 lessons and 360 questions. Sizing it from a minutes budget instead
produced a 12-lesson plan for a whole month.
The goal score sets *which* domains get the surplus: at 1150 the plan front-loads
grammar and linear algebra, where the fastest points are; at 1550 it shifts to
Craft & Structure and Advanced Math, where the hardest questions live.

The plan splits into **two independent trails**, one per section, so you can
spend a day on just Math. Splitting changes where lessons live, not how many
there are. The two sections are apportioned *separately*, each getting half the
budget — doing it in one pass over all eight domains let rounding drift the split
(27 lessons came out 15/12 because every remainder fell to R&W). Within a trail,
domains rotate so you never get eight grammar lessons in a row.

A plan is also capped at what the bank can actually serve. `trailCapacity` runs
the real allocator against the real question counts — not raw blueprint weights,
since apportionment has a one-lesson floor per domain and largest-remainder
rounding — and reserves one lesson per domain to absorb unit reviews, which draw
across every domain in their unit. When a timeframe asks for more than that, the
plan says so on the summary screen rather than quietly recycling questions.

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

**`src/engine/pace.ts` — the lesson clock.** Every lesson is timed, but nothing
about it appears while you work: no counter, no ticking bar, nothing to make a
hard question feel worse than it already does. The total lands on the recap.

What it measures is time *on questions* — the clock runs while a question is on
screen and stops the instant you hit Check, so reading an explanation is never
charged to your pace. It also stops while the tab is hidden, because a lesson
left open on a locked phone would otherwise report eight hours.

The number is compared against the real test's own budget, built from the
sections you actually answered: Reading & Writing allows 64 minutes for 54
questions, Math 70 for 44, so a twelve-question lesson is due 14:13 or 19:05
depending on the trail. Anything inside 10% reads as on pace. When a previous
lesson exists, the recap also says how much your per-question pace moved.

**`src/engine/streak.ts` — streaks.** Consecutive days, freezes earned every 5th
day that forgive one missed day. Pure functions, so the date edge cases (DST, new
year, month rollover) are actually tested.

## The question bank

**1,358 questions.** Enough that a 60-day plan — 60 lessons, 720 questions —
never serves the same question twice. `tests/norepeat.test.mjs` proves this by
driving the real selection engine through every plan the app can build, for both
a struggling student (who routes down into easy questions) and a strong one (who
routes up into hard ones), since the two exhaust different pools.

|  | Reading & Writing | Math |
|---|---|---|
| Questions | 458 | 900 |
| Source | hand-written | 120 hand-written, 780 generated |

**Reading & Writing is hand-written**, in `src/data/questions/rw-*.ts`. Passages
have to be composed; there is no templating a Craft & Structure question. Every
item carries a worked explanation, and most carry a `trap` note naming why the
most seductive wrong answer is wrong — that note is what surfaces in the recap.

**Math is mostly generated**, from ~60 parameterised templates in
`src/data/generate/`. Each template computes its own answer, so the arithmetic
cannot be wrong the way a hand-written item's can — and the distractors are built
from real error patterns (forgetting to flip an inequality when dividing by a
negative, treating a fractional exponent as multiplication, using the new value
as the base of a percent change). The 120 hand-written math questions remain
alongside them.

Generation is seeded and deterministic: a template key plus an index always
produces the same question. That matters because the app persists which question
ids a student has seen, so a bank that reshuffled itself between builds would
silently break repeat-avoidance.

`npm test` validates the whole bank structurally — no duplicate ids, exactly four
distinct choices per multiple-choice question, valid answer indices, grid-ins
with accepted-answer lists, skills that actually belong to their domain, and at
least four questions at every domain/difficulty pair.

## On the Duolingo resemblance

Game mechanics — streaks, XP, hearts, a node path, unit banners — aren't
protectable, and copying them is fine. What *is* protected is the specific trade
dress: Duo the owl, the Feather Bold typeface, the logo. So the mascot here is
**Ace**, a pencil, drawn from scratch as inline SVG, and the typeface is Nunito
(open source, and the closest free relative of Feather). The palette is built
around the same chunky, saturated, hard-bottom-edge language without lifting
Duolingo's exact hex values.

## Icon and mascot

**Ace**, the pencil, is both the in-app mascot and the app icon. He is inline SVG
in `src/components/Mascot.tsx` with five expressions, and the icon files are
generated from the same drawing: `apple-touch-icon.png` (180px, fully opaque —
iOS paints black behind any transparency), `icon-192/512.png` for the web
manifest, and a 32px favicon.

The maskable icon keeps him inside the central 80% safe circle so Android's crop
can't clip him; the tab favicon uses a tighter crop, since 16px leaves no room
for margins.

## Layout and viewport

The app shell is the only thing that scrolls. `body` is `100dvh` with
`overflow: hidden`, because `height: 100%` resolves against the *large* viewport
on mobile — the height with the URL bar hidden — which leaves the page taller
than the visible area and rubber-banding even where nothing overflows. Scroll
containers use `overscroll-behavior: contain` and `min-height: 0`, the latter
because a flex child will not shrink below its content without it.

`body` is white rather than the desktop letterbox grey: iOS Safari tints its top
chrome with the page background, so a grey body paints a grey bar above the app.
The letterbox grey lives on the shell element, where only a wide screen sees it.

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

## Icon and mascot

Two different marks, doing two different jobs.

**Ace**, the pencil, is the in-app mascot — he appears in onboarding, on the
recap, and when you run out of hearts. He is inline SVG in
`src/components/Mascot.tsx` with five expressions.

**The app icon** is the ascent mark: a rising chart stroke that breaks into a
rhombus, climbs to an arrowhead, and crosses a solid summit. It is generated
from a single 100×100 definition and rasterised to PNG for the places that need
it: `apple-touch-icon.png` (180px, fully opaque — iOS paints black behind any
transparency), `icon-192/512.png` for the web manifest, and a 32px favicon.

The maskable icon keeps the mark inside the central 80% safe circle so Android's
crop can't clip it; the tab favicon fills more of the frame, since 16px leaves no
room for margins.

## Structure

```
src/
  data/         types.ts (SAT taxonomy) · bank.ts (index)
                questions/  hand-written items
                generate/   parameterised math templates
  engine/       planner · rating · selection · answers (grading) · streak · pace · sound
  store/        store.ts — state, localStorage, hearts, XP
  screens/      Onboarding · Path · Lesson · Recap · Stats · Review · Settings
  components/   Mascot · TopBar · QuestionBody · ui · icons
tests/          bank · planner · norepeat · extend · grading · streak · pace · commit
```

## Known limits

- **The bank is finite.** 1,358 questions covers 60 days at a lesson a day with
  nothing repeated. A 90-day plan caps at 75 lessons rather than 90, and says so
  during onboarding. Settings → Add more lessons can push past it, at which point
  selection begins reusing least-recently-seen questions.
- **The bundle is 218 kB gzipped,** most of it the question bank, which loads up
  front. Splitting it per domain would help if that ever matters.
- **No figures.** Geometry questions are worded to avoid needing a diagram, and
  data questions use tables rather than scatterplots.
- **The projected score is an estimate,** calibrated to feel directionally right,
  not a concordance with a real scaled score.
- **A save from before the trails were split** is migrated automatically: the plan
  is rebuilt from the stored profile and ratings, XP, streak and misses all carry
  over, but path position resets because lesson ids changed.
