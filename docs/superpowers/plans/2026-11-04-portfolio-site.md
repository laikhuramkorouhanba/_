# Portfolio Home Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the approved one-page portfolio design as a Vite site that matches `prototype/index.html` exactly and deploys to GitHub Pages.

**Architecture:** Static `index.html` markup and one `src/styles.css` (both lifted from the prototype), plus small ES modules, one per behaviour: content, story, intro, globe, shelf, cursor. Each module exports a pure helper (unit tested in jsdom) and an `init*` function wired in `src/main.js`. Playwright checks the built page in a real browser.

**Tech Stack:** Vite 5, vanilla JS (ES modules), Vitest 2 + jsdom, Playwright 1.x, GitHub Actions + GitHub Pages.

**Spec:** `HANDOFF.md` (the reference behaviour is `prototype/index.html`; read both).

## Global Constraints

- The repo is `laikhuramkorouhanba/_`, served at `https://laikhuramkorouhanba.github.io/_/`. Vite `base: '/_/'`.
- No UI framework. No runtime dependencies except Google Fonts' Inter Tight (weights 400, 500, 600).
- The prototype's copy is final. Story lines, book data, footer text and links are copied verbatim from `prototype/index.html` (`GREETINGS`, `CHAPTERS`, `REPOS`, `BOOK_LOOKS`, `COVER_FIGURES`).
- The CSS, colours and sizes are copied from the prototype's `<style>` and inline styles. No restyling.
- Breakpoint 760px. Max width 1440px. Gutter 32px (16px on phones).
- No em dashes in any copy or commit message. Commit messages: one line, under 50 characters, lowercase, with a type prefix (`feat`, `fix`, `test`, `docs`, `chore`).
- Respect `prefers-reduced-motion: reduce`: no intro, no drift, no reveals, no cue loop.

## Review Focus

1. **Phone load must not jump:** opening the page on a 390px screen must leave it scrolled to the top. Book 1 opens on load without calling `scrollIntoView`. Only a user's tap scrolls the shelf. (Tested in Task 5 and Task 7.)
2. **Subpath assets:** every asset and link works under `/_/` on GitHub Pages, not just at `/`. (Tested in Task 7 with `vite preview --base`.)
3. **Browsers without scroll-driven animation** (Firefox today): story lines must be fully visible, not stuck faded. The reveal CSS stays inside `@supports (animation-timeline: view())`. (Tested in Task 7.)
4. **Reduced motion:** the intro must never cover the page, and all content must show. (Tested in Task 3 and Task 7.)
5. **No sideways scroll on phones:** at 390px wide, `document.documentElement.scrollWidth` must equal the viewport width (the drifting name and the shelf are clipped or scroll inside their own box). (Tested in Task 7.)

---

### Task 1: Scaffold, styles and static markup

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/styles.css`, `src/main.js`, `public/.nojekyll`
- Test: `tests/unit/smoke.test.js`
- Delete: the old template site files at the repo root (keep `README.md`, `.git`, `.github` if present)

**Interfaces:**
- Produces: element ids the later tasks rely on: `#root`, `#tag`, `#intro`, `#word`, `#globe`, `#chapters`, `#shelf`, `#shelf-row`, `#detail`, `#d-lang`, `#d-title`, `#d-repo`, `#d-desc`, `#d-link`. Classes: `.mode-free` and `.mode-project` on `#root`, `.story-row`, `.rv`, `.slot`, `.b3d`, `.face`, `.grain`, `.intro.leave`.

