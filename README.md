# Mathieu Drouet - CV Digital

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-cv.drouet.io-brightgreen)](https://cv.drouet.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-6.1.9+-orange)](https://astro.build/)

> **Chief AI, Technology & Product Officer (CATPO)** — stratégie produit, architecture technologique, systèmes agentiques et delivery hands-on pour produits numériques B2B complexes.

## Stack technique

- **[Astro](https://astro.build/)** — Framework SSG, Content Collections
- **[TypeScript](https://www.typescriptlang.org/)** — Typage statique
- **[Tailwind CSS](https://tailwindcss.com/)** — Design system utilitaire
- **[Vitest](https://vitest.dev/)** — Tests unitaires et d'intégration
- **[Iconify](https://iconify.design/)** — Icônes multi-sets (Carbon, Tabler, Lucide...)
- **[Cloudflare Pages](https://pages.cloudflare.com/)** — Hébergement, CDN, Pages Functions

## Architecture

Le contenu du CV est géré via un fichier Markdown par langue, parsé dynamiquement au build. Le résultat est un site statique déployé sur Cloudflare Pages.

Le site est publié en deux langues : français sur `/` et `/about`, anglais sur `/en/` et `/en/about`. Chaque langue a sa source Markdown ; les libellés d'interface vivent dans `src/config/i18n.ts`.

```
src/
├── components/
│   ├── ExperienceCard.astro     # Carte expérience/compétence
│   ├── ContactModal.astro       # Modal contact (Cloudflare Pages Function)
│   └── cv/                      # CVCard, CVGrid, CVSection
├── content/
│   ├── cv/cv.md                 # Contenu du CV, fr (source de vérité)
│   ├── cv/en/cv.md              # Contenu du CV, en
│   ├── about/about.md           # Page À propos, fr
│   └── about/en/about.md        # Page À propos, en
├── layouts/BaseLayout.astro     # HTML, meta, CSP, footer, hreflang
├── pages/                       # index.astro, about.astro, en/*
├── components/pages/            # CVPage, AboutPage — rendus par langue
├── config/                      # site.ts, env.ts, images.ts, i18n.ts
├── utils/                       # cvParser.ts, iconEngine.ts, debug.ts
└── styles/global.css            # Design system (thèmes Lumon + Atari)
```

## Démarrage rapide

```bash
bun install
bun run dev        # localhost:4321
bun run build      # Build de production
bun run preview    # Prévisualiser le build
```

## Tests

```bash
bun test                   # Lancer les tests (38 tests)
bun run test:watch         # Mode watch
bun run test:coverage      # Rapport de couverture (seuil 80%)
bun run test:ui            # Interface web Vitest
```

## Contenu

Pour modifier le CV, éditer `src/content/cv/cv.md` (français) et `src/content/cv/en/cv.md` (anglais). Le format Markdown est documenté dans `docs/03-doc-utilisateur-2026-04-10.md` ; seuls les intitulés de section changent d'une langue à l'autre (`Coordonnées`/`Contact`, `Expériences`/`Experience`, `Compétences`/`Skills`, `Centres d'intérêt`/`Interests`).

Les copies servies aux agents (`public/cv.md`, `public/about.md`, `public/en/cv.md`, `public/en/about.md`) sont maintenues à la main et verrouillées par `tests/agent-readable.test.ts` : toute modification d'une source doit être reportée dans sa copie.

```bash
pnpm run content:check     # Vérifier les changements de contenu
pnpm run content:watch     # Surveiller les changements en continu
```

## Design System

Deux thèmes configurables via le frontmatter de `cv.md` :

- **`lumon`** (défaut) — Palette verte, angles droits
- **`atari`** — Palette bleue/beige, style rétro

Palette Lumon :
```css
--color-accent-green: #7da17e;
--color-dark: #163f38;
--color-neutral: #f7f6f9;
--color-light-blue: #d6e0e2;
```

Typographie : IBM Plex Sans, IBM Plex Mono, Lora (Google Fonts)

## Sécurité

- Content Security Policy (meta tag + `public/_headers` Cloudflare Pages)
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Liens externes avec `rel="noopener noreferrer"`

## Performance

- Site 100% statique — near-zero JavaScript
- CSS critique inline (anti-FOUC)
- Service Worker kill-switch — désinstalle les anciens SW et vide les caches au prochain chargement
- Google Fonts chargées de manière asynchrone

## Documentation

La documentation complète du projet est dans `docs/` :

| Fichier | Contenu |
|---------|---------|
| `01-cahier-des-charges-2026-04-10.md` | Spécifications fonctionnelles et techniques |
| `02-doc-technique-2026-04-10.md` | Architecture, modules, flux de données |
| `03-doc-utilisateur-2026-04-10.md` | Guide d'utilisation et dépannage |
| `04-user-stories-2026-04-10.md` | User stories avec critères d'acceptation |
| `05-glossaire-2026-04-10.md` | Termes métier et techniques |
| `06-architecture-2026-04-10.md` | ADR reconstitués, diagrammes |

---

**Mathieu Drouet** — Chief AI, Technology & Product Officer (CATPO), Lille  
[cv.drouet.io](https://cv.drouet.io) · [LinkedIn](https://www.linkedin.com/in/mathieudrouet/) · [mathieu@drouet.io](mailto:mathieu@drouet.io)
