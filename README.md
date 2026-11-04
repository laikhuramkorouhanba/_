# Portfolio handoff package

Everything Claude Code needs to build Korouhanba Khuman's portfolio home page.

| File | What it is |
| --- | --- |
| `prototype/index.html` | The approved design as one working page. Open it in a browser. This is the reference to match. |
| `HANDOFF.md` | The spec: every section, the exact copy, interactions and timings, phone rules, accessibility, open items. |
| `docs/superpowers/plans/2026-11-04-portfolio-site.md` | A step-by-step build plan (Vite, tests, GitHub Pages deploy). |
| `design/tokens.json` | Colours, type, layout and motion values in use. |
| `data/land-dots.json` | Land points for the globe. |

## How to use it

1. Clone the site repo and open it in Claude Code:
   ```
   git clone https://github.com/laikhuramkorouhanba/_.git portfolio
   cd portfolio
   ```
2. Copy everything in this folder into the repo root, keeping the same paths.
3. In Claude Code, say:
   > Read HANDOFF.md and the plan in docs/superpowers/plans/. Use superpowers:subagent-driven-development to execute the plan task by task. The prototype in prototype/index.html is the reference to match.
4. When it reaches the deploy task, turn on **Settings › Pages › Source: GitHub Actions** in the repo.
