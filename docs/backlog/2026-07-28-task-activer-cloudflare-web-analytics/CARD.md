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
- [ ] CSP ouverte vers `static.cloudflareinsights.com` dans `BaseLayout.astro` **et** `public/_headers` — les deux doivent rester alignées (§9.1)
- [ ] Beacon effectivement chargé : aucune erreur CSP dans la console du navigateur
- [ ] Données visibles après 48 h : pages vues, référents, pays
- [ ] `bun run build` et `bun test` verts

## Procédure

1. Dashboard Cloudflare → **Pages** → `cv-mathieudrouet-2025` → onglet **Metrics**, ou
   **Analytics & Logs → Web Analytics** → *Add a site* sur `cv.drouet.io`.
2. Choisir l'activation automatique.
3. **Redéployer** — l'injection se fait au déploiement, pas au edge : tant que le
   build servi est antérieur à l'activation, aucun beacon n'apparaît dans le HTML.
4. Ouvrir la CSP (diff ci-dessous) et vérifier que le beacon charge réellement.

## Journal

**2026-07-28 — activé au dashboard.** Vérification du HTML servi juste après :
aucune trace de `cloudflareinsights`, `beacon` ni `insights` dans les 61 800
octets de `https://cv.drouet.io`. Attendu : Pages injecte au déploiement, et
l'ETag servi correspondait au build antérieur. Ce commit déclenche un nouveau
déploiement pour lever le doute.

Si le beacon n'apparaît toujours pas après ce déploiement, c'est que le mode
retenu est le Web Analytics *standalone* (**Add a site**), qui ne fait aucune
injection et fournit un extrait `<script>` à poser soi-même dans le layout.

## ⚠️ Correction du 2026-07-28 — la note initiale était fausse

Elle affirmait : « préférer l'automatique, il évite de toucher à la CSP ».
**C'est faux.** Même injecté par la plateforme, le beacon est chargé depuis
`https://static.cloudflareinsights.com/beacon.min.js` et envoie ses données vers
ce même domaine. La CSP du projet le bloquera dans les deux modes :

```
script-src      'self' 'unsafe-inline' https://code.iconify.design
script-src-elem 'self' 'unsafe-inline' https://code.iconify.design
connect-src     'self' https://api.iconify.design …
```

Modification nécessaire, à appliquer **aux deux endroits** (`BaseLayout.astro`
et `public/_headers`, qui doivent rester identiques) :

```diff
- script-src 'self' 'unsafe-inline' https://code.iconify.design
+ script-src 'self' 'unsafe-inline' https://code.iconify.design https://static.cloudflareinsights.com
- script-src-elem 'self' 'unsafe-inline' https://code.iconify.design
+ script-src-elem 'self' 'unsafe-inline' https://code.iconify.design https://static.cloudflareinsights.com
- connect-src 'self' https://api.iconify.design …
+ connect-src 'self' https://api.iconify.design … https://static.cloudflareinsights.com
```

C'est un arbitrage assumé : une origine tierce de plus dans la CSP, en échange
de la seule mesure de trafic du site. Elle n'est pas ouverte d'avance — inutile
d'affaiblir la politique pour un script qui n'est pas encore là.

Action d'infra : l'activation se fait au dashboard, pas depuis le dépôt.
