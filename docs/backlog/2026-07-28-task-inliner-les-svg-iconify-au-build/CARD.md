---
title: Inliner les SVG Iconify au build
type: task
status: done
completed: 2026-07-28
assignee: task-runner
priority: medium
effort: M
tags: [performance, build, robustesse, jalon-4]
created: 2026-07-28
edited: 2026-07-28
links: [[2026-07-28-spec-cv-humains-et-agents]]
ref: PERF-1
---

# Inliner les SVG Iconify au build

**Risque R3 de la spec.** Le build fait des appels réseau vers
`api.iconify.design` pendant la génération statique :

- `src/components/ExperienceCard.astro:24` et `:34`
- `src/components/cv/CVCard.astro:13`

Un timeout réseau, une panne de l'API ou un déploiement depuis une machine mal
connectée **casse le build** — donc le déploiement. C'est le seul point de
défaillance externe d'un site par ailleurs entièrement statique et
auto-hébergé, polices comprises.

S'y ajoute un second appel externe, côté navigateur cette fois : le script
`code.iconify.design` chargé en `defer` dans `BaseLayout.astro:138`, qui oblige
à ouvrir la CSP vers ce domaine.

## Piste

`@iconify-json/carbon` est **déjà installé** en dépendance de développement. Les
icônes sont donc disponibles localement : plus rien n'oblige à passer par le
réseau, ni au build ni au runtime.

Une tentative d'inlining avait été faite en avril (`iconInliner.ts`, sur la
branche `backup/main-2026-04-28`) avant d'être remplacée par `iconEngine.ts`, qui
génère des balises `<iconify-icon>` résolues côté client. Regarder l'approche
archivée avant de repartir de zéro.

## Critères de done

- [x] Aucun `fetch` réseau pendant `bun run build` — les trois appels supprimés, aucun `fetch` vers iconify dans les sources
- [x] Icônes résolues depuis `@iconify-json/carbon` via `src/utils/iconSvg.ts`
- [x] Script `code.iconify.design` **retiré** — le web component n'était plus nécessaire une fois toutes les balises converties
- [x] CSP resserrée aux deux endroits : `connect-src 'self'`, `script-src 'self' 'unsafe-inline'` — plus aucune origine tierce
- [x] Rendu visuel inchangé, vérifié par capture Playwright
- [x] `bun run build` et `bun test` verts — **69 tests**

## Portée réelle

La carte n'envisageait que les trois `fetch` du build. Une fois ceux-ci
supprimés, le web component `<iconify-icon>` restait — et avec lui le script
CDN et les appels réseau **côté client**. Tout a été converti :

| Emplacement | Avant | Après |
|---|---|---|
| `CVCard.astro` | `fetch` API au build | `renderIconSVG` |
| `ExperienceCard.astro` | 2 × `fetch` API au build | `renderIconSVG` |
| `iconEngine.renderIcon()` | balise `<iconify-icon>` | SVG inline, repli sur la balise si introuvable |
| `BaseLayout.astro` | 6 balises + script CDN | 6 SVG inline, script supprimé |
| `about.astro` | 1 balise | SVG inline |

## Mesure

```
erreurs / avertissements console : 0
requêtes échouées                : 0
origines tierces contactées      : 0
```

Relevé au chargement de `/` et `/about` dans Chrome via Playwright, en lisant
`performance.getEntriesByType('resource')`. **Le site ne contacte plus aucun
domaine externe** — ni au build, ni au rendu.

36 SVG inline dans la page d'accueil ; `dist/index.html` passe à ~69 Ko. C'est
l'échange assumé : quelques kilo-octets de HTML contre la suppression du seul
point de défaillance réseau du build et de la dernière origine tierce de la CSP.

## Deux tests périmés corrigés

Ils exigeaient ce que ce travail supprime — comme celui des Google Fonts plus
tôt dans la journée :

- `cvParser.test.ts` attendait `iconify-icon` dans le contenu rendu → vérifie désormais le SVG inline **et** l'absence de balise (un repli signifierait le retour d'une dépendance réseau)
- `integration.test.ts` exigeait le script CDN → retourné en garde anti-régression, doublé d'un test qui vérifie que la CSP reste sans origine tierce

## Notes

Gain double : suppression du point de défaillance au build, et une origine
externe de moins dans la CSP. Le poids HTML augmentera légèrement (SVG inline) —
c'est un échange favorable pour un site de 3 pages.
