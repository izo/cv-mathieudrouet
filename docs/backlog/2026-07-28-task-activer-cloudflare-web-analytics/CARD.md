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

## Journal — 2026-07-28 : mis en pause, diagnostic établi

**Web Analytics activé au dashboard, mais le beacon ne s'injecte jamais.**
Trois tentatives, toutes vérifiées sur le HTML réellement servi :

| Tentative | Résultat |
|---|---|
| Activation *Analytics & Logs → Add a site*, puis déploiement | aucun beacon |
| Activation dans **Settings du projet Pages** | `build_config.web_analytics_tag` reste **`null`** |
| Déploiement neuf forcé par API (`ad209165`, commit `dddf189`) | aucun beacon, `tag WA: null` |

Contrôles faits sur `https://cv.drouet.io` **et** sur l'URL de déploiement
directe (`*.pages.dev`), pour écarter le cache.

**Conclusion : l'auto-injection Pages ne fonctionne pas ici.** La cause exacte
n'a pas pu être établie — l'API RUM (`/rum/site_info/list`) répond 403 avec le
token disponible, qui porte Pages et comptes mais pas `Account Analytics`.

## Reprise — la voie fiable

Ne pas repartir sur l'auto-injection : poser le script soi-même fonctionne quel
que soit l'état de l'intégration Pages.

1. Récupérer le **site token** : *Analytics & Logs → Web Analytics → le site →
   Manage site*. C'est une valeur **publique** de 32 caractères hexadécimaux,
   destinée au HTML — à ne pas confondre avec un token API (préfixe `cfut_`).
2. Poser le script dans `BaseLayout.astro` :
   ```html
   <script defer src="https://static.cloudflareinsights.com/beacon.min.js"
           data-cf-beacon='{"token": "<site-token>"}'></script>
   ```
3. Ouvrir la CSP **aux deux endroits** (`BaseLayout.astro` et `public/_headers`,
   qui doivent rester identiques) — voir le diff plus bas.
4. Vérifier que le beacon charge sans erreur console avant de clore la carte.

> Pas de `integrity` (SRI) sur ce script : Cloudflare publie `beacon.min.js`
> sans empreinte figée et le met à jour, donc un SRI casserait à la première
> version. C'est un arbitrage assumé — une origine tierce de plus, non
> vérifiable, en échange de la seule mesure d'audience du site. Le seul autre
> script externe du projet (`code.iconify.design`) est dans le même cas.

Alternative : un token portant `Account → Account Analytics → Edit` permet de
créer le site RUM et de renseigner la config du projet entièrement par API,
sans passer par le dashboard.

> Trace : un déploiement supplémentaire (`ad209165`) a été créé pendant ce
> diagnostic. Sans conséquence — même commit que la production, contenu
> identique.

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
