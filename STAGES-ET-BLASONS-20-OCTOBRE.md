# Retours client du 20 octobre 2026

La liste « Deux programmes, cinq écoles » de `qui-sommes-nous.html` et
`a-propos.html` distingue désormais chaque école par son blason officiel,
son sigle, son nom complet et une carte séparée. Les cinq liens sont conservés.

## Photographies de stage

Sources transmises par le client :

- https://drive.google.com/drive/folders/1fA_QqJNlgjet6JUS9ab3q34C34t8hlV6
- https://drive.google.com/drive/folders/1OvtEI1EpqK2Shsynz3wxYcAwkaGNcZ5d

Les 65 photographies distinctes des dossiers ont été examinées. Cinq montrent
des interventions identifiables sur des climatiseurs : unités intérieures,
unité extérieure, entretien et intervention en équipe. Les autres clichés,
notamment les travaux électriques, ne sont pas attribués à la climatisation.

Les photographies originales sont conservées sans recadrage ni modification
des uniformes ou des marques. Les copies WebP optimisées, les légendes,
les identifiants Drive et les empreintes sont documentés dans
`assets/stages-froid.json`.

La galerie figure sur les pages ESTI, formations professionnelles, formations
professionnelles en 18 mois, médiathèque et vie étudiante. Les fiches 7680
(Froid domestique et industriel) et 7809 (Froid et Climatisation, 18 mois)
utilisent aussi une photographie de stage en couverture et la galerie.
Les 88 autres fiches conservent leurs médias.

## WordPress et maintenance

Les cinq originaux sont importés dans la médiathèque WordPress, pièces jointes
8085 à 8089. Les URLs sont consignées dans
`wordpress/draft-theme/assets/stages-froid-media.json`.
Le module `inc/scipt-stages.php` ne modifie que le thème en brouillon.
Le registre complémentaire `assets/stages-pages.json` rend les cinq rubriques
accessibles dans cet aperçu, y compris lorsque la page WordPress initiale
n'est pas publiée.

Après régénération des pages, exécuter dans cet ordre :

```bash
python scripts/integrer-presentations-client.py
python scripts/integrer-stages-froid.py
```

Vérifications : cinq blasons correctement associés sur les deux pages À propos,
images décodables et empreintes conformes, cinq photos dans chaque galerie,
seules les deux fiches ciblées modifiées, générateurs idempotents, syntaxe
JavaScript et contrôle de l'architecture académique valides. Les écritures
PHP du brouillon sont contrôlées par WordPress avant enregistrement.
