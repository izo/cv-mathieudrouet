---
title: Test de cohérence HTML ↔ cv.md ↔ llms.txt
type: task
status: todo
assignee: task-runner
priority: high
effort: M
tags: [test, agent-readable, jalon-2]
created: 2026-07-28
edited: 2026-07-28
links: [[2026-07-28-spec-cv-humains-et-agents]]
ref: AGENT-1
---

# Test de cohérence HTML ↔ cv.md ↔ llms.txt

**Risque R1 de la spec** : le HTML évolue, le Markdown ou le `llms.txt` non. Un
agent restitue alors un profil périmé — sans que rien ne casse, ni build, ni
test, ni affichage. C'est le mode de panne le plus probable du dispositif
agent-readable, et le plus silencieux.

Aujourd'hui `llms.txt` et `public/cv.md` sont des fichiers statiques dans
`public/`, maintenus à la main, tandis que le HTML est généré depuis
`src/content/cv/cv.md`. Rien ne garantit qu'ils racontent la même chose.

## Ce qu'il faut vérifier

Les invariants qu'un agent restituerait, donc ceux dont la divergence coûte cher :

| Donnée | Sources à comparer |
|---|---|
| Nom | `siteConfig.author.name`, `dist/index.html`, `public/cv.md`, `public/llms.txt` |
| Intitulé de poste | `siteConfig.author.jobTitle`, frontmatter de `cv.md`, HTML, `llms.txt` |
| Email | `siteConfig.author.email`, `public/cv.md`, `public/llms.txt` |
| Localisation | `siteConfig.author.location`, `llms.txt` |
| URLs des ressources annoncées | `llms.txt`, `.well-known/api-catalog` → doivent exister dans `dist/` |

## Critères de done

- [ ] Tests ajoutés à `tests/integration.test.ts` (ou nouveau `tests/agent-readable.test.ts`)
- [ ] Un écart sur l'un des invariants **fait échouer la suite**
- [ ] Chaque ressource listée dans `llms.txt` et `api-catalog` est vérifiée comme existant réellement dans `dist/`
- [ ] Suite toujours verte sur l'état actuel du dépôt — si elle est rouge, c'est une divergence réelle : la corriger avant de fusionner

## Notes

Ne pas comparer les textes intégralement : ils ont des formes légitimement
différentes. Comparer les **faits** — mêmes nom, poste, email, localisation.

Une divergence détectée à l'écriture de ce test n'est pas un bug du test.
