---
doc-mode: faru
# gate: spec-required  # opt-in — spec obligatoire avant code. Activer si : projet critique / équipe > 1 / édition ad-hoc hors pipeline fréquente.
---

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Spec de référence** : [`docs/backlog/2026-07-28-spec-cv-humains-et-agents/CARD.md`](docs/backlog/2026-07-28-spec-cv-humains-et-agents/CARD.md).
> La reverse doc `docs/00→06` date du 10 avril 2026 et décrit un état abandonné (Netlify, Astro 6) — ne pas s'y fier.

## Project Overview
Site web CV de Mathieu Drouet — Head of Product | AI-Augmented Delivery. Construit avec Astro (SSG), TypeScript et Tailwind CSS. Déployé sur https://cv.drouet.io via **Cloudflare Pages**.

## Commands
- Install: `bun install`
- Development: `bun run dev` or `bun start` (starts server at localhost:4321)
- Build: `bun run build` (detects content changes and builds to ./dist/)
- Preview: `bun run preview` (preview build locally)
- Type-check: **indisponible** — `astro check` est incompatible avec TypeScript 7 (le compilateur natif n'expose plus l'API programmatique dont dépend le language-server). Suivi : [withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321). Filet de sécurité actuel : `bun run build` + `bun test`
- Content Check: `bun run content:check` (check for CV content changes)
- Content Watch: `bun run content:watch` (watch CV content for changes)
- Build with Watch: `bun run build:watch` (starts dev server with content watching)
- Testing: `bun test` (run Vitest tests), `bun run test:watch` (watch mode), `bun run test:ui` (UI mode), `bun run test:coverage` (coverage report)

## Architecture & Structure
- **Content Management**: CV content is stored in `src/content/cv/cv.md` using Markdown format with Astro Content Collections, parsed dynamically through `src/utils/cvParser.ts`
- **Layout System**: Single unified layout architecture:
  - `BaseLayout.astro`: Base layout with HTML structure, meta tags, CSP headers, and conditional footer
  - Responsive design with mobile-first approach
- **Component Organization**:
  - `ExperienceCard.astro`: Work experience display with company links, roles, and descriptions (mobile responsive with flexbox)
  - `ContactModal.astro`: Contact form modal — submits to the Cloudflare Pages Function `/api/contact` (works in production / on `wrangler pages dev`)
  - `cv/CVCard.astro`: CV-specific card component with icon support
  - `cv/CVGrid.astro`: Grid layout system for CV sections
  - `cv/CVSection.astro`: Section headers with icons
  - `about.astro` + `src/content/about/about.md`: Page /about avec rendu Markdown via Content Collections (styles dans `.prose-cv`)
- **Styling Architecture**: Tailwind CSS with Lumon Design System configuration in `tailwind.config.mjs`:
  - **Lumon Theme** (unique): Green-based color system with square design aesthetic. C'est le seul thème — le thème alternatif « Atari » a été supprimé le 2026-07-28. Voir `DESIGN.md` pour le système visuel complet.
  - **Typography**: IBM Plex Sans/Mono + Lora — polices **auto-hébergées** dans `public/fonts/*.woff2` (déclarées en `@font-face` dans `global.css`, preload dans `BaseLayout.astro`). Aucun appel à Google Fonts : la CSP impose `font-src 'self'`
  - **Legacy CV Colors**: Mapped for backward compatibility (`cv-bg`, `cv-paper`, `cv-content`, etc.)
- **Icons**: SVG **inline, résolus au build** depuis `@iconify-json/carbon` via `src/utils/iconSvg.ts`. Aucun CDN, aucun appel réseau — ni au build, ni au runtime. Seul le jeu `carbon` est embarqué : un autre préfixe déclenche un avertissement de build et rend `null`
- **Security**: Content Security Policy configured in BaseLayout with proper directives for all external resources

## Gotchas
- **Aucun appel réseau, ni au build ni au runtime** — depuis le 2026-07-28. Les icônes venaient de `api.iconify.design` par `fetch` pendant le build SSG (un timeout faisait échouer le déploiement) et d'un script CDN côté client. Tout est résolu localement. La CSP n'autorise plus aucune origine tierce : `connect-src 'self'`, `script-src 'self' 'unsafe-inline'`. **Réintroduire une origine externe, c'est rouvrir la CSP aux deux endroits** (`BaseLayout.astro` et `public/_headers`, qui doivent rester identiques)
- **Formulaire de contact** : `ContactModal.astro` poste vers la Pages Function `functions/api/contact.ts` (envoi email via Resend). Nécessite les secrets `RESEND_API_KEY` / `CONTACT_TO` côté Cloudflare ; ne fonctionne pas avec `astro dev` seul (utiliser `wrangler pages dev`)
- **Pages Functions (Cloudflare)** : `functions/_middleware.ts` gère la négociation Markdown (`Accept: text/markdown`) et `functions/api/contact.ts` le formulaire. Le répertoire `functions/` n'est pas analysé par `astro check`
- **Format Markdown strict** : `cvParser.ts` attend un format précis dans `cv.md` (icônes, rôles, périodes). Un écart de format drop silencieusement les entrées sans erreur
- **Détection poste actuel** : `current: true` si la période contient l'année en cours (`new Date().getFullYear()`)
- **Package manager : bun** — `bun install`, `bun run build`, `bun test`. Lock file : `bun.lock` (format texte, pas `bun.lockb`). Cloudflare Pages détecte bun automatiquement via ce lockfile.
- **Styles markdown custom** : les pages qui rendent du Markdown via `<Content />` doivent avoir leurs styles définis dans `global.css` (ex: `.prose-cv`). Aucun warning au build si la classe est absente — le rendu est juste brut.
- **Touch target override** : le CSS impose `min-height: 44px` sur tous les `<a>`. Les liens inline (dans `.prose-cv` par ex.) doivent avoir `class="no-min-size"` pour éviter le `display: inline-flex` forcé.
- **Astro v7 Content Layer API** : config des collections dans `src/content.config.ts` (racine de `src/`, pas `src/content/config.ts`). Utiliser `loader: glob({ pattern, base })` à la place de `type: 'content'`. `render()` est importé depuis `astro:content` — `entry.render()` n'existe plus.

