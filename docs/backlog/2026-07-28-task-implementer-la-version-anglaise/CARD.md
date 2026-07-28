---
title: Implémenter la version anglaise
type: task
status: blocked
assignee: task-runner
priority: low
effort: XL
tags: [i18n, jalon-3]
created: 2026-07-28
edited: 2026-07-28
links: [[2026-07-28-spec-cv-humains-et-agents]], [[2026-07-28-task-choisir-la-strategie-bilingue]]
ref: I18N-2
---

# Implémenter la version anglaise

Mise en œuvre du bilinguisme, une fois la stratégie arrêtée.

## Bloquée — délibérément

Deux conditions avant de démarrer :

1. **`I18N-1` tranchée** — sans langue maîtresse ni décision duplication/génération, l'implémentation invente sa propre architecture, qu'il faudra défaire.
2. **Jalon 2 acquis** (`AGENT-1`, `DATA-1`) — les garde-fous de cohérence doivent exister *avant* qu'il y ait deux fois plus de choses à garder cohérentes.

Cet ordre est le cœur de la roadmap de la spec. Le contourner, c'est accepter le
risque R2.

## Périmètre prévisionnel

À réviser après `I18N-1` — l'estimation XL n'est fiable qu'une fois la stratégie connue.

- Contenu CV et About en anglais
- Routage `/en/` et `hreflang` réciproques
- Ressources machine : `llms.txt`, `cv.md`, `about.md`, `SKILL.md`, `api-catalog`
- PDF anglais
- Sitemap couvrant les deux langues
- Extension de `AGENT-1` aux deux langues
- Sélecteur de langue dans l'interface

## Critères de done

- [ ] Les deux versions accessibles, avec `hreflang` réciproque valide
- [ ] Ressources machine disponibles dans les deux langues, conformément à la décision `I18N-1`
- [ ] Test de cohérence `AGENT-1` étendu : aucune divergence de faits entre FR et EN
- [ ] Sitemap à jour, soumis à la Search Console
- [ ] `bun run build` et `bun test` verts

## Notes

Ne pas traduire mot à mot un CV français : les conventions diffèrent (longueur,
photo, état civil, formulation des responsabilités). Un CV anglais mal localisé
dessert plus qu'il ne sert.
