---
date: 2026-07-28
type: releve-agent
statut: partiel
agents: [recherche-web]
---

# Relevé agent — 2026-07-28 · point zéro (partiel)

> **Partiel, et il faut le dire.** Le protocole demande trois agents interrogés
> en session neuve (ChatGPT, Claude, Perplexity). Ce relevé n'a pu couvrir que
> la couche recherche web, qui alimente ces agents mais ne les remplace pas.
> Il établit néanmoins un point zéro sur la question la plus fondamentale : le
> profil est-il seulement trouvable ?
>
> Protocole complet : `docs/backlog/2026-07-28-task-protocole-de-releve-agent/PROTOCOLE.md`

## Synthèse

| Requête | Le profil remonte ? | Constat |
|---|---|---|
| Nominative — « Mathieu Drouet Head of Product Lille » | **oui**, `cv.drouet.io` en 2ᵉ position | mais sous un **titre périmé** |
| Par besoin — « head of product Lille expérience IA produits B2B legacy » | **non** | des profils comparables occupent la place |

**Verdict : le pari n'est pas gagné aujourd'hui.** Le site est indexé et
trouvable par le nom, mais absent du scénario qui compte — celui où l'on ne
connaît pas encore le nom.

## Ce que la recherche nominative révèle

Le site remonte en deuxième position, derrière LinkedIn. Mais le titre indexé
est :

> **« Mathieu Drouet - Senior Product Manager »**

Or le `<title>` actuellement servi est *« Mathieu Drouet — Head of Product &
Product Builder | AI-Augmented Delivery »* (vérifié le jour même en production).
**L'index est en retard sur le site.** C'est exactement ce qu'une soumission de
sitemap en Search Console (`OBS-2`) permet de corriger, en demandant une
réindexation.

Le résumé généré à partir de ces résultats contenait par ailleurs deux erreurs
factuelles :

| Affirmation | Réalité |
|---|---|
| « plus de vingt ans d'expérience » | 10+ ans |
| « CPO (Chief Product Officer) » | Head of Product & Product Builder |

Ces deux erreurs ne viennent pas du site — elles viennent d'agrégations tierces.
C'est précisément le mode de défaillance que le dispositif agent-readable est
censé prévenir : quand la source canonique n'est pas lue, une autre parle à sa
place.

**Source citée en premier : LinkedIn**, pas `cv.drouet.io`.

## Ce que la recherche par besoin révèle

Sur la requête de sourcing — celle qui décrit le besoin sans nommer personne —
le profil **n'apparaît pas**. Les résultats sont occupés par des profils
comparables, dont un basé à Lille avec un positionnement voisin
(« Product Manager & Product Builder »).

C'est le scénario que la spec place au cœur de son pari (§1). Le point zéro est
donc : **absent**.

## Écart au seuil de réaction

Selon la grille du protocole :

- ✅ Le profil remonte sur la requête nominative → pas de problème d'indexation de fond
- ⚠️ **L'intitulé est tronqué et périmé** → « une source concurrente fait autorité (probablement LinkedIn) ». Le protocole prescrit d'aligner cette source.
- ⚠️ **Aucune citation de `cv.drouet.io` comme source** → à surveiller. Un seul relevé ne suffit pas à conclure ; c'est au troisième relevé consécutif que l'hypothèse centrale de la spec serait en cause.

## Actions que ce relevé désigne

1. **`OBS-2` (Search Console)** monte en priorité : l'index sert un titre périmé, la soumission du sitemap et une demande de réindexation le corrigent.
2. **Aligner LinkedIn** sur l'intitulé qui fait foi — c'est la source que les moteurs citent en premier, et elle contredit le site.
3. **Refaire un relevé complet** (trois agents, sessions neuves) une fois ces deux points traités. C'est lui qui fera foi comme point zéro.

## Sources

- [Mathieu Drouet — LinkedIn](https://www.linkedin.com/in/mathieudrouet/)
- [Mathieu Drouet — cv.drouet.io](https://cv.drouet.io/)
- [Maxime Herbaut — Product Manager & Product Builder](https://maximeherbaut.com/)
- [Sylvain B. — Head of Product SaaS B2B / IA (Malt)](https://www.malt.fr/profile/cheveuxdefeu)
