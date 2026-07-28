---
title: Inliner les SVG Iconify au build
type: task
status: todo
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

- [ ] Aucun `fetch` réseau pendant `bun run build` — vérifiable en coupant le réseau
- [ ] Icônes résolues depuis `@iconify-json/carbon`
- [ ] Script `code.iconify.design` retiré de `BaseLayout.astro` si plus nécessaire
- [ ] CSP resserrée en conséquence dans `BaseLayout.astro` **et** `public/_headers` (les deux doivent rester alignées)
- [ ] Rendu visuel inchangé sur `/` et `/about`
- [ ] `bun run build` et `bun test` verts

## Notes

Gain double : suppression du point de défaillance au build, et une origine
externe de moins dans la CSP. Le poids HTML augmentera légèrement (SVG inline) —
c'est un échange favorable pour un site de 3 pages.
