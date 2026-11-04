# Portfolio site: design handoff

The approved design for Korouhanba Khuman's portfolio home page, ready to build.

- **Reference:** `prototype/index.html`. Open it in a browser. It is the source of truth for look, copy and behaviour. The production site must match it.
- **Tokens:** `design/tokens.json`
- **Globe data:** `data/land-dots.json`
- **Build plan:** `docs/superpowers/plans/2026-11-04-portfolio-site.md`

## Goal

A one page site that presents Korouhanba for strategy, AI and product roles at elite firms (tech, hedge funds, consulting, luxury). It should feel quiet, confident and crafted: Swiss grotesk type at poster scale on a near black ground, with a few precise interactions.

## Stack and hosting

- Vite with vanilla JavaScript (ES modules) and one CSS file. No framework. three.js may be added later, so keep modules small and independent.
- Hosted on GitHub Pages from the existing repo `laikhuramkorouhanba/_`. The site is served under the `/_/` path, so Vite's `base` must be `'/_/'`.
- Deployed by a GitHub Action on every push to `main`.

## Page structure (top to bottom)

### 1. Welcome intro
- A full screen black overlay (fixed, above everything) shows one greeting at a time with a small white dot before it, centred, `clamp(40px, 6vw, 72px)`, weight 500.
- Sequence: `Hello, Bonjour, नमस्ते, Khurumjari, こんにちは, Hola, Ciao, Hello`. The first word holds for 750 ms, then each word for 170 ms. The last "Hello" holds for 520 ms.
- Then the overlay slides up off the screen over 900 ms (`cubic-bezier(.7,0,.2,1)`). Its bottom edge curves while it moves (bottom radii `50% 120px`). Remove it from the page after 950 ms.
- With reduced motion turned on, skip the intro entirely.

### 2. Header
- One row, 32px padding: "© Korouhanba" (links to top) on the left, "Strategy, AI and product, Paris" in muted grey in the middle, and nav links on the right: Story, Work, Contact (anchor links, smooth scroll).
- Phones: hide the middle line. Nav links get a 44px tap height.

### 3. Hero
- Left: a pill (bg-100, 1px line-100 border, fully rounded) holding "Raised in Manipur, / based in Paris" (15px, two lines) and a 64px off-white disc with the **globe** in it.
- Right: a "↘" arrow above the line "I find what matters, build it, and bring people along." (max 440px wide).
- Below, the name **"Korouhanba Khuman"** on one line at poster size, followed by a short horizontal bar (0.6em by 0.07em). It does not wrap. As the page scrolls through its first 1400px, the name slides left by 22% (CSS scroll-driven animation, `animation-timeline: scroll(root)`).
- Phones: the pill stacks above the intro line, and the name is `clamp(56px, 19vw, 96px)`.

### 4. Globe (inside the hero pill)
- A canvas drawn at 128x128 and shown at 64x64 (sharp on retina screens): an orthographic Earth made of dots, with dots from `data/land-dots.json` (1,326 land points on a 3° grid, stored flat as `[lon, lat, lon, lat, ...]`).
- The view eases back and forth between Manipur (93.94 E, 24.82 N) and Paris (2.35 E, 48.86 N): `t = (sin(now / 3200) + 1) / 2`, smoothstepped. Centre longitude goes from Manipur to Paris, centre latitude from 24° to 38°.
- Only dots on the near side are drawn, and their opacity rises toward the centre (`0.25 + 0.6 * depth`). A faint ring marks the edge of the sphere.
- Both cities get a 4.5px dark dot with a light outline, joined by a 2px great-circle arc that lifts slightly off the surface at its midpoint.
- The prototype's `drawGlobe(canvas, now)` is the exact reference.

### 5. Story
- No numbers and no section divider. It continues straight from the hero.
- It opens with a thin vertical line (1px by 120px, fading downward) that grows and fades on a 2.4 s loop as a scroll cue, then the muted lead-in **"A short story."** (20px).
- Then one sentence per row, `clamp(32px, 4.4vw, 64px)`, weight 500, wrapping at about 18em, starting at grid column 4. Every row has the same gap below it, `clamp(96px, 12vw, 176px)`, so short and long lines feel evenly paced.
- Each row fades in and rises 56px as it enters the screen (`animation-timeline: view()`, range `entry 5% cover 40%`). Where scroll-driven animation isn't supported, the text simply shows.
- **Copy, exactly:**
  1. Raised in Manipur, in the far north east of India.
  2. I took things apart long before I knew it was called engineering.
  3. Chennai taught me to build.
  4. Today I study data science and AI for business at École Polytechnique and HEC Paris.
  5. In strategy teams, I built tools that turned reports from dozens of countries into one clear picture for leadership.
  6. I care how things look and feel. Typefaces, buildings, album covers.
  7. And the aim has always been the same: make the complicated feel effortless.
