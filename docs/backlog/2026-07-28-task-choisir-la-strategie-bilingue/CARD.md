---
title: Choisir la stratégie bilingue FR/EN
type: task
status: todo
assignee: tony
priority: medium
effort: M
tags: [i18n, architecture, jalon-3]
created: 2026-07-28
edited: 2026-07-28
links: [[2026-07-28-spec-cv-humains-et-agents]]
ref: I18N-1
---

# Choisir la stratégie bilingue FR/EN

Le bilinguisme est acté (spec §4.1) : objectif recherche de poste, mobilité
Belgique / Canada, et les agents restituent souvent en anglais.

**C'est une décision d'architecture avant d'être un travail de traduction.**
D'où cette carte, distincte de l'implémentation (`I18N-2`) : décider d'abord,
écrire ensuite.

## Le vrai problème

Le site publie aujourd'hui **3 artefacts** depuis une source unique : HTML,
Markdown, PDF. En bilingue, cela devient **6**. Le risque R2 de la spec n'est
pas la charge de traduction — c'est la divergence : au bout de deux mises à jour
du CV, la version anglaise raconte autre chose.

La spec place donc ce chantier **après** le jalon 2 (`AGENT-1`, `DATA-1`) : sans
garde-fou de cohérence, dupliquer six artefacts revient à organiser la
divergence.

## Ce qu'il faut trancher

1. **Langue maîtresse** — laquelle fait autorité en cas d'écart ? Sans réponse, il n'y a pas de source unique, donc plus d'invariant vérifiable.
2. **Duplication ou génération** — deux `cv.md` maintenus en parallèle, ou un contenu structuré rendu dans les deux langues ? La duplication est simple à mettre en place et coûteuse à tenir.
3. **Routage** — `/en/` en sous-chemin (simple sur Pages, bon pour le SEO) ou négociation par `Accept-Language` (fragile, mauvais pour l'indexation) ?
4. **Portée** — la version anglaise couvre-t-elle aussi `llms.txt`, `cv.md`, `SKILL.md`, `api-catalog` ? Le pari agent dit oui.
5. **`hreflang`** — déclaration réciproque des deux versions, plus mise à jour du sitemap.

## Critères de done

- [ ] Décision écrite dans ce dossier (`DECISION.md`) ou en section de la spec
- [ ] Les 5 points ci-dessus tranchés, avec le motif — pas seulement le choix
- [ ] Impact sur `AGENT-1` évalué : le test de cohérence doit couvrir les deux langues
- [ ] Estimation d'effort de `I18N-2` révisée à la lumière de la décision

## Notes

Une option intermédiaire mérite examen : garder le HTML en français et ne
traduire que les **ressources machine** (`llms.txt`, `cv.md`, `SKILL.md`). Elle
sert le pari agent — l'anglais y est la langue par défaut — pour une fraction du
coût, et se teste en un trimestre via le protocole de relevé (`OBS-3`).
