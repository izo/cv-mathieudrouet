---
title: Déclarer le site dans la Search Console
type: task
status: todo
assignee: mathieu
priority: high
effort: S
tags: [observabilite, seo, jalon-1]
created: 2026-07-28
edited: 2026-07-28
links: [[2026-07-28-spec-cv-humains-et-agents]]
ref: OBS-2
---

# Déclarer le site dans la Search Console

Le troisième signal d'outcome — position sur « mathieu drouet », présence sur
« head of product lille » — n'est mesurable que là.

## Critères de done

- [ ] Propriété `cv.drouet.io` vérifiée (DNS chez Cloudflare : la vérification par enregistrement TXT est la plus simple)
- [ ] `sitemap-index.xml` soumis — attention, Astro 7 génère bien `sitemap-index.xml` et non `sitemap.xml`, une redirection existe déjà
- [ ] Aucune erreur de couverture bloquante sur les 3 pages (`/`, `/about`, `/404`)
- [ ] Relevé initial archivé : position sur le nom, impressions sur les requêtes métier — c'est le point zéro auquel comparer les trimestres suivants

## Procédure

1. [search.google.com/search-console](https://search.google.com/search-console) → *Ajouter une propriété* → **Préfixe d'URL** : `https://cv.drouet.io`
2. Vérification par **enregistrement TXT** — le DNS est chez Cloudflare, c'est le chemin le plus court. Google donne la valeur, à créer dans Cloudflare DNS.
3. *Sitemaps* → soumettre **`sitemap-index.xml`** (et non `sitemap.xml`, voir ci-dessous).
4. Relever le point zéro : position sur « mathieu drouet », impressions sur les requêtes métier. Sans lui, aucune progression ultérieure ne sera démontrable.

## Prérequis vérifiés le 2026-07-28

| Contrôle | État |
|---|---|
| `https://cv.drouet.io/sitemap-index.xml` | HTTP 200 |
| `https://cv.drouet.io/robots.txt` | HTTP 200 |
| Content Signals (`search=yes`) | n'entrave pas l'indexation |
| `Allow: /` | aucun blocage |

**Un défaut corrigé au passage.** `robots.txt` déclarait
`Sitemap: https://cv.drouet.io/sitemap.xml` — un fichier qui n'existe pas :
c'est une redirection 301 vers `/sitemap-index.xml`, Astro 7 ne générant plus ce
nom. C'est par là que les moteurs découvrent le sitemap ; les faire passer par
une redirection avant la première URL était un détour inutile. Corrigé, et
couvert par un test (`tests/agent-readable.test.ts`).

Action d'infra : la déclaration se fait depuis la Search Console.
