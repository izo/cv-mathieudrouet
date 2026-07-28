---
title: Écrire le protocole de relevé agent
type: task
status: todo
assignee: task-runner
priority: high
effort: S
tags: [observabilite, agent-readable, jalon-1]
created: 2026-07-28
edited: 2026-07-28
links: [[2026-07-28-spec-cv-humains-et-agents]]
ref: OBS-3
---

# Écrire le protocole de relevé agent

C'est la métrique la plus proche du pari fondateur de la spec (§1) — *les agents
trouveront les gens* — et **la seule qu'aucun outil ne mesure**. Elle restera
manuelle : reste à la rendre reproductible, sinon elle ne sera jamais relevée.

## Ce qu'il faut produire

Un document court dans ce dossier (`PROTOCOLE.md`) définissant :

1. **Les requêtes types** — 5 à 8, mêlant recherche nominative (« qui est Mathieu Drouet »)
   et recherche par besoin (« head of product à Lille avec de l'expérience IA »).
2. **Les agents interrogés** — 3 minimum, aux modes d'accès au web différents.
3. **La grille de lecture** — pour chaque réponse : poste exact ? localisation ?
   expériences récentes ? contact ? source citée ? erreur factuelle ?
4. **L'archivage** — réponses brutes horodatées, pour comparer d'un trimestre à l'autre.
5. **Le seuil de réaction** — à partir de quel écart on considère que le dispositif
   agent-readable doit être corrigé.

## Critères de done

- [x] `PROTOCOLE.md` écrit dans ce dossier — 8 requêtes, 3 agents, grille de cotation, gabarit d'archivage, seuils de réaction
- [~] Premier relevé **partiel** archivé : `docs/audits/releve-agent-2026-07-28.md`. Couvre la couche recherche web ; les trois agents en session neuve restent à interroger — je n'ai pas accès à ChatGPT ni Perplexity
- [x] Cadence trimestrielle inscrite dans la spec (§9.3), avec lien vers le protocole

## Ce que le point zéro partiel a montré

**Le pari n'est pas gagné aujourd'hui**, et le relevé le chiffre :

| Requête | Résultat |
|---|---|
| Nominative | `cv.drouet.io` remonte **2ᵉ**, derrière LinkedIn — mais sous le titre **périmé** « Senior Product Manager » |
| Par besoin (le scénario de sourcing) | **absent** — des profils comparables occupent la place, dont un lillois au positionnement voisin |

Le résumé généré comportait deux erreurs factuelles (« plus de vingt ans » au
lieu de 10+, « CPO » au lieu de Head of Product & Product Builder). Elles ne
viennent pas du site mais d'agrégations tierces — exactement le mode de
défaillance que le dispositif agent-readable doit prévenir : quand la source
canonique n'est pas lue, une autre parle à sa place.

**Deux actions désignées par ce relevé :** faire remonter `OBS-2` en priorité
(l'index sert un titre périmé, la Search Console permet d'en demander la
réindexation), et aligner LinkedIn sur l'intitulé qui fait foi — c'est la source
que les moteurs citent en premier, et elle contredit le site.

## Notes

Ne pas chercher à automatiser à ce stade : un protocole manuel qu'on suit vaut
mieux qu'un script qu'on n'écrit jamais. L'automatisation ne se justifiera que
si le relevé manuel tient sur deux trimestres.

Si le premier relevé montre que les agents ne lisent ni `llms.txt` ni les
`agent-skills`, c'est l'hypothèse centrale de la spec (§10) qui est en cause —
et la roadmap est à rouvrir, pas la mise en œuvre.
