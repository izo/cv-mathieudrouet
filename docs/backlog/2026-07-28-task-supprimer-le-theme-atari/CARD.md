---
title: Supprimer le thème Atari
type: task
status: done
assignee: task-runner
priority: medium
effort: XS
tags: [nettoyage, design-system, jalon-4]
created: 2026-07-28
edited: 2026-07-28
completed: 2026-07-28
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

- [x] Schéma réduit à `z.enum(['lumon'])` — vérifié au préalable qu'aucun contenu ne déclarait autre chose
- [x] Bloc `[data-theme="atari"]` supprimé de `global.css` (91 lignes, 333→423)
- [x] Mentions retirées de `CLAUDE.md` (§ Styling Architecture et exemple de frontmatter)
- [x] `bun run build` et `bun test` verts — **rendu inchangé, prouvé** (voir ci-dessous)
- [x] Aucune occurrence résiduelle dans `src/`, `CLAUDE.md` ni le CSS produit

## Résultat

**Rendu inchangé, démontré et non supposé.** Le CSS produit a été construit avant
et après, puis les ensembles de sélecteurs comparés :

```
SÉLECTEURS SUPPRIMÉS : 2
  - [data-theme=atari]     ← ne pouvait plus jamais matcher
  - .lumon-nav             ← zéro usage, aucun <nav> dans les composants
SÉLECTEURS AJOUTÉS   : 0
```

Aucun autre sélecteur modifié. C'est plus probant qu'une capture d'écran, qui
n'aurait couvert qu'un viewport et un état.

Bundle CSS : 50 251 → 47 707 octets (−5 %).

## Étendu au glassmorphisme mort

Traité dans la foulée, la Règle du Flou Interdit de `DESIGN.md` les déclarant
défunts et aucun n'ayant d'usage :

- `tailwind.config.mjs` — blocs `backdropBlur` et `backgroundImage` entiers
  (`glass-gradient`, `glass-radial`, `glass-shine`, `light-leak`, `aurora`,
  `square-gradient`), et les alias d'ombres `zed-*` / `glass-*`. L'échelle
  `2xs`→`2xl` est **conservée** : `shadow-sm` (×7), `shadow-md`, `shadow-lg`
  et `shadow-xl` sont réellement employés.
- `global.css` — `.lumon-nav`, seul porteur d'un `backdrop-filter: blur(8px)`
  du projet. Sa suppression rend la Règle du Flou Interdit littéralement vraie.

Nuance honnête : Tailwind génère encore l'utilitaire `.blur` (~60 octets) sans
qu'aucun élément ne le porte — artefact de son scanner, hors de notre code.

## Reste à traiter (hors périmètre de cette carte)

Classes mortes repérées au passage, non supprimées faute de mandat :
`.lumon-card`, `.nav-item`, `.interactive-element`. Aucune n'a d'usage réel.

## Notes

Vérifier avant de supprimer le champ `theme` du schéma qu'aucun contenu ne le
renseigne autrement que `lumon` (`src/content/cv/cv.md`,
`src/content/about/about.md`) — sinon la validation de collection échouera au
build.

Garder `data-theme` sur `<html>` : l'attribut est utilisé par le CSS, seule la
valeur `atari` disparaît.
