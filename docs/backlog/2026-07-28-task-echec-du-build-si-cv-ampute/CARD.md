---
title: Faire échouer le build si une section du CV est absente
type: task
status: todo
assignee: task-runner
priority: high
effort: M
tags: [parser, robustesse, jalon-2]
created: 2026-07-28
edited: 2026-07-28
links: [[2026-07-28-spec-cv-humains-et-agents]]
ref: DATA-1
---

# Faire échouer le build si une section du CV est absente

**Risque R4 de la spec.** `cvParser.ts` attend un format strict dans
`src/content/cv/cv.md`. Un écart — un niveau de titre, une icône mal formée —
fait disparaître silencieusement des entrées : le build reste vert, la page
s'affiche, le CV est amputé. Un `console.warn` a été ajouté, mais un warning
dans un log de build n'arrête personne.

Le même angle mort a déjà coûté cher ailleurs sur ce projet : `parseCVContent`
retombait sur une chaîne vide quand `cvEntry.body` était `undefined`, ce qui
aurait produit un CV entièrement vide sans la moindre erreur.

## Ce qu'il faut faire

Déclarer les sections obligatoires et refuser de construire sans elles :
Coordonnées · Expériences · Compétences · Education.

Pour chacune, vérifier qu'elle est présente **et non vide** — une section
reconnue mais dont toutes les entrées ont été droppées est le cas le plus
pernicieux.

## Critères de done

- [ ] Liste des sections obligatoires déclarée explicitement dans le code, pas devinée
- [ ] Le build échoue avec un message nommant la section manquante ou vide
- [ ] Une entrée d'expérience mal formée est signalée, pas ignorée
- [ ] Test couvrant chaque cas : section absente, section vide, entrée mal formée
- [ ] `bun run build` et `bun test` verts sur le `cv.md` actuel

## Notes

Distinguer deux gravités : une **section** manquante casse le build ; une
**entrée** mal formée peut se contenter d'un avertissement bruyant — à
condition qu'il soit visible, pas noyé.

Attention à ne pas verrouiller le format au point de rendre l'édition du CV
pénible : le but est d'attraper l'amputation accidentelle, pas d'imposer une
grammaire rigide.
