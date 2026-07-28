---
title: Faire échouer le build si une section du CV est absente
type: task
status: done
completed: 2026-07-28
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

- [x] `REQUIRED_CV_SECTIONS` déclaré explicitement dans `cvParser.ts`
- [x] Le build échoue en nommant chaque section manquante ou vide — **vérifié par mutation**
- [x] Une entrée mal formée produit un avertissement nommant l'employeur concerné
- [x] 17 tests dans `tests/cv-validation.test.ts` : section absente, vide, entrée incomplète, CV nul
- [x] `bun run build` et `bun test` verts sur le `cv.md` actuel, **sans aucun avertissement**

## Implémentation

Deux fonctions ajoutées à `cvParser.ts`, appelées depuis `src/pages/index.astro` :

- `validateCVData(data)` — inspecte sans interrompre, retourne les anomalies
- `assertCVComplete(data)` — émet les avertissements puis lève si une section manque

**Elles vivent délibérément hors du `try/catch` de `parseCVContent`.** Ce catch
renvoie une structure entièrement vide en cas d'erreur : une validation placée
dedans aurait vu ses propres exceptions avalées par le mécanisme même qu'elle
doit surveiller.

Deux gravités, comme prévu : une **section** absente ou vide casse le build ;
une **entrée** incomplète est signalée par un `console.warn` qui nomme
l'employeur, sans bloquer la publication.

## Preuve par mutation

```
cv.md réduit à son frontmatter  →  build exit 1
    [ERROR] CV amputé — le build est interrompu.
      · Education : aucune formation reconnue
      · Expériences : aucune expérience reconnue
      · Compétences : aucune compétence reconnue
état restauré                    →  build vert, aucun avertissement
```

## Correction factuelle de cette carte

La description initiale affirmait qu'« un écart — un niveau de titre, une icône
mal formée — fait disparaître silencieusement des entrées ». **Vérifié : c'est
faux pour le niveau de titre.** Passer `## Expériences` en `### Expériences`
laisse le parser retrouver ses 7 expériences — il s'accroche aux entrées
elles-mêmes, pas au titre de section.

Le risque R4 reste réel (le catch renvoie du vide, les entrées non conformes
sont droppées), mais il est plus étroit qu'annoncé. Noté pour ne pas propager
une croyance non testée.

Attention à ne pas verrouiller le format au point de rendre l'édition du CV
pénible : le but est d'attraper l'amputation accidentelle, pas d'imposer une
grammaire rigide.
