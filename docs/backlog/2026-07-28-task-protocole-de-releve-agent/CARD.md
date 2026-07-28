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

- [ ] `PROTOCOLE.md` écrit dans ce dossier, exécutable par quelqu'un d'autre sans explication orale
- [ ] Premier relevé effectué et archivé — il fait office de point zéro
- [ ] Cadence inscrite dans la spec (§9.3) : trimestrielle

## Notes

Ne pas chercher à automatiser à ce stade : un protocole manuel qu'on suit vaut
mieux qu'un script qu'on n'écrit jamais. L'automatisation ne se justifiera que
si le relevé manuel tient sur deux trimestres.

Si le premier relevé montre que les agents ne lisent ni `llms.txt` ni les
`agent-skills`, c'est l'hypothèse centrale de la spec (§10) qui est en cause —
et la roadmap est à rouvrir, pas la mise en œuvre.