- [ ] **Step 1: Init the project.** Create `package.json` with scripts `dev: vite`, `build: vite build`, `preview: vite preview`, `test: vitest run`, `e2e: playwright test`. Dev dependencies: `vite@^5`, `vitest@^2`, `jsdom@^25`, `@playwright/test@^1`. Add `vite.config.js` with `base: '/_/'` and a `test: { environment: 'jsdom' }` block.
- [ ] **Step 2: Write the failing test** `tests/unit/smoke.test.js`: load `index.html` into jsdom and assert that every id listed in Interfaces exists, and that `document.title === 'Korouhanba Khuman'`.
- [ ] **Step 3: Run** `npm test`. Expected: FAIL (no index.html).
- [ ] **Step 4: Create `index.html`** from `prototype/index.html`'s `<head>` and `<body>` markup (everything except the inline `<script>`), with `<link rel="stylesheet" href="/src/styles.css">` and `<script type="module" src="/src/main.js"></script>`. Move the prototype's `<style>` block into `src/styles.css` unchanged. `src/main.js` is empty for now. Add an empty `public/.nojekyll`.
- [ ] **Step 5: Run** `npm test` (PASS) and `npm run build`. Expected: `dist/index.html` exists and its asset URLs start with `/_/`.
- [ ] **Step 6: Commit:** `git commit -m "chore: scaffold vite site from prototype"`

### Task 2: Content and story

**Files:**
- Create: `src/content.js`, `src/story.js`
- Modify: `src/main.js`
- Test: `tests/unit/story.test.js`

**Interfaces:**
- Produces: `content.js` exports `GREETINGS: string[]`, `CHAPTERS: string[]`, `REPOS: {title, subtitle, repo, lang, desc, url}[]`, `BOOK_LOOKS: {bg, fg, W, H}[]`, `COVER_FIGURES: string[]`, all copied verbatim from the prototype.
- Produces: `story.js` exports `renderStory(host: HTMLElement, lines: string[]): void`.

- [ ] **Step 1: Write the failing tests:**
  - `CHAPTERS.length === 7`, and `CHAPTERS[0] === 'Raised in Manipur, in the far north east of India.'`
  - `CHAPTERS[6] === 'And the aim has always been the same: make the complicated feel effortless.'`
  - `GREETINGS` equals `['Hello','Bonjour','नमस्ते','Khurumjari','こんにちは','Hola','Ciao','Hello']`
  - `REPOS.length === 6`, `BOOK_LOOKS.length === 6`, `COVER_FIGURES.length === 6`
  - After `renderStory(host, CHAPTERS)`, `host.querySelectorAll('.story-row.rv p').length === 7`, and the text of each `p` equals the matching line (set with `textContent`, not HTML).
  - No string in `CHAPTERS` or `REPOS` contains the em dash character `—`.
