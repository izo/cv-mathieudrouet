---
title: Vérifier au build le SHA-256 déclaré dans agent-skills
type: task
status: todo
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

- [ ] Le hash de `SKILL.md` est recalculé et comparé à celui déclaré dans `index.json`
- [ ] La vérification tourne dans la suite de tests **ou** dans le pipeline de build
- [ ] Un écart fait échouer bruyamment, avec un message qui donne le hash attendu et le hash trouvé
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
