# Présentations institutionnelles — retour client du 19 octobre 2026

## Contrôle complémentaire des pages 5 à 10 du PDF

Comparaison du PDF transmis le 19 octobre avec les textes HTML : les 87 éléments
contrôlés (paragraphes et cellules des tableaux, y compris leurs en-têtes) concordent
après normalisation des espaces et des retours à la ligne du PDF.

| Pages PDF | Contenus | Emplacement |
| --- | --- | --- |
| 5–6 | Présentation, origine, constat, réponse, conception de la formation | À propos / Qui sommes-nous, présentation et volets dépliables |
| 7–8 | Accompagnement, ouverture internationale et tableau, production, annexes | Même rubrique ; « Notre vision » renommé « Notre ouverture internationale » |
| 8–9 | Mission, vision et quatre valeurs | Rubrique Mission & vision existante |
| 9 | Les neuf repères chiffrés 2020–2026 | Bannière « SCIPT INTERNATIONAL en chiffres » |
| 9–10 | Les six agréments, reconnaissances et certifications | Page dédiée Agrément et reconnaissance |
| 10 | Deux programmes, cinq écoles | Fin de la nouvelle présentation institutionnelle |

Le contrôle a révélé des omissions dans la page des agréments : références
CESP 2022 N° 40 du 18/07/2022 et FADEC N° 00198, autorités correspondantes,
et précision sur l’audit de deux ans d’American Certification Services.
Le tableau complet est désormais intégré, sans supprimer les visuels existants.
L’accroche « Former ici, pour réussir partout. » et les métadonnées proposées
en page 5 sont également appliquées aux deux pages de présentation.

Le document Word et sa transcription précisent des ajouts aux pages existantes.
Les vingt pages de départements proposées dans le gabarit Word ne sont pas créées.

- `a-propos.html` et `qui-sommes-nous.html` : présentation et huit volets
  dépliables, ouverture internationale et tableau associé, chiffres 2020–2026,
  puis deux programmes et cinq écoles. Les textes de mission, vision et valeurs
  enrichissent la rubrique existante, y compris sa fenêtre de lecture.
- Menu À propos : lien « SCIPT INTERNATIONAL en chiffres » vers
  `qui-sommes-nous.html#chiffres-cles` sur toutes les pages.
- Cinq écoles : présentation complète, pédagogie, expression orale, ouverture
  internationale, repères et départements. Les filières et vidéos restent en place.
- Agrément et reconnaissance : ajout ISO 21001:2018, obtenue en 2026, avec
  distinction entre certification d’un système de management et diplôme.

Les chiffres et certifications sont ceux du document fourni par le client.
Les annexes et la polyclinique sont présentées comme des projets ; les ouvertures
conditionnées restent explicites. Les champs de responsables non renseignés,
instructions au webdesigner et gabarits SEO ne sont pas publiés.

## Maintenance

Les textes publiables sont conservés dans
`assets/presentations-client-20261019.json`. Pour réappliquer les ajouts :

```sh
python scripts/integrer-presentations-client.py
```

Cette opération est idempotente. Le générateur académique l’appelle également
à la fin de son exécution. Les fragments du registre WordPress et la feuille
de style du thème de prévisualisation sont synchronisés par ce script.
Les anciennes sources et archives Elementor dans `wordpress/sources` et
`wordpress/prepared` restent des archives ; le registre du thème contient
les fragments actualisés. Aucun déploiement WordPress n’est effectué par ce script.

## Vérification

- Contrôles existants d’architecture et des cinq vidéos : réussis.
- Comparaison au commit de départ : images, sources vidéo et liens des contenus
  précédents conservés ; identifiants HTML uniques ; nouveau sous-menu présent.
- Deuxième génération : aucun changement supplémentaire.
- Syntaxe JavaScript et `git diff --check` : réussis.
- Revue visuelle mobile/ordinateur non effectuée : téléchargement du navigateur
  Playwright indisponible. Le fonctionnement sur WordPress en ligne reste à vérifier
  après transfert des fichiers du thème.
