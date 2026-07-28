---
name: CV Mathieu Drouet
description: Un CV rétro-futuriste élégant — papier quadrillé, vert institutionnel, angles vifs et ombres d'encre.
colors:
  vert-terminal: "#7da17e"
  encre-de-service: "#163f38"
  papier-de-bureau: "#f7f6f9"
  papier-de-fiche: "#f7f9f7"
  gris-cloison: "#d6e0e2"
  gris-legende: "#4a674c"
  vert-de-classement: "#e8f0e9"
  vert-pale-secondaire: "#98b6b0"
  rouge-de-refus: "#b91c1c"
typography:
  display:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "clamp(1.85rem, 1.3rem + 2.5vw, 2.15rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1vw, 1.7rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "clamp(1.15rem, 1rem + 0.75vw, 1.35rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.005em"
  body:
    fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontWeight: 400
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Consolas, monospace"
    fontSize: "0.6875rem"
    letterSpacing: "0.15em"
rounded:
  none: "0"
  accent-xs: "2px"
  accent-sm: "3px"
spacing:
  card: "1.5rem"
  section: "3rem"
  hero-gap: "1.25rem"
components:
  card:
    backgroundColor: "{colors.papier-de-fiche}"
    textColor: "{colors.encre-de-service}"
    rounded: "{rounded.none}"
    padding: "{spacing.card}"
  card-hover:
    backgroundColor: "{colors.papier-de-fiche}"
    textColor: "{colors.encre-de-service}"
    rounded: "{rounded.none}"
  card-current:
    backgroundColor: "{colors.papier-de-fiche}"
    textColor: "{colors.encre-de-service}"
    rounded: "{rounded.none}"
  eyebrow:
    textColor: "{colors.gris-legende}"
    typography: "{typography.label}"
  tagline:
    textColor: "{colors.vert-terminal}"
---

# Design System: CV Mathieu Drouet

## Overview

**Creative North Star: "Le Bureau du Futur Antérieur"**

Un futur imaginé depuis les années soixante-dix, et jamais advenu. Mobilier
institutionnel impeccable, papier quadrillé, vert de service, ordre absolu.
L'élégance y naît de la tenue, pas de l'ornement : rien ne s'arrondit pour
paraître aimable, rien ne flotte pour paraître moderne. Le monde est plat,
orthogonal, et parfaitement rangé — et c'est précisément cette rigueur tenue
qui produit l'étrangeté et le charme.

Le fond du site est un papier millimétré. Ce n'est pas une texture décorative :
c'est le support sur lequel tout repose, et le système s'y aligne. Les surfaces
sont des fiches posées dessus, franches, bordées d'un trait fin. Au survol, une
grille plus serrée affleure à l'intérieur de la fiche et une ombre d'encre se
décale de deux pixels — le document réagit sans jamais s'animer.

La voix est éditoriale, pas technique. Les titres sont en serif, avec le poids
et le contraste d'un imprimé soigné ; le monospace est cantonné aux étiquettes
et aux mesures, jamais promu au rang de voix principale. C'est un document
d'auteur mis en page par une institution, pas une sortie de terminal.

**Key Characteristics:**
- Papier millimétré comme matériau fondateur, à deux échelles (100 px au fond, 12,5 px révélée au survol)
- Angles vifs absolus sur les surfaces (rayon 0) ; l'arrondi n'existe qu'en accent de 2–3 px
- Aucune profondeur simulée : plat au repos, ombre d'encre dure en réponse
- Trois familles, trois rôles inflexibles : serif pour la voix, sans-serif pour le corps, mono pour l'étiquette
- Palette verte institutionnelle sur papier froid, accent employé avec parcimonie
- Le document imprimé est un livrable de premier rang, pas une retombée

## Colors

Une palette d'institution : verts de service sur papier froid, où l'accent ne sert qu'à marquer ce qui est vivant.

### Primary
- **Vert Terminal** (`#7da17e`): l'accent unique. Il marque l'actif et le présent — poste en cours (filet gauche de 3 px), tagline du hero, filet sous le titre, bordure et ombre au survol. Sa rareté fait son autorité.

### Neutral
- **Encre de Service** (`#163f38`): le texte. Un vert si profond qu'il se lit comme un noir, mais qui garde la température de la palette. Aucun noir pur dans le système.
- **Papier de Bureau** (`#f7f6f9`): le fond de page, froid et légèrement violacé, sur lequel s'imprime le quadrillage.
- **Papier de Fiche** (`#f7f9f7`): la surface des cartes, imperceptiblement plus verte et plus claire que le fond. La séparation se joue au trait, pas à l'écart de valeur.
- **Gris Cloison** (`#d6e0e2`): la bordure. Un bleu-gris pâle qui délimite sans peser — c'est aussi la couleur du quadrillage révélé au survol.
- **Gris de Légende** (`#4a674c`): le texte secondaire, dates et mentions. Retenu pour son contraste conforme AA (5,85:1), après qu'un ton plus clair eut été écarté.
- **Vert de Classement** (`#e8f0e9`): les fonds de section, pour regrouper sans encadrer.
- **Vert Pâle Secondaire** (`#98b6b0`): badges et texte tertiaire.
- **Rouge de Refus** (`#b91c1c`): la seule couleur étrangère à la palette. Erreurs de formulaire uniquement. Assombri depuis `#dc2626`, qui ne tenait que 4,49:1 sur le papier — sous le seuil AA.

### Named Rules

**La Règle de l'Accent Rare.** Le Vert Terminal ne colore jamais une surface entière ni un bloc de texte. Il n'apparaît qu'en trait, en filet, en bordure ou en ombre — et seulement pour signaler ce qui est actif, présent ou touché. S'il occupe plus d'un dixième de l'écran, c'est qu'il a cessé de signifier.

**La Règle du Noir Absent.** Aucun `#000` dans le système. Le texte est en Encre de Service ; le seul noir autorisé est celui qu'impose le mode contraste renforcé.

## Typography

**Display Font:** Lora (avec Georgia, serif)
**Body Font:** IBM Plex Sans (avec la pile système)
**Label/Mono Font:** IBM Plex Mono (avec ui-monospace, SF Mono, Consolas)

**Character:** Un serif de lecture aux titres, une grotesque neutre au corps, un
monospace réservé aux étiquettes. Le serif donne la voix — c'est un CV d'auteur,
pas un rapport de machine ; le mono donne le cadre administratif. L'élégance
tient à ce partage : chaque famille reste à sa place.

### Hierarchy
- **Display** (Lora 700, `clamp(1.85rem → 2.15rem)`, interligne 1.2, `-0.02em`): le nom, une fois par page.
- **Headline** (Lora 700, `clamp(1.5rem → 1.7rem)`, interligne 1.25): les grandes sections — Expériences, Compétences, Education.
- **Title** (Lora 700, `clamp(1.15rem → 1.35rem)`, interligne 1.3): les entrées — employeur, intitulé de compétence.
- **Body** (IBM Plex Sans 400): les descriptions et les listes.
- **Label** (IBM Plex Mono, `0.6875rem`, capitales, `0.15em`): les sur-titres et métadonnées. L'interlettrage large est ce qui les rend administratifs plutôt que criards.

### Named Rules

**La Règle des Trois Places.** Serif pour la voix, sans-serif pour le corps, mono pour l'étiquette. Un titre en monospace, une étiquette en serif : c'est le monde qui se défait. Les trois familles ne permutent jamais.

**La Règle du Mono Bref.** Le monospace ne dépasse jamais une ligne. Il nomme, il date, il classe — il ne raconte pas.

## Layout

Colonne unique centrée, largeur maximale de 80 rem, sur un fond quadrillé de
100 px qui court sur toute la page. Les marges latérales se resserrent par
paliers (1 rem au mobile, 1,5 rem dès 640 px, marge de page dédiée au-delà de
1024 px) ; le contenu ne s'étale jamais au-delà du confort de lecture.

Le rythme vertical est franc : 3 rem entre les grandes sections, 1,5 rem de
respiration interne dans les fiches, un filet de séparation de 2 px sous le
hero. La densité est celle d'un document imprimé — serrée, régulière, sans
espaces creux dramatisés.

Les grilles de fiches passent d'une colonne au mobile à deux ou trois au-delà,
sans jamais casser l'alignement sur la trame de fond.

**La Règle de la Colonne Unique.** Aucune mise en page à deux colonnes de contenu. Le CV se lit de haut en bas, dans un ordre voulu ; une colonne latérale rendrait cet ordre négociable.

## Elevation & Depth

**Le système n'a aucune profondeur simulée.** Pas de flou d'arrière-plan, pas
d'ombre diffuse, pas d'échelle d'élévation. Les surfaces sont plates et posées
sur le même plan que le papier.

La seule ombre du système est **dure et sans flou** : un décalage de 2 px en
Vert Terminal, comme un défaut de calage à l'impression plutôt qu'une hauteur
physique. Elle n'existe qu'en réponse à une intention.

### Shadow Vocabulary
- **Ombre d'encre** (`box-shadow: 2px 2px 0 var(--cv-accent)`): au survol d'une fiche, conjointement au passage de la bordure en accent et à l'apparition du quadrillage interne.
- **Trait de repos** (`box-shadow: 0 1px 3px 0 #0000001a`): l'ombre minimale des fiches au repos, à peine perceptible. Elle assoit la fiche sur le papier, elle ne la soulève pas.

### Named Rules

**La Règle du Plat au Repos.** Au repos, toute surface est plate. L'ombre est une réponse à une intention — survol, focus — jamais un état par défaut. La profondeur signale l'interaction ; elle ne décore rien.

**La Règle du Flou Interdit.** Aucun `blur`, aucun `backdrop-filter`, aucune ombre diffuse colorée. Une ombre est un décalage net ou n'est pas. Des tokens de glassmorphisme subsistent dans la configuration (`glass-gradient`, `aurora`, `light-leak`, `backdrop-blur-*`) : ils ne sont utilisés nulle part et ne doivent pas l'être.

## Shapes

**Rayon zéro.** Fiches, sections, images, conteneurs : tout est à angle vif. La
géométrie est strictement orthogonale et l'alignement sur la trame de fond est
ce qui produit la sensation d'ordre.

L'arrondi n'existe qu'à l'échelle de l'accent : 2 à 3 px sur les petits filets
verticaux qui marquent les titres de section, et un cercle plein de 5 px comme
puce de liste. Ce sont des ponctuations, jamais des contenants.

La séparation se fait au trait : bordure de 1 px en Gris Cloison sur les fiches,
filet de 2 px sous le hero, filet de 3 px à gauche des postes en cours.

**La Règle de l'Angle Vif.** Aucune surface n'a de coin arrondi. Un `border-radius` supérieur à 3 px sur un conteneur est une erreur, pas un choix de style.

## Components

### Cards / Containers

La fiche est l'unité du système : une carte posée sur le papier, franche, qui s'anime seulement quand on la touche.

- **Corner Style:** angle vif (rayon 0), sans exception
- **Background:** Papier de Fiche, à peine détaché du fond
- **Border:** 1 px plein en Gris Cloison
- **Shadow Strategy:** trait de repos imperceptible ; voir Elevation & Depth
- **Internal Padding:** 1,5 rem
- **Hover:** trois gestes simultanés — la bordure passe en Vert Terminal, l'ombre d'encre se décale de 2 px, et un quadrillage de 12,5 px affleure à l'intérieur de la fiche. Transition de 0,15 s.
- **Variante « en cours »:** filet de 3 px en Vert Terminal sur le bord gauche. C'est le seul marqueur d'état du système.

> Note d'implémentation : la classe se nomme `.glass-card`, vestige d'une époque glassmorphisme révolue. Le composant n'a plus rien de vitreux — fond opaque, angles vifs, aucun flou. Le nom ment ; le comportement fait foi.

### Hero

Le bloc d'ouverture, et la démonstration condensée du système typographique.

- **Sur-titre:** mono, `0.6875rem`, capitales, interlettrage `0.15em`, en Gris de Légende
- **Nom:** Display serif
- **Accroche:** mono, `clamp(0.8rem → 1rem)`, en Vert Terminal — le seul texte coloré de la page
- **Filet:** barre pleine de 2,5 rem × 3 px en Vert Terminal, posée sous l'accroche
- **Clôture:** filet de 2 px en Gris Cloison, 3 rem de respiration avant la suite

### Section Headings

Titre en serif précédé d'un petit filet vertical de 4 px en Vert Terminal, arrondi à 3 px — l'une des rares courbes du système.

### Navigation & Links

Liens en Encre de Service, passage à l'accent au survol. Le focus est visible et
franc : contour de 2 px avec 2 px de décalage. Toutes les cibles tactiles font
au moins 44 px ; les liens en ligne dans le texte courant portent une classe
d'exemption pour ne pas être étirés.

### Formulaire de contact — **hors système**

La modale de contact n'applique pas ce design system. Elle utilise les valeurs
par défaut de Tailwind : coins arrondis (`rounded-md`), palette `gray-*`
neutre, ombres douces. Elle contredit sur trois points la Règle de l'Angle Vif,
la palette et la Règle du Plat au Repos.

**Ce n'est pas la référence.** Toute reprise doit l'aligner : angles vifs,
bordure Gris Cloison, focus en Vert Terminal, fond Papier de Fiche.

### Document imprimé

L'impression est une expression à part entière du système, pas une dégradation.
Les fiches deviennent blanches et perdent bordure et ombre ; les titres passent
en points (24 pt / 14 pt / 12 pt) et conservent l'Encre de Service ; les grandes
sections gagnent un filet de séparation en Vert Terminal. Le quadrillage
disparaît : sur du vrai papier, il serait redondant.

## Do's and Don'ts

### Do:
- **Do** garder le rayon à 0 sur toute surface. L'arrondi est réservé aux accents de 2–3 px et à la puce circulaire de 5 px.
- **Do** réserver le Vert Terminal au signalement de ce qui est actif, présent ou survolé — en trait, filet, bordure ou ombre.
- **Do** respecter la Règle des Trois Places : serif pour la voix, sans-serif pour le corps, mono pour l'étiquette.
- **Do** conserver l'alignement sur la trame : le quadrillage de fond est le repère, pas un décor.
- **Do** traiter l'ombre comme une réponse à une intention, et la garder dure (`2px 2px 0`).
- **Do** vérifier chaque nouvelle paire couleur/fond en WCAG 2.1 AA. Le contraste est une exigence tenue, pas une intention.
- **Do** traiter la feuille d'impression comme un livrable : tout composant nouveau doit s'imprimer proprement.

### Don't:
- **Don't** introduire de flou : ni `backdrop-filter`, ni ombre diffuse, ni transparence empilée. Les tokens de glassmorphisme restés dans la configuration sont morts et le restent.
- **Don't** dériver vers le SaaS arrondi contemporain — coins doux, dégradés violets, ombres tendres, illustrations vectorielles enjouées.
- **Don't** employer d'orange, ni aucun dégradé multicolore : c'est la signature visuelle des sorties génératives par défaut, et ce site vend précisément le contraire.
- **Don't** graphiser les faits : ni barres de compétence, ni notes sur cinq, ni camemberts de langues, ni icônes surdimensionnées. Un CV se lit.
- **Don't** ajouter d'effets de démonstration : animations d'entrée spectaculaires, curseur personnalisé, scroll détourné, transitions de page. Le document prime sur la performance.
- **Don't** introduire de noir pur. Le texte est en Encre de Service ; le noir n'apparaît qu'en mode contraste renforcé.
- **Don't** prendre la modale de contact pour référence : elle est hors système et attend d'être alignée.
