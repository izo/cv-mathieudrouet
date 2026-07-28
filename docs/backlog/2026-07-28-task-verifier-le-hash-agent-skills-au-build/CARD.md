---
title: Vérifier au build le SHA-256 déclaré dans agent-skills
type: task
status: done
completed: 2026-07-28
assignee: task-runner
priority: high
effort: S
tags: [agent-readable, build, jalon-2]
created: 2026-07-28
edited: 2026-07-28
links: [[2026-07-28-spec-cv-humains-et-agents]]
ref: AGENT-2
---

# Vérifier au build le SHA-256 déclaré dans agent-skills

`public/.well-known/agent-skills/index.json` déclare une empreinte SHA-256 du
`SKILL.md` publié :

```json
"sha256": "cf26157372280e0f87d244b619bb99582c7b623c624db8a41bd7b175effea01a"
```

C'est ce qui permet à un agent de vérifier qu'il consomme bien la skill
annoncée. Si `SKILL.md` est modifié sans que le hash soit recalculé, la skill
devient **invérifiable** : un agent qui contrôle l'empreinte la rejettera, un
agent qui ne contrôle pas ne s'apercevra de rien. Aucun test actuel ne détecte
cet écart (spec §6, invariant).

## Critères de done

- [x] Le hash de chaque `SKILL.md` déclaré est recalculé et comparé à `index.json`
- [x] La vérification tourne dans la suite de tests (`tests/agent-readable.test.ts`), donc à chaque `bun test`
- [x] Un écart fait échouer avec un message qui donne la commande de recalcul
- [x] La boucle parcourt **toutes** les skills déclarées, pas seulement `cv-info` — une skill ajoutée est couverte sans modifier le test

## Résultat

Implémenté dans la suite `tests/agent-readable.test.ts`, écrite avec AGENT-1.

**Le scénario s'est produit avant même l'implémentation** : le 2026-07-28,
l'alignement du titre a modifié `SKILL.md` et invalidé son empreinte
(`cf261573…` → `f577c7c6…`). Le hash a été recalculé à la main ce jour-là ; ce
test fait qu'il n'y aura pas de prochaine fois silencieuse.

Détection vérifiée par mutation : ajouter une ligne à `SKILL.md` sans toucher
`index.json` fait échouer la suite.
## Notes

**État vérifié le 28/07/2026 : le hash déclaré correspond au fichier publié.**
Rien n'est cassé aujourd'hui — cette tâche est bien une prévention, pas une
réparation. Commande de contrôle :

```bash
shasum -a 256 public/.well-known/agent-skills/cv-info/SKILL.md
# cf26157372280e0f87d244b619bb99582c7b623c624db8a41bd7b175effea01a
```

Automatiser le recalcul plutôt que le contrôler serait plus confortable, mais
ferait disparaître le signal : on veut savoir que le fichier a changé, pas
masquer le changement.
