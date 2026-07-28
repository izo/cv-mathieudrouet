---
title: Activer Cloudflare Web Analytics
type: task
status: todo
assignee: mathieu
priority: high
effort: XS
tags: [observabilite, jalon-1]
created: 2026-07-28
edited: 2026-07-28
links: [[2026-07-28-spec-cv-humains-et-agents]]
ref: OBS-1
---

# Activer Cloudflare Web Analytics

Le site n'a **aucune instrumentation**. Deux des trois signaux d'outcome de la
spec (§9.3) reposent sur une mesure qui n'existe pas.

Le site étant déjà sur Cloudflare Pages, les Web Analytics sont disponibles sans
coût, sans cookie et sans script tiers à charger depuis un autre domaine.

## Pourquoi celle-ci d'abord

C'est la tâche la moins chère du backlog et elle conditionne toutes les
décisions suivantes : tant qu'on ne sait pas d'où vient le trafic, arbitrer
entre bilinguisme, SEO et dispositif agent revient à parier.

## Critères de done

- [ ] Web Analytics activé sur le projet `cv-mathieudrouet-2025` (dashboard Cloudflare)
- [ ] Données visibles après 48 h : pages vues, référents, pays
- [ ] Si l'activation injecte un beacon script : CSP de `BaseLayout.astro` **et** `public/_headers` mises à jour de façon cohérente (les deux doivent rester alignées — §9.1)
- [ ] `bun run build` et `bun test` toujours verts

## Notes

Cloudflare propose deux modes : automatique (injection par la plateforme, aucun
changement de code) ou manuel (balise `<script>`). **Préférer l'automatique** —
il évite de toucher à la CSP, donc de rouvrir un point de sécurité pour une
mesure de confort.

Action d'infra : à exécuter depuis le dashboard, pas depuis le dépôt.
