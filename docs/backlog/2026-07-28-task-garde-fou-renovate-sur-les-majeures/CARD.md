---
title: Garde-fou Renovate sur les montées majeures
type: task
status: todo
assignee: task-runner
priority: medium
effort: XS
tags: [dependances, ci, jalon-4]
created: 2026-07-28
edited: 2026-07-28
links: [[2026-07-28-spec-cv-humains-et-agents]]
ref: SEC-1
---

# Garde-fou Renovate sur les montées majeures

**Risque R6 de la spec, et il s'est déjà réalisé.** Le 14 juillet, Renovate a
monté TypeScript en v7 (PR #150). Le compilateur natif n'exposant plus l'API
programmatique dont dépend `@astrojs/language-server`, `astro check` est devenu
inopérant — et l'échec se présentait sous la forme d'un crash illisible
(`Cannot read properties of undefined (reading 'fileExists')`), qui ressemble à
un bug d'outillage plutôt qu'à une capacité perdue.

Résultat : le projet a passé deux semaines sans validation de types, sans que
personne le sache. Une erreur de type réelle est passée dans `index.astro`
pendant ce temps.

`renovate.json` n'exclut aujourd'hui aucune montée majeure.

## Ce qu'il faut décider

Une montée majeure ne se traite pas comme un patch : elle demande une
vérification humaine. Deux approches possibles —

1. **Dependency Dashboard** — les majeures ne s'ouvrent qu'après approbation manuelle.
2. **Liste ciblée** — seuls les paquets structurants (`typescript`, `astro`, `tailwindcss`) passent en approbation manuelle, le reste continue automatiquement.

La seconde est plus légère à vivre ; la première est plus sûre.

## Critères de done

- [ ] `renovate.json` configuré, avec un commentaire expliquant **pourquoi** (citer l'épisode TS 7)
- [ ] Comportement vérifié sur le Dependency Dashboard après le prochain passage
- [ ] Les patches et mineures continuent de passer sans friction

## Notes

Ne pas geler `typescript` en v6 : la décision prise le 28/07 est de **rester en
TS 7 sans type-check** (spec §9.2). Le garde-fou porte sur le fait d'être
*prévenu* d'une majeure, pas sur le fait de la refuser.