- Phones: full width, 72px gaps, 72px cue line.

### 6. The shelf (Work)
- The heading "On the shelf" sits on the left, with "Each book is one of my public projects on GitHub. Take one down to open it." in muted grey on the right.
- A shelf nook: a dark panel lit softly from above (radial gradient) with inner shadows on the top and sides, ending in a plank (a 12px lit top with a 1px highlight, then a 22px front lip with a drop shadow). The row of books scrolls sideways if it overflows.
- **Each book is a real 3D box** (CSS `preserve-3d`, perspective 2200px) with three faces:
  - **Spine:** width W, height H, cloth colour, a vertical light gradient across it, film grain, two thin foil bands 40px from the top and the bottom, "KHUMAN" at the head (9px, tracked), the title running bottom to top (19px, weight 500), and the book number at the foot.
  - **Cover:** width C = round(H x 0.68), rotated -90°. It has a hinge shadow, grain, a fine inset frame, "KOROUHANBA KHUMAN" and the number at the top, a thin-line figure in the middle (one SVG path per book), and the title (40px) with a subtitle (15px, 75% opacity) at the bottom.
  - **Page edges:** rotated 90°, cream lines.
- Closed books stand spine-out and lift 12px on hover. Clicking a book turns it `rotateY(80deg)` over 700 ms to show its cover, while its slot widens to `round(C x 0.985 + W x 0.18) + 24` so the neighbours slide apart. One book is open at a time. Book 1 starts open.
- Below the shelf, a 12 column details row shows the language (column 1), then the title, repo name and description (column 4 onward), and a "View on GitHub ↗" outlined button on the right.
- Phones: the books shrink to about two thirds (`zoom: .66`), the shelf snaps sideways, a tapped book scrolls to the centre after it has turned (only on a real tap, never on page load), and the details stack in one column.
- Book data (title, subtitle, repo, language, description, URL) and the six cloth and foil colours are in the prototype's `REPOS` and `BOOK_LOOKS`.

### 7. "See the project" cursor
- While the pointer is over the shelf or the GitHub button, the label "See the project" (16px, weight 500, white, `mix-blend-mode: difference`, so it flips colour against whatever is behind it) follows the cursor with a smooth lag (it moves 22% of the remaining distance each frame). Elsewhere it is hidden (opacity 0, 250 ms fade).
- It is hidden entirely on touch screens (`@media (hover: none)`).

### 8. Footer (Contact)
- "Let's talk." at `clamp(56px, 10vw, 160px)`.
- Three columns with hairline tops:
  - **Contact:** laikhuramkorouhanba@gmail.com (mailto link)
  - **Elsewhere:** LinkedIn (`https://www.linkedin.com/in/korouhanbakhuman`), GitHub (`https://github.com/laikhuramkorouhanba`)
  - **Based in:** Paris, France, and "Open to internships from April 2027" in muted grey
- A bottom row with "© 2026 Korouhanba Khuman Laikhuram" and "Back to top ↑".
- Phones: one column, and the bottom row wraps.

## Layout rules
- Every section sits in the same column: max 1440px wide, centred, 32px side padding (16px under 760px).
- A 12 column grid with 32px gaps. The story lines and the book details both start at column 4, so they line up.
- One breakpoint: 760px.

## Writing rules (for any copy you add)
- No em dashes. No jargon or buzzwords. Short, plain sentences in the first person. It should read as if Korouhanba wrote it.

## Accessibility
- Real `<button>` elements for books, with `aria-pressed` and an `aria-label` like "Open Murmur".
- The globe canvas has `role="img"` and `aria-label="Globe turning between Manipur and Paris"`.
- Decorative parts are marked `aria-hidden`: the intro, the cursor label, the cue line, the arrow and the name bar.
- The book details region is `aria-live="polite"`.
- With reduced motion: no intro, no drift, no reveals, no cue loop. The globe and book turns may stay.
- Text contrast is 4.5:1 or better on bg-000 (muted grey is 6.1:1).

## Open items (confirm with Korouhanba before launch)
1. **Repos on the shelf are placeholders.** `churn-streamlit` and `_` are known to be public. `document-extraction-rag` needs its visibility checked. `als-recommender` and `qrt-long-or-short` are guessed names. `murmur` may still be private. Replace these with his real public repos and URLs.
2. **"Khurumjari"** (the Manipuri greeting) needs a spelling check. Should it also appear in Meetei Mayek script?
3. **Visitor analytics:** he wants a free, quick-to-set-up option.
4. **Design system out of date:** the Claude design system artifact still lists an orange accent and a mono font. The site uses neither. `design/tokens.json` here is correct.
5. **Fonts:** Inter Tight comes from Google Fonts. Self-hosting it would make the site faster and keep it private.
