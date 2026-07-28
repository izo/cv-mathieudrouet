# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Recruteurs et hiring managers.** Arrivent par recherche nominative, LinkedIn ou
transmission. Scannent en quelques dizaines de secondes, cherchent la crédibilité
et le parcours, repartent avec le PDF ou un moyen de contact.

**Agents IA de sourcing.** Consomment le profil pour répondre à une requête de
recherche (« un Head of Product à Lille avec de l'expérience IA »). Ont besoin de
données exactes, structurées et datées, pas d'une mise en page.

Ces deux publics sont **prioritaires à égalité**. C'est un choix structurant :
quand leurs besoins s'opposent, l'arbitrage est décidé, pas improvisé (voir
Product Principles).

**Clients potentiels de missions.** Cherchent une preuve de savoir-faire et une
manière de travailler avant d'engager une conversation.

**Pairs et communauté produit.** Viennent pour les partis pris et l'approche.

## Product Purpose

Site CV personnel de Mathieu Drouet, publié sur `cv.drouet.io`.

Il poursuit **deux objectifs simultanés**, assumés comme tels : déclencher des
prises de contact pour un **poste salarié**, et amener des **missions
freelance / consulting**. Ils partagent le même contenu et le même parcours ; ils
ne justifient pas deux sites.

Le succès se lit sur trois signaux, relevés trimestriellement :

1. contacts entrants qualifiés attribuables au site ;
2. restitution exacte du profil par des agents interrogés sur des requêtes types ;
3. position sur le nom et présence sur les requêtes métier dans la recherche.

Aucun de ces signaux n'est instrumenté à ce jour — c'est une lacune identifiée,
pas un état satisfaisant.

## Positioning

Un CV classique est optimisé pour un œil humain. Lu par un agent, il devient du
HTML de présentation dont la structure sémantique a disparu, ou un PDF dont
l'extraction est hasardeuse : le profil est présent mais mal restitué.

**Le mécanisme différenciant** : le même profil est publié dans les trois formats
attendus — HTML, Markdown, PDF — depuis une **source unique**, accompagné des
métadonnées de découverte qui permettent à un agent de les trouver sans deviner
(`llms.txt`, `.well-known/api-catalog` selon la RFC 9727, `.well-known/agent-skills/`
selon agentskills.io, négociation de contenu sur l'en-tête `Accept`).

Un site voisin ne peut pas revendiquer cela sans faire le même travail. Et le
dispositif porte le propos : un produit qui affirme *concevoir et livrer* le
démontre sur son propre site plutôt que de l'écrire.

**Pari fondateur assumé** : le sourcing passera de plus en plus par des agents.
Ce n'est pas une vitrine technique, c'est une conviction — donc un axe permanent,
à maintenir quand les standards bougent, et à vérifier par la mesure.

## Operating Context

- Le contenu du CV vit dans **un seul fichier Markdown versionné** (`src/content/cv/cv.md`), édité à la main. Pas de CMS, pas d'interface d'administration : c'est une décision, pas une lacune.
- Site généré statiquement, déployé sur Cloudflare Pages. Aucun serveur applicatif.
- Les coordonnées sont centralisées dans un fichier de configuration pour éviter la divergence entre les formats publiés.
- Le visiteur humain arrive par recherche nominative, LinkedIn ou transmission directe. L'agent arrive par les fichiers de découverte.
- Le PDF reste attendu par les processus RH : il n'est pas un reliquat.

## Capabilities and Constraints

**Fonctionnalités confirmées**

- Trois pages : CV, présentation longue (`/about`), page d'erreur
- Publication simultanée en HTML, Markdown et PDF depuis la source unique
- Négociation de contenu : `Accept: text/markdown` sert la source Markdown, le navigateur reçoit le HTML
- Découverte agent : `llms.txt`, `api-catalog`, `agent-skills` (avec empreinte SHA-256 vérifiable)
- Formulaire de contact (fonction edge + envoi transactionnel)
- Content Signals déclarés : indexation autorisée, entraînement refusé, usage comme contexte autorisé

**Exclusions fermes** — décisions, pas des reports :

| Exclu | Motif |
|---|---|
| Blog / section éditoriale | Le site est un CV, pas une plateforme de publication |
| Études de cas détaillées | Les expériences restent au format CV ; le détail se discute de vive voix |
| CMS / édition en ligne | Le contenu reste en Markdown versionné |
| Espace privé / contenu protégé | Tout est public ou n'existe pas |

**Contraintes techniques connues**

- Le parser de contenu attend un format strict et **échoue en silence** : un écart fait disparaître des entrées sans erreur.
- Le build effectue des **appels réseau externes** pour les icônes : une panne réseau casse le déploiement.
- Pas de validation de types automatisée (incompatibilité outillage) — le build et les tests sont le seul filet.

**Décision ouverte**

- **Bilinguisme FR/EN acté, stratégie non tranchée.** Langue maîtresse, duplication ou génération, routage, et portée sur les ressources machine restent à décider. Tant que ce n'est pas fait, l'implémentation est délibérément bloquée : dupliquer les artefacts sans garde-fou de cohérence reviendrait à organiser leur divergence.

## Brand Commitments

- **Nom** : Mathieu Drouet. **Domaine** : `cv.drouet.io`.
- **Intitulé qui fait foi** : « Head of Product & Product Builder | AI-Augmented Delivery ». Le « & Product Builder » porte la différence — *conçoit ET livre* — et doit apparaître **partout, y compris dans les ressources machine**.
  > ⚠️ Écart constaté au 2026-07-28 : `public/llms.txt` et les mots-clés SEO n'emploient que « Head of Product ». À uniformiser.
- **Langue actuelle** : français. Une version anglaise est prévue (voir décision ouverte).
- **Engagement d'usage IA** : indexation oui, entraînement non, usage comme contexte oui. Déclaré publiquement, donc tenu.
- **Localisation** : Lille, France — mobilité annoncée sur Paris, la Belgique et le Canada.

## Evidence on Hand

**Utilisable**

- **Logos de sept entreprises réelles** (`public/logos/`) : Fluidra, GE Healthcare, Actual, Bookr, Agences, Hey a here you art, regrets. Correspondent à des expériences effectives.
- **Produits fondés ou livrés**, en ligne et montrables — notamment `regrets.app`. C'est la preuve directe du « conçoit ET livre ».
- Photo (`public/profile.jpg`), CV en PDF (`public/cv_mathieu_drouet.pdf`).
- Profils externes vérifiables : LinkedIn, GitHub, portfolio.
- Le site lui-même : son dispositif agent-readable est une démonstration, pas une affirmation.

**À ne jamais fabriquer**

- **Résultats chiffrés.** Aucune métrique d'impact publiable n'est confirmée à ce jour. Ne pas inventer de pourcentages d'adoption, de gains de délai ou de chiffres de revenus, même plausibles, même en exemple.
- **Témoignages et recommandations.** Aucune citation de collègue ou de client n'est disponible. Ne pas en rédiger, ne pas en simuler, ne pas prévoir d'emplacement qui en appellerait.

Si une future section réclame ce type de preuve, la réponse est de l'obtenir, pas de la produire.

## Product Principles

1. **L'exactitude prime sur la présentation.** Une information juste et datée vaut mieux qu'une mise en page qui la reformule.
2. **Source unique, sans exception.** Aucun format publié ne diverge des autres. Maintenir une version « pour agents » distincte du HTML est le mode de panne le plus probable du dispositif.
3. **Humains et agents servis à égalité.** Ni l'un ni l'autre n'est un public de seconde zone ; le HTML reste maître de la présentation, le Markdown maître de la structure, et aucun ne se déforme pour ressembler à l'autre.
4. **Ne rien affirmer qui ne soit démontrable.** Le site tire sa crédibilité de ce qu'il montre. Une preuve absente reste absente.
5. **Le pari doit rester mesurable.** Une conviction qu'on ne vérifie jamais devient une habitude. Ce qui n'est pas relevé n'est pas tenu.

## Accessibility & Inclusion

**WCAG 2.1 niveau AA — exigence tenue, pas intention.**

Toute régression de contraste, de gestion du focus ou de navigation clavier est
un **défaut bloquant**, au même titre qu'un build cassé.

L'implémentation actuelle porte déjà : lien d'évitement, points de repère ARIA,
respect de `prefers-reduced-motion`, cibles tactiles d'au moins 44 px, contrastes
vérifiés. Ces acquis sont un plancher, pas un plafond.
