# Présentations institutionnelles — retour client du 19 octobre 2026

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
