---
title: Test de cohérence HTML ↔ cv.md ↔ llms.txt
type: task
status: done
completed: 2026-07-28
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

- [x] Suite dédiée créée : `tests/agent-readable.test.ts` (12 tests)
- [x] Un écart sur l'un des invariants **fait échouer la suite** — vérifié par mutation, voir ci-dessous
- [x] Chaque ressource listée dans `llms.txt` et `api-catalog` est vérifiée comme existant réellement dans `dist/`
- [x] Suite verte : 50 tests, 0 échec

## Ce que la suite verrouille

**Source unique** — `public/cv.md`, `public/about.md` et le `dist/cv.md` servi
doivent être identiques à leurs sources. C'est le verrou principal : aucun
script ne génère ces copies, elles sont maintenues à la main.

**Invariants de profil** — intitulé de poste complet, nom, email et localisation
présents et cohérents entre `siteConfig`, la source du CV, `llms.txt` et le HTML
produit. Les faits sont comparés, pas les formulations : l'échappement HTML de
l'esperluette est pris en compte.

**Ressources annoncées** — chaque URL locale citée par `llms.txt` et
l'`api-catalog` doit exister dans le build.

**Empreintes** — reprend AGENT-2 : le SHA-256 de chaque `SKILL.md` déclaré est
recalculé et comparé, avec un message d'échec qui donne la commande de correction.

## Divergence trouvée à l'écriture

Conformément à la note initiale, le test rouge a désigné un défaut réel, pas un
bug de test : **l'`api-catalog` annonçait `/sitemap.xml`, qui n'existe pas** —
c'est une redirection 301 vers `/sitemap-index.xml` (Astro 7 ne génère plus le
premier nom).

Un navigateur suit la redirection sans broncher, mais un catalogue destiné aux
machines doit donner l'URL canonique plutôt qu'un détour. Corrigé à la source :
l'`api-catalog` pointe désormais directement sur `/sitemap-index.xml`. La
redirection reste en place pour les liens externes existants.

## Preuve de détection

Les tests ont été mutés pour vérifier qu'ils peuvent échouer :

| Mutation | Résultat |
|---|---|
| `public/cv.md` diverge de sa source | 1 échec ✅ |
| `SKILL.md` modifié sans recalcul du hash | 1 échec ✅ |
| État restauré | 0 échec |

Ce sont exactement les deux pannes rencontrées le 2026-07-28.
