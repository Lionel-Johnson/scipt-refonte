# Cartes de navigation À propos

Les sept cartes de « Qui sommes-nous » et « À propos » sont présentées avec
une grande entrée pour l’établissement et six cartes complémentaires. Chaque
intitulé conserve sa destination et possède un pictogramme vectoriel dédié :
établissement, chiffres, mission, pédagogie, parcours, direction et devise.

La finition associe ombres superposées, surfaces de verre, halos aurora bleu et
or, lumière suivant la souris et survol avec élévation. La grille est adaptée
aux formats ordinateur, tablette et téléphone. Les animations sont désactivées
lorsque le navigateur demande une réduction des mouvements. Les liens restent
utilisables au clavier et sans JavaScript.

Le script de fenêtres conserve le titre seul dans les en-têtes des dialogues,
sans y ajouter les nouvelles descriptions des cartes.

## Maintenance

Les pictogrammes et descriptions sont dans `assets/about-cards.json`.
Après les générateurs de présentation, de stages et de domaines doctoraux :

```bash
python scripts/styliser-cartes-a-propos.py
```

Les contrôles vérifient les sept destinations, la présence des pictogrammes,
la conservation des contenus institutionnels et l’idempotence du générateur.
Le navigateur de contrôle n’est pas disponible dans cet environnement : le
rendu visuel en navigateur n’a pas été inspecté.

## Brouillons WordPress

Les fichiers sont préparés dans `wordpress/draft-theme`. La limite WPVibe déjà
signalée bloque toujours la synchronisation avant 16 h 10 à Libreville environ.
Après la synchronisation doctorale décrite dans
`DOMAINES-DOCTORAUX-20-OCTOBRE.md`, appliquer :

- `assets/about-cards-data.js`
- `assets/about-cards-fragment.html`
- `assets/about-cards.css`
- `assets/about-cards.js`
- `assets/about-dialogs.js`
- `inc/scipt-about-cards.php`
- `inc/scipt-global-pages.php` en dernier.

Le module fournit les cartes côté serveur et charge leurs styles et scripts.
Le thème WordPress actif n’est pas publié par cette opération.
