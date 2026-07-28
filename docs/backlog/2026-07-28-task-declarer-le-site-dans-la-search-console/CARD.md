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

## Notes

Le point zéro compte autant que l'outil : sans lui, une progression ultérieure
ne sera pas démontrable.

Vérifier au passage que `robots.txt` et les Content Signals (`search=yes`,
`ai-train=no`, `ai-input=yes`) ne bloquent rien involontairement pour les
crawlers de recherche.

Action d'infra : à exécuter depuis la Search Console.
