# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal portfolio for quannh.xyz. One repo, two independent apps — each with its own `package.json` and `pnpm-lock.yaml` (no workspace at the root). Node 22 (`.nvmrc`), pnpm 11.

## Commands

Run from inside `frontend/` or `backend/`:

| | frontend (Next.js 16) | backend (Strapi 5) |
|---|---|---|
| dev | `pnpm dev` (:3000) | `pnpm dev` (:1337, admin at `/admin`) |
| build | `pnpm build` | `pnpm build` |
| lint | `pnpm lint` | — |
| typecheck | `pnpm typecheck` (`next typegen` then `tsc`) | `pnpm typecheck` |

There is no test suite. Verify changes with `lint` + `typecheck` + `build`.

`docker compose up -d --build` at the root runs both apps as containers locally (each reads its own `.env`, copied from `.env.sample`).

## Frontend architecture

- **Next.js 16 differs from training data.** Per `frontend/AGENTS.md`, read the relevant guide in `frontend/node_modules/next/dist/docs/` before writing Next code. `next dev` re-adds that block to `AGENTS.md`; commit it rather than reverting. `next.config.ts` enables `cacheComponents` and `partialPrefetching`, and uses `output: "standalone"` (the Dockerfile depends on it).
- **Content flow:** `src/app/page.tsx` calls `getPortfolio()` in `src/lib/api/portfolio.ts` (server-only) and passes one slice of the result to each section in `src/components/sections/`. Today it returns the bundled `src/data/portfolio.json`, typed by `src/types/portfolio.ts`. Strapi is **not wired yet**: when content types exist, fetch them in `getPortfolio()` with `STRAPI_API_TOKEN` and keep the JSON as fallback. Content edits go in the JSON, and its shape must match the types. Selected Work projects with a `caseStudy` also get a static page at `/work/[slug]` (`src/app/work/[slug]/page.tsx`); their title morphs between card and page through React's `<ViewTransition>` (`ProjectTitle`), and Nav/Footer take `base="/"` there so section links lead back home.
- **Styling:** Tailwind v3 + SCSS. Colour tokens are CSS variables in `src/styles/includes/_theme.scss` (dark default, light via OS preference or `data-theme` on `<html>`), exposed to Tailwind as `bg`, `panel`, `line`, `text`, `muted`, `accent`, `on-accent`. Use those, not raw colours. Effect styles (intro, glow, click, scrollbar, timeline, stack, expand, scroll, palette, wordmark, grain, route) are SCSS partials pulled in by `globals.scss`. There are extra breakpoints `768:`, `1024:`, `1280:` alongside sm/md. Use `cn()` from `src/lib/cn.ts` (clsx + tailwind-merge).
- **Inline head scripts:** `layout.tsx` injects `themeInitScript` (from `ThemeToggle`) and then `introInitScript` (from `Intro`) before paint. The order matters: the intro reads `data-theme`.
- **CSP** is a static header in `next.config.ts` (not nonce-based, so pages stay static). `img-src`/`media-src` allow only `'self'` plus the CMS origin from `STRAPI_API_URL`, and `next/image` remote hosts are an explicit allowlist. Adding any new external origin (fonts, scripts, images) means updating both. Fonts are self-hosted through `next/font`.
- `STRAPI_API_URL` and all `NEXT_PUBLIC_*` are baked in at **build time** (Docker build args). Only `NEXT_PUBLIC_SITE_ENV=production` lifts `noindex`.

## Backend

Strapi 5 on **SQLite** (`.tmp/data.db`) by deliberate choice; don't switch to Postgres. `src/api/` is still empty (no content types yet). In containers, `.tmp/` and `public/uploads/` are volumes.

## Deploy

Pushing to `main` (changes under `frontend/`, `backend/`, `deploy/` or the workflow) triggers `.github/workflows/deploy.yml`. It builds both images to GHCR with production build args (plus `NEXT_PUBLIC_BUILD_TIME` for the footer's "Updated … ago" line), then SSHes to the EC2 host and copies `deploy/docker-compose.prod.yml` to `/opt/portfolio/docker-compose.yml`. There it writes `TAG=<sha>`, pulls the images, restarts the stack and smoke-tests through Nginx. The server never builds. Both containers bind to `127.0.0.1` behind host Nginx and Cloudflare.

## Commit messages

Conventional-commit style: `type(scope): summary`. Write the summary in lowercase imperative/descriptive English with no trailing period, and list several changes comma-separated in one line.

- Types in use: `feat` (new or changed UI or behaviour), `style` (visual tweaks only), `content` (copy and data in `portfolio.json`), `fix`, `revert`, `ci` (workflow or deploy), `chore` (tooling, deps, scaffolding).
- Scope is the app touched, `frontend` or `backend`. Leave it out when the change spans both or neither (`ci: …`, `chore: …`).
- Examples: `feat(frontend): language section with IELTS summary and zoomable certificate viewer`, `style(frontend): stack rows only recolour the group name on hover`.

## Other folders

- `mockup/`: static HTML design explorations (the site implements `01-staircase`). The root `index.html` redirects there.
- `example/`: gitignored third-party reference material and source assets. Never commit it.
