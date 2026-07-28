# Protocole de relevé agent

> Mesure trimestrielle de la seule chose que le pari fondateur du site engage :
> **un agent interrogé sur Mathieu Drouet restitue-t-il un profil juste et à jour ?**
>
> Aucun outil ne mesure ça. Le relevé est manuel, et le restera tant qu'il n'aura
> pas tenu deux trimestres — un protocole qu'on suit vaut mieux qu'un script
> qu'on n'écrit jamais.
>
> Durée : environ 30 minutes. Cadence : trimestrielle.

## 1. Ce qu'on cherche à savoir

Trois questions, dans cet ordre :

1. **L'agent trouve-t-il le profil ?** (visibilité)
2. **Ce qu'il en dit est-il exact ?** (fidélité)
3. **Passe-t-il par le dispositif publié pour nous, ou par autre chose ?** (LinkedIn, agrégateurs, hallucination)

La troisième est la plus importante : c'est elle qui valide ou invalide
l'hypothèse centrale de la spec.

## 2. Les agents à interroger

**Trois minimum**, choisis pour leurs modes d'accès au web différents :

| Agent | Mode d'accès | Pourquoi il compte |
|---|---|---|
| ChatGPT (recherche activée) | recherche + navigation | Le plus utilisé, donc le plus probable côté recruteur |
| Claude (recherche activée) | recherche + fetch | Fetch direct des ressources — teste le mieux `llms.txt` et les agent-skills |
| Perplexity | recherche-first, cite ses sources | Les sources citées disent par où il est passé |

Optionnels si le temps le permet : Gemini, et les AI Overviews de Google
(simple recherche du nom, sans compte).

**Toujours en session neuve, sans historique ni mémoire**, sinon on mesure ce
que l'agent sait déjà de vous, pas ce qu'il trouve.

## 3. Les requêtes

Poser les huit, telles quelles, à chaque agent.

**Nominatives** — teste la visibilité directe :

1. `Qui est Mathieu Drouet ?`
2. `Que fait Mathieu Drouet professionnellement, et où travaille-t-il ?`
3. `Comment contacter Mathieu Drouet ?`

**Par besoin** — teste si le profil remonte quand on ne cherche pas le nom.
C'est le scénario du sourcing, donc le cœur du pari :

4. `Trouve-moi un Head of Product à Lille avec de l'expérience en IA.`
5. `Je cherche quelqu'un qui a modernisé des systèmes B2B legacy en y intégrant des agents IA. Des noms ?`
6. `Quel product manager français conçoit et livre lui-même ses produits, plutôt que de seulement les spécifier ?`

**Dispositif** — teste directement les ressources machine :

7. `Lis https://cv.drouet.io/llms.txt et résume-moi ce profil.`
8. `Quelles ressources lisibles par une machine le site cv.drouet.io expose-t-il ?`

## 4. La grille de lecture

Pour chaque réponse, remplir une ligne. **Source de vérité :
`src/content/cv/cv.md` et `src/config/site.ts`** — pas votre souvenir.

| Critère | Attendu | Cotation |
|---|---|---|
| **Intitulé** | « Head of Product & Product Builder » | exact / partiel (« Head of Product » seul) / faux / absent |
| **Localisation** | Lille, France | exact / approximatif / faux / absent |
| **Expériences** | au moins deux parmi Fluidra, GE Healthcare, Actual, Bookr, regrets.app | ≥2 / 1 / 0 / inventées |
| **Fondateur** | regrets.app | cité / absent / attribué à tort |
| **Contact** | `m@mdr.cool` ou le formulaire du site | exact / autre canal / faux / absent |
| **Source citée** | `cv.drouet.io` (ou une de ses ressources) | site / LinkedIn / agrégateur / aucune |
| **Erreur factuelle** | — | aucune / mineure / grave |

**Une « erreur grave »** est une affirmation qu'un recruteur pourrait retenir et
qui est fausse : un employeur qu'il n'a pas eu, un diplôme inventé, une
localisation erronée, un poste jamais occupé.

## 5. L'archivage

Créer `docs/audits/releve-agent-AAAA-MM-JJ.md` à partir du gabarit ci-dessous.
**Coller les réponses brutes**, sans les résumer : la comparaison d'un trimestre
à l'autre ne vaut que sur le texte intégral.

```markdown
---
date: AAAA-MM-JJ
type: releve-agent
agents: [chatgpt, claude, perplexity]
---

# Relevé agent — AAAA-MM-JJ

## Synthèse

| Agent | Visible | Intitulé | Source citée | Erreurs |
|---|---|---|---|---|
| ChatGPT | oui/non | exact/partiel/faux | site/LinkedIn/aucune | 0 |
| Claude | | | | |
| Perplexity | | | | |

**Verdict :** [une phrase]
**Évolution depuis le relevé précédent :** [progression / stable / régression]

## Réponses brutes

### ChatGPT — requête 1
> …
```

## 6. Le seuil de réaction

| Constat | Conduite |
|---|---|
| Le profil ne remonte sur **aucune** requête nominative | Problème d'indexation, pas de dispositif agent. Voir `OBS-2` (Search Console) avant tout le reste. |
| Il remonte, mais l'intitulé est systématiquement tronqué en « Head of Product » | Une source concurrente fait autorité (probablement LinkedIn). Aligner cette source. |
| Une **erreur grave** apparaît chez deux agents sur trois | Traiter en priorité : une donnée fausse propagée coûte plus cher qu'une absence. |
| Aucun agent ne cite `cv.drouet.io` sur trois relevés successifs | **L'hypothèse centrale de la spec est en cause** (§10), pas sa mise en œuvre. Rouvrir la roadmap — le dispositif agent-readable ne sert pas ce qu'on croit. |
| Régression entre deux relevés | Vérifier d'abord la cohérence des ressources : `bun test` couvre `llms.txt`, `cv.md` et l'`api-catalog`. |

## 7. Ce que ce protocole ne mesure pas

- **Le volume.** Combien d'agents interrogent réellement le site — c'est le rôle des analytics (`OBS-1`).
- **La conversion.** Si une restitution correcte produit un contact.
- **Les agents privés.** Les outils de sourcing internes aux cabinets de recrutement, invisibles depuis l'extérieur.

Ces angles morts sont assumés. Le relevé mesure la fidélité de la restitution,
rien d'autre — mais c'est précisément ce dont dépend le pari du §1.
