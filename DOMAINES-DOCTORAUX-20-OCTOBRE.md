# Les seize domaines doctoraux de l’EDI-SCIPT

La source est la fiche Word transmise par le client le 20 octobre 2026 :
`SCIPT_INTERNATIONAL_EDI_Fiche_des_16_domaines_doctoraux.docx`.
Son empreinte SHA-256 et sa transcription structurée figurent dans
`assets/domaines-doctoraux-20261020.json`.

Le site reprend les 16 intitulés, 88 disciplines et leurs descriptions,
91 spécialités possibles, 48 axes de recherche et les conditions communes.
Les quatre grands domaines restent accessibles par les identifiants historiques
7666 à 7669 ; le catalogue conserve ses 90 identifiants existants.

| Grand domaine | École d’appui | Identifiant | Domaines |
| --- | --- | --- | --- |
| Droit, gestion et administration | ESGA-SCIPT | 7666 | 1 à 3 |
| Sciences, technologies et ingénierie | ESTI-SCIPT | 7667 | 4 à 8 |
| Sciences de la santé | ESSA-SCIPT | 7668 | 9 à 12 |
| Sciences humaines, sociales et communication | ESHC-SCIPT | 7669 | 13 à 16 |

Chaque fiche détaillée possède un lien stable, par exemple
`programme.html?id=7667&domaine=6` pour Ingénierie, mécatronique et robotique.
Un paramètre de domaine absent ou incohérent renvoie à la présentation du grand
domaine demandé. Les autres filières conservent leur fonctionnement.

## Statut des informations

La fiche client présente un cadre de référence, des spécialités possibles et des
principes proposés. Ces qualifications sont visibles sur le site. L’ouverture
effective dépend de l’encadrement, des moyens de recherche, du cadre de
délivrance et des décisions académiques. Les réserves concernant les équipements,
notamment la radiothérapie, sont conservées. Aucun coût, durée, accréditation ou
partenariat supplémentaire n’est ajouté.

## Régénération

```bash
python scripts/integrer-presentations-client.py
python scripts/integrer-stages-froid.py
python scripts/integrer-domaines-doctoraux.py
node scripts/verifier-architecture.cjs
```

Les 20 vues, les liens avec paramètres WordPress, la présence des contenus du
document, la conservation des 86 autres fiches et l’idempotence des générateurs
ont été vérifiés. La vérification est structurelle et fonctionnelle en JavaScript ;
elle ne remplace pas une inspection visuelle dans un navigateur.

## Brouillon WordPress

Tous les fichiers à appliquer sont préparés dans `wordpress/draft-theme`.
Le module `inc/scipt-doctoral.php` reprend les contenus côté serveur et enregistre
les dépendances JavaScript des quatre fiches historiques. Le thème actif n’est
pas publié ou remplacé.

La limite quotidienne de WPVibe a interrompu la synchronisation du brouillon.
Seul `assets/programme-contenus.js` a été enregistré à ce stade. Reprise annoncée
par le service : 20 octobre 2026 vers 15 h 10 UTC, soit 16 h 10 à Libreville.

À la reprise, lire les versions actuelles puis appliquer les fichiers suivants :

- `assets/programmes-ecoles.js`
- `assets/diplomes-specialisations.js`
- `assets/programmes-detail-modern.js`
- `assets/domaines-doctoraux-fragments.json`
- `assets/domaines-doctoraux-data.js`
- `assets/domaines-doctoraux-ui.js`
- `assets/domaines-doctoraux.css`
- `assets/edi-domaines-fragment.html`
- `inc/scipt-doctoral.php`
- `inc/scipt-global-pages.php` en dernier, pour activer le module.

Ne pas publier le thème WordPress actif dans le cadre de cette synchronisation.
