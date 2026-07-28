---
title: CV en ligne lisible par les humains et par les agents
type: spec
status: wip
assigned: shuri
description: Spec fondatrice du site cv.drouet.io — un CV unique servi en HTML, Markdown et PDF, conçu pour être aussi exploitable par un agent IA que par un recruteur.
created: 2026-07-28
edited: 2026-07-28
links: []
priority: high
effort: L
tags: [spec, cv, agent-readable, seo]
spec: cv-humains-et-agents
outcome: >
  Trois signaux, relevés trimestriellement : (1) contacts entrants qualifiés
  attribuables au site — formulaire reçu via Resend + messages LinkedIn citant
  le site ; (2) restitution exacte du profil par 3 agents interrogés sur des
  requêtes types (relevé manuel, voir §9.3) ; (3) position sur « mathieu drouet »
  et présence sur « head of product lille » dans la Search Console.
  Un trimestre sans aucun des trois en progression = la spec est à rouvrir.
---

# CV en ligne lisible par les humains et par les agents

> `cv.drouet.io` est le CV de Mathieu Drouet, publié en site statique. Sa
> particularité n'est pas le contenu mais le contrat de lecture : le même profil
> est servi en HTML pour les humains, en Markdown pour les agents, en PDF pour
> les process RH — depuis une source unique. Le site est autant un CV qu'une
> démonstration de la pratique qu'il décrit.

## 1. Contexte et objectifs

Le site poursuit **deux objectifs simultanés**, assumés comme tels :

1. **Recherche de poste active** — déclencher des prises de contact pour un poste salarié.
2. **Vitrine freelance / consulting** — amener des missions.

