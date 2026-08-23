# AudDent — marketing site

Static marketing site for [AudDent](https://auditdent.example), the compliance
workbench for dental practices. A Vite + React SPA with prerendered SEO pages
(resource articles, per-state inspection checklists), RSS, and JSON-LD — no
backend, no server-side rendering beyond the build-time prerender.

## Quick start

```sh
npm ci
npm run dev        # Vite dev server on http://127.0.0.1:5199
npm run gate       # full quality gate (see below)
```

## Quality gate

`npm run gate` runs, in order:

| step | command | what it checks |
|---|---|---|
| typecheck | `tsc --noEmit` | TypeScript across `src/`, `tests/`, `e2e/`, config |
| lint | `eslint .` | flat-config ESLint |
| unit | `vitest run` | component + data-model + static-file tests |
| links | `scripts/linkrot.mjs` | every cited external source still resolves (7-day result cache; bot-walled domains are skipped and spot-checked manually) |
| build | `vite build && node scripts/prerender.mjs` | bundle + prerenders `resources/`, `checklist/<state>/`, `privacy/`, `rss.xml`, sitemap |
| e2e | `playwright test` | rendered-site behavior + axe accessibility, per page |

The home page (`/`) is intentionally **not** prerendered — it ships as the SPA
entry; all other routes are static files, so any static host can serve them.

## Container

```sh
./start.sh         # builds the image (stamped with repo HEAD) and serves it
                   # via non-root nginx at http://127.0.0.1:8090
```

`Dockerfile` builds the site (Vite + prerender) and serves `dist/` with nginx
on port 8080 (mapped to 8090 by `docker-compose.yml`), with security headers
and HSTS. The 404 page doubles as the SPA fallback.

## Layout

```
src/            app (React), pages, components, data models
public/         static assets: favicon, og-image, robots.txt, sitemap.xml
scripts/        prerender.mjs (SEO pages/RSS/JSON-LD), linkrot.mjs (link
                rot guard), shots.mjs (QA screenshots), og-config.mjs
e2e/            Playwright specs
tests/          Vitest unit/component tests
nginx/          container nginx config + security headers
shots/          QA screenshots (desktop/mobile, full + print)
```

## Git flow

- **`main`** — the deploy branch. Promotions only: a no-ff merge from
  `develop` plus a `vX.Y.Z` tag. Never written directly.
- **`develop`** — the integration branch. All work lands here first.
- **`feature/<name>` / `bugfix/<name>`** — short-lived branches cut from
  `develop`, delivered as a PR to `develop` (gate green), deleted after
  merge.

The full quality gate (`npm run gate`) must pass before a branch merges; CI
runs it on every PR and push (the `gate` check is what branch protection
requires). `main` and `develop` are protected on GitHub: required PR + green
check, no direct pushes, no force pushes.

Local hooks (commit-msg, pre-commit lint, pre-push gate) live in
`scripts/git-hooks/`; install them on a fresh clone with:

```sh
git config core.hooksPath scripts/git-hooks
```

## Current state

- All site metadata (canonical URLs, sitemap, Open Graph, RSS) uses the
  placeholder domain `auditdent.example` until launch.
- Contact forms are a deliberate interim: a valid submission opens a
  pre-filled `mailto:` draft in the visitor's own email client — there is no
  lead endpoint yet.
