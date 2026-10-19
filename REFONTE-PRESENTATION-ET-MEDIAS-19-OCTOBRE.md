# Présentation et médias — 19 octobre 2026

La page « Qui sommes-nous » et son équivalent « À propos » utilisent désormais
huit cartes dépliables en verre, avec des dégradés marine, bleu et or. Les textes
sont justifiés sans césure automatique ni découpe forcée des mots. Les neuf
chiffres clés s’ouvrent par deux battants au survol et disposent d’une commande
au clavier et au toucher. Les animations sont désactivées si le visiteur préfère
un mouvement réduit.

Le bloc « Deux programmes, cinq écoles » comporte une image dans sa colonne
droite sur ordinateur et sous le texte sur mobile. Les liens partagés avec une
barre finale dans l’ancre restent fonctionnels.

## Correspondance des médias

`assets/medias-formations-data.js` est la source explicite des médias des
90 identifiants de formation. Les 48 images référencées sont présentes.
Seules quatre fiches ont une vidéo spécifique :

| Formation | Vidéo |
| --- | --- |
| Logistique et Supply Chain Management (7652) | Témoignage de Pemba, transport et logistique |
| Logistique et transport (7683) | Témoignage de Pemba, transport et logistique |
| Sciences infirmières (7660) | Témoignage de Murielle |
| Coiffure, esthétique et onglerie (7818) | Archive beauté et esthétique |

Les autres fiches présentent une image correspondant à leur domaine. Le script
n’injecte plus un film d’école dans toutes ses formations. Si la lecture d’une
vidéo spécifique échoue, l’image du parcours reste disponible.

La page ESGA commence par une image de droit. L’archive de Pemba reste accessible
dans un bloc distinct, explicitement consacré à la logistique. Les présentations
institutionnelles des quatre autres écoles restent à leur emplacement et les
archives santé sont conservées dans la galerie de l’école.

## Visuels et uniformes

Les nouveaux visuels sont conceptuels et ne représentent pas des étudiants
identifiés. Les sujets figurent dans `assets/visuels-20261019-source.json`.
Ils sont générés avec le générateur d’images intégré, puis convertis en WebP
pour le site. Les fichiers finaux sont enregistrés dans `assets/formations/`
et `assets/deux-programmes-cinq-ecoles.webp`.

Consigne permanente pour les uniformes : utiliser le logo officiel complet
`assets/cachet-scipt-officiel.jpeg`, identique au fichier fourni le 19 octobre.
Retirer le fond extérieur blanc ; préserver les rubans, le blason, les lauriers
et le millésime. Le poser comme une petite broderie sur le tissu, sans rectangle
de fond, en respectant la perspective. Préserver les visages et la scène.

Le prompt commun des nouveaux visuels demande une photographie éditoriale
conceptuelle en contexte de formation africaine, une scène crédible propre au
métier décrit dans le référentiel, une composition 4:3 et des accents marine,
blanc et or. La retouche d’uniforme utilise l’image d’origine et le logo officiel
comme deux références : ajouter le blason complet détouré, en broderie de
5 à 7 cm sur la poitrine, avec la perspective du vêtement, en préservant visages,
mains, équipements, cadrage et éclairage.

## WordPress

Le thème de brouillon reçoit les mêmes styles et scripts. Le fichier
`assets/presentations-pages.json` complète le registre antérieur uniquement pour
les pages concernées, sans remplacer les autres fragments. Le gabarit des fiches
est inclus et ses scripts sont chargés dans l’ordre du site HTML. Les liens de
prévisualisation conservent le jeton du brouillon.

Le thème WordPress public n’est pas activé par cette mise à jour du brouillon.

## Vérification

- Contrôles d’architecture et de préservation des archives : réussis.
- Contrôle des paragraphes et tableaux institutionnels : contenus conservés.
- Chromium 390 px et 1440 px : cartes dépliables, survol/clic des chiffres,
  justification sans césure et absence de débordement horizontal vérifiés.
- Navigation automatisée sur les 90 fiches dans Chromium : toutes les images
  chargent, les vidéos correspondent strictement au référentiel et aucune erreur
  JavaScript ni aucun débordement horizontal n’est détecté.
