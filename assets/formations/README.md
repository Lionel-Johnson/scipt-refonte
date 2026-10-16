# Photographies de formation — SCIPT INTERNATIONAL

Ce dossier reçoit les **30 fichiers WebP officiels** du paquet `scipt_30_visuels_pret_github.zip`. Les fichiers sont nommés exactement suivant les références de `assets/formation-hero.js`.

Le gabarit `programme.html` affiche une image uniquement si son fichier est présent et chargé avec succès. À défaut, il montre un repère neutre : **aucune photo sans rapport avec le métier n'est substituée**.

Le gabarit préserve les logos complets University et Academy avec `object-fit: contain`. Le lot de 30 images couvre 58 identifiants de formation ou leurs équivalents proches. D'autres visuels seront nécessaires pour les autres parcours.

**Installation :** décompresser l'archive à la racine du dépôt GitHub en conservant `assets/formations/` ; valider le chargement des photos avant publication.

## Lot 5 — Droit, recherche, relations internationales et médias
Dix images WebP distinctes ont été préparées dans `scipt_lot5_droit_medias_10_visuels.zip`.
Décompresser et déposer leurs fichiers dans ce dossier `assets/formations/`. Les noms correspondent aux liens du script `assets/formation-hero.js`.

- `droit-carrieres-juridiques-specialites.webp` et `droit-mediation-conflits.webp` : documents éditoriaux complémentaires pour l'ESGA
- `droit-sciences-politiques.webp`, `droit-relations-internationales.webp` : sciences politiques / relations internationales
- `droit-doctorat-juridique.webp`, `humaines-recherche-doctorale.webp` : recherche doctorale
- `medias-journalisme.webp`, `medias-production-audiovisuelle.webp`, `medias-communication-organisations.webp` : journalisme, cinéma, communication
- `gestion-transit-douane.webp` : transit et douane

**Statut :** tant que les fichiers WebP du Lot 5 ne sont pas téléversés, la page de formation affiche le message d'attente existant et la page d'école continue à afficher la photographie juridique du lot initial. Les images générées sont illustratives et ne représentent pas des étudiants réels. La vidéo de Pemba reste à son emplacement, étiquetée comme témoignage sur la logistique.

## Ajout du 16 octobre 2026 — nouvelles photos métiers

Les archives remises par la direction comprennent 68 photos séparées, dont 20 fichiers WebP prioritaires à téléverser dans ce dossier. Ce deuxième lot n’écrase aucun des 30 fichiers existants. Les bandeaux de titres intégrés aux images ont été retirés avant leur préparation.

Les fiches `programme.html` utilisent maintenant ces nouveaux visuels pour les identifiants suivants : `7656`, `7666`, `7669`, `7702`, `7806`, `7913`, `7914`, `7916` et `7917`. Si un nouveau fichier n’est pas encore disponible, la fiche tente de conserver son média précédent.

**Installation :** extraire `scipt_20_visuels_prioritaires_github.zip`, puis transférer uniquement les fichiers `.webp` de `assets/formations/` dans le dossier du même nom sur GitHub. Le fichier `manifest.json` du paquet indique les correspondances par métier et par ID.

La légende de chaque image sur le site affiche le nom de la formation sans qualificatif ajouté. Les autres programmes attendent des photos correspondant effectivement à leurs métiers ; aucun visuel générique non pertinent ne doit leur être attribué.