Ces deux objectifs partagent le même contenu et le même parcours ; ils ne
justifient pas deux sites. Là où ils divergent (ton, appel à l'action), la
priorité va à la lisibilité commune plutôt qu'à l'optimisation de l'un des deux.

**Postulat fondateur** : le sourcing passera de plus en plus par des agents. Ce
n'est pas une vitrine technique, c'est une conviction — le dispositif
agent-readable est donc un axe de roadmap permanent, à maintenir quand les
standards bougent, pas un acquis figé.

## 2. Problème à résoudre

Un CV classique est optimisé pour un œil humain qui scanne 30 secondes. Quand un
agent le lit — pour répondre à « trouve-moi un Head of Product à Lille » — il
récupère du HTML de présentation d'où la structure sémantique a disparu, ou un
PDF dont l'extraction est hasardeuse. Le profil est présent mais mal restitué :
titres approximatifs, expériences tronquées, dates perdues.

Le site répond en publiant **le même contenu dans les trois formats attendus**,
avec les métadonnées de découverte qui permettent à un agent de les trouver sans
deviner.

## 3. Utilisateurs et cas d'usage

| Utilisateur | Ce qu'il vient chercher | Format servi |
|---|---|---|
| Recruteur / hiring manager | Crédibilité en 30 s, parcours, contact | HTML, puis PDF |
| Agent IA de sourcing | Données exactes, structurées, datées | `cv.md`, `llms.txt`, `agent-skills` |
| Client potentiel (mission) | Preuve de savoir-faire, approche | HTML `/about`, `about.md` |
| Pair / communauté produit | Partis pris, façon de travailler | HTML `/about` |

**Les deux premières cibles sont prioritaires à égalité.** Ce choix est
structurant : voir §4.3 pour les arbitrages qu'il impose.

## 4. Portée

### 4.1 Dans le périmètre

- CV complet en HTML, Markdown et PDF, depuis une **source unique** (`src/content/cv/cv.md`)
- Page `/about` : approche produit, AI-augmented delivery, ce qui est recherché
- Dispositif de découverte agent : `llms.txt`, `.well-known/api-catalog` (RFC 9727), `.well-known/agent-skills/` (agentskills.io v0.2.0)
- Négociation de contenu : `Accept: text/markdown` sert la source Markdown
- Content Signals : `search=yes`, `ai-train=no`, `ai-input=yes`
- Formulaire de contact (Pages Function + Resend)
- **Version anglaise complète** (voir §11, chantier majeur)

### 4.2 Hors périmètre — explicitement refusé

| Exclu | Raison |
|---|---|
| Blog / section éditoriale | Le site est un CV, pas une plateforme de publication |
| Études de cas détaillées | Les expériences restent au format CV ; le détail se discute de vive voix |
| CMS / édition en ligne | Le contenu vit dans `cv.md`, édité à la main et versionné dans git |
| Espace privé / contenu protégé | Tout est public ou n'existe pas |

Ces exclusions sont des décisions, pas des reports. Les rouvrir suppose de
rouvrir cette spec.

### 4.3 Arbitrages humains ↔ agents

« Servir les deux sans compromis » est tenable tant que les besoins ne
s'opposent pas. Quand ils s'opposent, l'ordre est le suivant :

1. **L'exactitude prime sur l'esthétique.** Une information juste et datée dans
   le Markdown vaut mieux qu'une mise en page qui la reformule.
2. **La source unique prime sur l'optimisation par canal.** On ne maintient pas
   une version « pour agents » qui divergerait du HTML : c'est le mode de panne
   le plus probable du dispositif (voir §10).
3. **Le HTML reste maître de la présentation**, le Markdown maître de la
   structure. Aucun des deux ne se déforme pour ressembler à l'autre.

## 5. Architecture et choix techniques

| Couche | Choix | Motif |
|---|---|---|
| Framework | Astro 7.1.4, sortie statique | 3 pages, aucun besoin de serveur au rendu |
| Contenu | Content Layer API, `src/content.config.ts` | Une collection `cv`, une collection `about` |
| Parsing | `src/utils/cvParser.ts` | Markdown structuré → données typées |
| Styles | Tailwind 4 (`@tailwindcss/vite`), design system « Lumon » | Thème unique après suppression d'Atari (§12) |
| Polices | Auto-hébergées, `public/fonts/*.woff2` | CSP `font-src 'self'`, aucune requête tierce |
| Icônes | Iconify via CDN + fetch au build | **Point faible assumé, voir §10** |
| Hébergement | Cloudflare Pages | `wrangler.toml`, `functions/` |
| Edge | `functions/_middleware.ts`, `functions/api/contact.ts` | Négociation Markdown, formulaire |
| Tests | Vitest — 38 tests (20 parser, 18 intégration) | Seul filet automatisé, voir §9.2 |

## 6. Le contrat agent-readable

C'est le cœur du produit. Quatre mécanismes, qui doivent rester cohérents entre eux :

1. **`llms.txt`** — point d'entrée lisible : résumé, index des ressources, contact, préférences d'usage IA.
2. **`.well-known/api-catalog`** (RFC 9727) — index machine des ressources publiées.
3. **`.well-known/agent-skills/`** (agentskills.io v0.2.0) — skill `cv-info` avec empreinte SHA-256 du `SKILL.md`.
4. **Négociation de contenu** — `Accept: text/markdown` sur `/` et `/about` renvoie `cv.md` / `about.md`. Les navigateurs continuent de recevoir du HTML, leur `Accept` préférant `text/html`.

**Invariant** : le hash déclaré dans `agent-skills/index.json` doit correspondre
au `SKILL.md` publié. Une désynchronisation rend la skill invérifiable, sans
qu'aucun test actuel ne le détecte (§12, tâche AGENT-2).

## 7. Données et modèle de contenu

**Source unique** : `src/content/cv/cv.md`, frontmatter + Markdown à format
strict. Les coordonnées viennent de `src/config/site.ts` (centralisées pour
éviter la divergence).

Sections attendues du CV : Coordonnées · Centres d'intérêt · Expériences ·
Compétences · Education.

> ⚠️ **Le parser échoue en silence.** Un écart de format dans `cv.md` fait
> disparaître des entrées sans lever d'erreur — le build reste vert et la page
> s'affiche, amputée. Un `console.warn` a été ajouté, mais rien ne casse le
> build. C'est le risque de contenu principal (§10).

## 8. Parcours clés

1. **Recruteur** : arrive sur `/` → scanne le hero et les expériences → télécharge le PDF ou ouvre le formulaire de contact.
2. **Agent de sourcing** : découvre `llms.txt` ou `api-catalog` → récupère `cv.md` → restitue le profil dans sa réponse.
3. **Client potentiel** : arrive sur `/` → va sur `/about` pour l'approche → contacte.

Le formulaire de contact est le seul canal de conversion instrumenté du site
(Resend vers `CONTACT_TO`). LinkedIn et l'email direct restent des canaux
parallèles, non mesurables depuis le site.

## 9. Qualité

### 9.1 Sécurité

CSP stricte définie dans `BaseLayout.astro` et `public/_headers` — les deux
doivent rester alignées. `font-src 'self'`, `frame-src 'none'`,
`object-src 'none'`. Seule exception réseau : `code.iconify.design` et les API
Iconify. Le formulaire valide et tronque ses champs côté edge.

### 9.2 Tests et validation

- 38 tests Vitest, seuil de couverture 80 %
- `bun run build` — vérifie le rendu des 3 pages
- **Pas de validation de types** : `astro check` est inopérant depuis le passage
  à TypeScript 7 (le compilateur natif n'expose plus l'API du language-server —
  [withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321)).
  Décision prise : rester en TS 7 et s'en passer. Le build et les tests sont le
  seul filet.

### 9.3 Observabilité — à construire

Le site n'a **aucune instrumentation** à ce jour. Les trois signaux de succès
(voir `outcome`) reposent donc sur :

| Signal | Outil | État |
|---|---|---|
| Présence dans les recherches | Google Search Console | à mettre en place |
| Trafic et provenance | Cloudflare Web Analytics | à activer |
| Contacts entrants | Emails Resend + mentions LinkedIn | comptage manuel |
| Restitution par les agents | **Relevé manuel trimestriel** | protocole écrit ([`PROTOCOLE.md`](../2026-07-28-task-protocole-de-releve-agent/PROTOCOLE.md)) · point zéro partiel du 28/07 dans `docs/audits/` |

> Aucun outil ne mesure la restitution par les agents. C'est la métrique la plus
> proche du pari fondateur, et la seule qui restera manuelle : interroger
> périodiquement 3 agents sur des requêtes types, archiver les réponses,
> constater les écarts. Sans ce relevé, le pari du §1 est invérifiable.

## 10. Risques et hypothèses

| # | Risque | Impact | Traitement |
|---|---|---|---|
| R1 | **Divergence des formats** — le HTML évolue, le `.md` ou le PDF non | Un agent restitue un profil périmé. Panne silencieuse. | Source unique obligatoire ; à couvrir par un test (§12, AGENT-1) |
| R2 | **Le bilinguisme double la surface** — 2 langues × 3 formats = 6 artefacts | Divergence quasi certaine à moyen terme | Décider d'une langue maîtresse ; générer plutôt que dupliquer |
| R3 | **Fetch réseau au build** vers `api.iconify.design` | Un timeout réseau casse le build et le déploiement | Inliner les SVG au build (§12, PERF-1) |
| R4 | **Parser silencieux** — un écart de format ampute le CV sans erreur | CV publié incomplet, sans alerte | Faire échouer le build sur section manquante |
| R5 | **Pas de type-check** depuis TS 7 | Erreurs de type non détectées | Assumé ; compensé par les tests |
| R6 | **Renovate monte les majeures sans garde-fou** | A déjà désactivé le type-check en silence (TS 7, PR #150) | Restreindre les majeures dans `renovate.json` |
| R7 | **Hash `agent-skills` désynchronisé** | Skill invérifiable pour un agent qui contrôle | Vérifier le hash au build |

**Hypothèse centrale, non vérifiée** : les agents de sourcing lisent
effectivement `llms.txt` et les `agent-skills`. Le relevé trimestriel (§9.3) est
ce qui la testera.

## 11. Roadmap

**Jalon 1 — Rendre le pari mesurable.** Sans mesure, aucune décision ultérieure
n'est fondée. Search Console, Cloudflare Web Analytics, protocole de relevé agent.

**Jalon 2 — Fiabiliser la source unique.** Tests de cohérence entre HTML,
Markdown et PDF ; échec du build sur CV amputé ; vérification du hash agent-skills.

**Jalon 3 — Bilingue FR/EN.** Le plus gros chantier. À n'engager qu'une fois le
jalon 2 acquis : dupliquer 6 artefacts sans garde-fou de cohérence, c'est
organiser la divergence.

**Jalon 4 — Dette.** Suppression du thème Atari, inlining des SVG, garde-fou Renovate.

## 12. TODO priorisée

| ID | P | Tâche | Effort |
|---|---|---|---|
| `OBS-1` | P0 | Activer Cloudflare Web Analytics | XS |
| `OBS-2` | P0 | Déclarer le site dans la Search Console + soumettre le sitemap | S |
| `OBS-3` | P1 | Écrire le protocole de relevé agent (requêtes types, grille, archivage) | S |
| `AGENT-1` | P1 | Test de cohérence HTML ↔ `cv.md` ↔ `llms.txt` (mêmes titre, poste, contact) | M |
| `AGENT-2` | P1 | Vérifier au build le SHA-256 déclaré dans `agent-skills/index.json` | S |
| `DATA-1` | P1 | Faire échouer le build si une section attendue de `cv.md` est absente | M |
| `FIX-1` | P2 | Supprimer le thème Atari (`content.config.ts`, `global.css`) | XS |
| `PERF-1` | P2 | Inliner les SVG Iconify au build — supprime le SPOF réseau | M |
| `SEC-1` | P2 | Restreindre les montées majeures dans `renovate.json` | XS |
| `I18N-1` | P2 | Choisir la stratégie bilingue (langue maîtresse, génération, `hreflang`) | M |
| `I18N-2` | P3 | Implémenter la version anglaise (HTML + ressources machine) | XL |

## 13. Annexes

### Glossaire

- **Agent-readable** — publié dans un format et avec des métadonnées permettant à un agent IA de découvrir et exploiter le contenu sans scraping ni heuristique.
- **Content Signals** — déclaration d'usage autorisé du contenu par les systèmes IA (indexation, entraînement, grounding).
- **Négociation de contenu** — le serveur choisit la représentation selon l'en-tête `Accept` du client.
- **Source unique** — un seul fichier fait autorité ; tous les formats publiés en dérivent.

### Références

- [llms.txt](https://llmstxt.org/) — convention de point d'entrée pour les LLM
- [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727.html) — `api-catalog` well-known URI
- [agentskills.io](https://agentskills.io/) — schéma des skills exposées aux agents
- [withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321) — suivi du support TypeScript 7

### Historique

Première spec du projet. Le site existait depuis avril 2026 sans document de
référence : seulement de la reverse doc (`docs/00→06`, 10 avril) décrivant un
état — Netlify, Astro 6 — abandonné depuis. Cette spec est écrite après
vérification du code au 28 juillet 2026, non d'après cette documentation.
