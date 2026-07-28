# Todo — cv-mathieudrouet-2025 · CLOS

> ⚠️ **Ce fichier est clos et conservé pour l'historique.** Ses 17 items sont
> tous réalisés. Le suivi est passé en mode `faru` le 2026-07-28 :
> les tâches vivent désormais dans `docs/backlog/`, une par dossier.
>
> Spec de référence : [`docs/backlog/2026-07-28-spec-cv-humains-et-agents/CARD.md`](backlog/2026-07-28-spec-cv-humains-et-agents/CARD.md)

> Audit Tony · 2026-04-27 · Stack de l'époque : Astro 6.1.9 / TS 6 / Tailwind 4 / **Netlify**
> Audit Agathe (DA) · 2026-04-27
>
> Cette stack n'est plus celle du projet : Astro 7.1.4 / TS 7 / Tailwind 4 / **Cloudflare Pages**.

## Backlog

- [x] [P2] **Auto-héberger Google Fonts** — 24 fichiers woff2 (latin + latin-ext, 3 familles × 4 poids × 2 subsets) dans `public/fonts/`; `@font-face` dans `global.css`; `--font-lora` corrigé (`__lora_1fc044` → `'Lora'`); CSP allégée (suppression `fonts.googleapis.com`/`fonts.gstatic.com`); `<link rel="preload">` sur IBM Plex Sans 400 · `src/layouts/BaseLayout.astro`, `src/styles/global.css`, `public/_headers`

## Todo

- [x] [P1] **Désinstaller unplugin-icons** — package inutilisé retiré (`bun remove unplugin-icons`), import + plugin Vite supprimés de `astro.config.mjs` · Option A (migration SVG inline) reportée en backlog P2

## In Progress

## Blocked

## Done

- [x] [P0] **Fix skip link #navigation mort** — skip link mort supprimé · `src/layouts/BaseLayout.astro`
- [x] [P0] **Fix JSON-LD alumniOf placeholder** — remplacé par Institut Saint-Luc + Simplon.co · `src/layouts/BaseLayout.astro`
- [x] [P1] **Supprimer @tailwindcss/typography** — package supprimé de dependencies
- [x] [P1] **Ajouter `defer` sur le script Iconify CDN** — `src/layouts/BaseLayout.astro`
- [x] [P1] **Synchroniser les CSP** — `_headers` et `BaseLayout.astro` alignés, `frame-ancestors 'none'` ajouté dans `_headers` · `public/_headers`
- [x] [P2] **Supprimer X-XSS-Protection dans `_headers`** — directive dépréciée retirée · `public/_headers`
- [x] [P1] **Retirer `@tailwindcss/typography` du plugin Tailwind** — `plugins: [require(...)]` supprimé de `tailwind.config.mjs` · _Revue Agathe_
- [x] [P1] **Unifier `.lumon-container` max-width** — 1200px → 80rem canonique, doublon inline BaseLayout retiré · _Revue Agathe_
- [x] [P1] **Vérifier contraste `--cv-muted`** — neutral-600 (#5a7d5c, 4.31:1 ❌) → neutral-700 (#4a674c, 5.85:1 ✅ AA) · _Revue Agathe_
- [x] [P2] **Supprimer les fontes fantômes du design system** — `--font-agrandir` et `--font-writer` retirées · _Revue Agathe_
- [x] [P2] **Hardcoded hex `#7da17e` dans `.glass-card:hover`** → `var(--cv-accent)` · _Revue Agathe_
- [x] [P2] **`.prose-cv strong` change de famille de fonte** — `font-family: var(--font-lora)` supprimée · _Revue Agathe_
- [x] [P3] **`.prose-cv` interlignage** — 1.7 → 1.6 · _Revue Agathe_
- [x] [P1] **Centraliser le contact (anti-duplication)** — cvParser.ts lit depuis siteConfig · _Revue Astride_
- [x] [P2] **Logger les exclusions silencieuses du parser CV** — console.warn ajouté, filtre ### corrigé · _Revue Astride_