## Key Configuration Files
- `astro.config.mjs`: Configures integrations, build optimizations, and Vite plugins
- `tailwind.config.mjs`: Lumon Design System theme, colors, and typography settings
- `tsconfig.json`: TypeScript configuration extending Astro's base
- `renovate.json`: Automated dependency updates configuration
- `src/config/site.ts`: Site configuration including personal info, social links, and SEO settings
- `src/config/env.ts`: Environment-specific configuration with type safety and security settings
- `src/config/images.ts`: Mapping company name → logo file in `public/logos/`
- `public/sw.js`: Service worker kill-switch — auto-unregisters any cached SW and clears all caches on next browser visit (replaces old caching SW)
- `public/_headers`: Cloudflare Pages cache control and security headers (même syntaxe qu'à l'époque Netlify)
- `wrangler.toml`: configuration Cloudflare Pages (build command, compatibilité)

## Performance Architecture
- **Bundle Optimization**: 31KB CSS bundle, minimal JavaScript footprint
- **Font Loading**: Polices auto-hébergées (`public/fonts/*.woff2`), preload sur la graisse critique — aucune requête tierce
- **Service Worker**: Kill-switch — dés-installe les anciens SW et vide les caches au prochain chargement (voir `public/sw.js`)
- **Build Pipeline**: Content change detection (SHA-256) to avoid unnecessary rebuilds
- **Core Web Vitals**: Optimized for LCP, FID, and CLS metrics

## Implementation Guidelines

### Development Workflow
- Always run `bun run build` before committing to ensure no build errors
- Run `bun test` to execute the full test suite (38 tests : 20 unit + 18 integration)
- La validation TypeScript via `astro check` est hors service (voir § Commands) — le build et les tests sont le seul filet

### Code Quality Standards
- All components must have TypeScript interfaces for props
- Follow existing naming conventions (cv-* for custom CSS classes)
- Maintain consistent 2-space indentation
- Use semantic HTML elements for accessibility

### Security Practices
- Validate all external links include proper rel attributes
- Review any new CDN dependencies for supply chain risks
- CSP is properly configured — update BaseLayout.astro when adding new external resources

## Content Management System

### Dynamic Markdown Parsing
- **Source**: `src/content/cv/cv.md` - Single source of truth for CV content
- **Parser**: `src/utils/cvParser.ts` - Converts Markdown to structured TypeScript data
- **Integration**: Astro Content Collections automatically handle frontmatter and content separation
- **Change Detection**: `scripts/watch-content.js` - Detects content changes during build (SHA-256)

### Content Structure

The CV content follows a specific Markdown format parsed by `cvParser.ts`:

```markdown
---
name: "Mathieu Drouet"
title: "Head of Product | AI-Augmented Delivery"
description: "CV description"
iconSet: "carbon"           # Icon set to use (carbon, tabler, lucide, heroicons)
theme: "lumon"              # Seule valeur acceptée par le schéma
---

# Mathieu Drouet

## **carbon:icon-name** Education

### Degree Title
Institution, City – YYYY–YYYY

## **carbon:identification** Coordonnées

**carbon:email** **Email:** email@example.com
**carbon:globe** [**Portfolio**](https://example.com)
**carbon:logo-linkedin** [**LinkedIn**](https://linkedin.com/in/username)
**carbon:location-heart-filled** **Localisation:** City, Country

## **carbon:gamification** Centres d'intérêt

**carbon:camera-action** Photography
**carbon:music** Music

## Expériences

### Company Name
**carbon:location-heart-filled** Location – YYYY
**Role Title** | YYYY | [Company Link](https://company.com)

- Achievement with **bold** text
- Another achievement

## Compétences

### Category Title **carbon:cognitive**
**Subtitle** | **carbon:badge** Level

- Skill item 1
- Skill item 2
```

### Icon Format
- Section icons: `## **carbon:icon-name** Section Title`
- Inline icons: `**carbon:icon-name** Text content`
- Skill icons: `### Title **carbon:icon-name**` (icon after title)
- Level icons: `**Subtitle** | **carbon:icon-name** Level`

### Supported Icon Sets
- `carbon` (default): IBM Carbon Design icons
- `tabler`: Tabler icons
- `lucide`: Lucide icons
- `heroicons`: Hero icons

### Change Detection System
- **Cache File**: `.content-cache.json` - Stores content hash and modification timestamp
- **Build Integration**: `bun run build` automatically checks for content changes
- **Hash Comparison**: SHA256 hashing detects even minor content modifications

### Editing Workflow
1. Edit `src/content/cv/cv.md` directly
2. Run `bun run build` to detect changes and rebuild
3. Content is automatically parsed and integrated into the design system

## Testing Architecture
- **Vitest**: Testing framework with UI mode and coverage reporting
- **Test Commands**: `bun test`, `bun run test:watch`, `bun run test:ui`, `bun run test:coverage`
- **Coverage**: @vitest/coverage-v8 — seuil minimum 80% (branches, functions, lines, statements)