- [ ] **Step 2: Run** `npm test`. Expected: FAIL.
- [ ] **Step 3: Implement** `content.js` (copy the data) and `renderStory` (same row and `p` inline styles as the prototype's story block). Call `renderStory(document.getElementById('chapters'), CHAPTERS)` in `main.js`.
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit:** `git commit -m "feat: story content and rendering"`

### Task 3: Welcome intro

**Files:**
- Create: `src/intro.js`
- Modify: `src/main.js`
- Test: `tests/unit/intro.test.js`

**Interfaces:**
- Consumes: `GREETINGS` from Task 2.
- Produces: `runIntro(overlay: HTMLElement, wordEl: HTMLElement, words: string[], opts?: { reducedMotion?: boolean }): void`

- [ ] **Step 1: Write the failing tests** (`vi.useFakeTimers()`):
  - At 0 ms the word is `'Hello'`. After 750 ms it is `'Bonjour'`. After 170 ms more it is `'नमस्ते'`.
  - After the last word (`words.length - 1` steps, the last holding 520 ms), `overlay.classList.contains('leave')` is true. 950 ms later, `overlay.isConnected` is false.
  - With `{ reducedMotion: true }`, the overlay is removed right away and no timers are queued (`vi.getTimerCount() === 0`).
- [ ] **Step 2: Run** `npm test`. Expected: FAIL.
- [ ] **Step 3: Implement `runIntro`** with the prototype's timings (750 ms first, 170 ms per word, 520 ms on the last, 950 ms removal). In `main.js`, pass `reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches`.
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit:** `git commit -m "feat: multilingual welcome intro"`

### Task 4: Globe

**Files:**
- Create: `src/globe.js`, `src/data/land-dots.json` (copy of `data/land-dots.json`)
- Test: `tests/unit/globe.test.js`

**Interfaces:**
- Produces: `project(lon: number, lat: number, lam0: number, phi0: number, R: number, cx: number, cy: number): [x: number, y: number, depth: number]` (angles in degrees; `depth > 0` means the point faces the viewer).
- Produces: `globeView(nowMs: number): { lon0: number, lat0: number }`: `t = (sin(now/3200)+1)/2`, `e = t*t*(3-2t)`, `lon0 = 93.94 + (2.35-93.94)*e`, `lat0 = 24 + 14*e`.
- Produces: `drawGlobe(canvas: HTMLCanvasElement, nowMs: number): void` (pixel output identical to the prototype's `drawGlobe`).

- [ ] **Step 1: Write the failing tests:**
  - `project(93.94, 24.82, 93.94, 24.82, 58, 64, 64)` returns x ≈ 64 and y ≈ 64 (±0.5), with depth ≈ 1.
  - A point on the far side, `project(-86.06, -24.82, 93.94, 24.82, 58, 64, 64)`, has `depth < 0`.
  - `globeView(-Math.PI/2*3200)` gives lon0 ≈ 93.94 and lat0 ≈ 24. `globeView(Math.PI/2*3200)` gives lon0 ≈ 2.35 and lat0 ≈ 38.
  - The land data has an even length, 2652.
- [ ] **Step 2: Run** `npm test`. Expected: FAIL.
- [ ] **Step 3: Implement** by porting the prototype's `drawGlobe` into these three functions, importing the land data as JSON.
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit:** `git commit -m "feat: dotted globe manipur to paris"`

### Task 5: The shelf

**Files:**
- Create: `src/shelf.js`
- Modify: `src/main.js`
- Test: `tests/unit/shelf.test.js`

**Interfaces:**
- Consumes: `REPOS`, `BOOK_LOOKS`, `COVER_FIGURES` from Task 2.
- Produces: `bookGeometry(i: number): { W: number, H: number, C: number, openWidth: number }` where `C = Math.round(H*0.68)` and `openWidth = Math.round(C*0.985 + W*0.18) + 24`.
- Produces: `createShelf(row: HTMLElement, detail: { lang, title, repo, desc, link }: Record<string, HTMLElement>, opts?: { isPhone?: () => boolean }): { pick(i: number, fromUser?: boolean): void }`

- [ ] **Step 1: Write the failing tests:**
  - `bookGeometry(0)` gives `{ W: 62, H: 420, C: 286, openWidth: 317 }`.
  - `bookGeometry(1)` gives `{ W: 74, H: 450, C: 306, openWidth: 339 }`.
  - After `createShelf(...)`, there are 6 `.slot` elements, and only slot 0's button has `aria-pressed="true"`. Its transform is `rotateY(80deg)` and its slot width is `317px`. The details show `'Churn'` and link to `https://github.com/laikhuramkorouhanba/churn-streamlit`.
  - `pick(2, true)` opens slot 2, closes slot 0 (`aria-pressed="false"`, `rotateY(0deg)`, width `62px`) and shows `'Murmur'`.
  - Titles are set with `textContent`: a repo title of `'<b>x</b>'` renders as literal text.
  - **Review Focus 1:** with `isPhone: () => true`, creating the shelf calls `scrollIntoView` zero times (spy on `Element.prototype.scrollIntoView`). Clicking slot 3's button calls it once after 720 ms (fake timers).
- [ ] **Step 2: Run** `npm test`. Expected: FAIL.
- [ ] **Step 3: Implement** by porting the prototype's `Shelf` module: the same face markup and inline styles, built per book, with text set via `textContent`. Wire it in `main.js` with `isPhone: () => innerWidth < 761`.
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit:** `git commit -m "feat: 3d bookshelf of projects"`

### Task 6: Cursor label and animation loop

**Files:**
- Create: `src/cursor.js`
- Modify: `src/main.js`
- Test: `tests/unit/cursor.test.js`

**Interfaces:**
- Consumes: `drawGlobe` from Task 4.
- Produces: `initCursor(root: HTMLElement, tag: HTMLElement, targets: HTMLElement[]): { step(): void }`. `step()` moves the label 22% of the way to the last pointer position. The label's position starts at the first pointer position seen.

- [ ] **Step 1: Write the failing tests:**
  - `root.className` starts as `'mode-free'`. A `mouseenter` on a target sets it to `'mode-project'`, and a `mouseleave` sets it back.
  - After a first `mousemove` to (0, 0), then a `mousemove` to (100, 200) and one `step()`, the tag's transform is `translate(22px,44px) translate(-50%,-50%)`.
- [ ] **Step 2: Run** `npm test`. Expected: FAIL.
- [ ] **Step 3: Implement.** In `main.js`, run one `requestAnimationFrame` loop that calls `cursor.step()` and `drawGlobe(globeCanvas, now)`. The targets are `#shelf` and `#d-link`.
- [ ] **Step 4: Run** `npm test`. Expected: PASS.
- [ ] **Step 5: Commit:** `git commit -m "feat: see the project cursor label"`

### Task 7: Browser checks against the prototype

**Files:**
- Create: `playwright.config.js`, `tests/e2e/site.spec.js`

**Interfaces:**
- Consumes: the built site (`npm run build && npx vite preview --port 4173`) served at `http://localhost:4173/_/`.

- [ ] **Step 1: Write the e2e tests:**
  - **No errors:** the page loads at `/_/` with no `pageerror` and no failed requests other than Google Fonts.
  - **Review Focus 2:** every `<script>` and `<link rel=stylesheet>` URL starts with `/_/` or `https://fonts.`.
  - **Review Focus 1:** at 390x844, `window.scrollY === 0` after 3.5 s.
  - **Review Focus 5:** at 390x844, `document.documentElement.scrollWidth === 390`.
  - **Review Focus 3:** with Firefox (or with the `rv` animation disabled), every `.story-row p` has a computed opacity of `'1'` once scrolled into view.
  - **Review Focus 4:** with `reducedMotion: 'reduce'`, `#intro` is gone from the page within 100 ms and the hero heading is visible.
  - **Shelf:** clicking the third book shows `'Murmur'` in `#d-title`.
  - **Visual parity:** screenshot the hero at 1440x900 and the shelf after opening book 3, at 1440x900 and 390x844. Compare them by eye with the same shots of `prototype/index.html`. Any difference beyond font loading is a bug.
- [ ] **Step 2: Run** `npm run build && npm run e2e`. Expected: all PASS. Fix any failure in the module that owns it.
- [ ] **Step 3: Commit:** `git commit -m "test: e2e checks against prototype"`

### Task 8: Deploy to GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write the workflow.** On a push to `main`: checkout, setup Node 20, `npm ci`, `npm test`, `npm run build`, then `actions/upload-pages-artifact` with `path: dist` and `actions/deploy-pages`. Permissions: `pages: write`, `id-token: write`.
- [ ] **Step 2:** In the repo settings, set Pages to **Source: GitHub Actions** (this one is manual; ask Korouhanba).
- [ ] **Step 3: Push and verify.** The action goes green, and `https://laikhuramkorouhanba.github.io/_/` shows the intro, the globe turns, and a book opens on click.
- [ ] **Step 4: Commit:** `git commit -m "chore: deploy to github pages"`

After launch, work through HANDOFF.md's **Open items** with Korouhanba (real repos, the greeting's spelling, analytics, self-hosting the font).
