---
title: Supprimer le thème Atari
type: task
status: todo
assignee: task-runner
priority: medium
effort: XS
tags: [nettoyage, design-system, jalon-4]
created: 2026-07-28
edited: 2026-07-28
links: [[2026-07-28-spec-cv-humains-et-agents]]
ref: FIX-1
---

# Supprimer le thème Atari

Le thème alternatif « Atari » (palette bleu/beige, style CRT) survit dans le
schéma de contenu et les styles, alors que `cv.md` est figé sur `lumon` et que
la spec ne retient qu'un seul thème. Décision prise le 28/07 : le supprimer.

## Emplacements repérés

- `src/content.config.ts` — valeur `atari` dans le schéma du champ `theme`
- `src/styles/global.css` — 4 blocs de styles liés au thème
- `CLAUDE.md` — le documente comme variante supportée
- `src/layouts/BaseLayout.astro` — attribut `data-theme` (à conserver, il porte `lumon`)

## Critères de done

- [ ] Schéma de contenu réduit à `lumon`, ou champ `theme` retiré si plus aucun choix
- [ ] Blocs CSS `atari` supprimés de `global.css`
- [ ] Mention retirée de `CLAUDE.md`
- [ ] `bun run build` et `bun test` verts — le rendu de `/` et `/about` est inchangé
- [ ] Aucune occurrence résiduelle : `grep -ri atari src/ CLAUDE.md` ne renvoie rien

## Notes

Vérifier avant de supprimer le champ `theme` du schéma qu'aucun contenu ne le
renseigne autrement que `lumon` (`src/content/cv/cv.md`,
`src/content/about/about.md`) — sinon la validation de collection échouera au
build.

Garder `data-theme` sur `<html>` : l'attribut est utilisé par le CSS, seule la
valeur `atari` disparaît.
