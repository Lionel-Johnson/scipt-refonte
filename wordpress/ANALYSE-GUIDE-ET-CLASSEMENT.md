# Guide SCIPT : sélection éditoriale et classement des cours

Source : `Guide_de_Presentation_SCIPT_modifie-3.pdf`, 97 pages, métadonnées datées du 30 juillet 2026. Analyse du 15 octobre 2026. Les références ci-dessous désignent les pages physiques du PDF ; le sommaire ne correspond pas toujours à cette pagination.

## Classement de travail

Le référentiel reprend les 72 entrées du catalogue actuel (`assets/orientation-data.js`), en conservant les intitulés, écoles, types de parcours et identifiants. Ces 72 entrées comprennent des variantes professionnelles de 18 mois ; ce ne sont pas 72 disciplines différentes.

Les 68 contenus LearnDash publiés ont été examinés :

| Groupe | Nombre | Traitement |
|---|---:|---|
| Rapprochements avec une filière du catalogue | 19 | Finance, comptabilité et audit ; ressources humaines ; logistique ; électrotechnique ; énergies ; pharmacie ; secrétariat médical ; management des projets. |
| Matières communes de santé | 32 | Conserver comme transversales : anatomie, physiologie, immunologie, pathologies, etc. Aucun rattachement exclusif à médecine, soins infirmiers ou maïeutique. |
| Matières générales communes | 10 | Français, mathématiques/statistiques, droit du travail et concours « toutes filières ». |
| Affectations à préciser | 7 | Notamment psychologie clinique, économie d’entreprises, concours multidisciplinaires et intitulés insuffisants. |

Le tableau de bord distingue ce classement de travail des affectations administratives réelles. Le fichier `draft-theme/assets/classement-cours.json` contient les 68 décisions et leurs motifs. Aucun compte, droit d’accès, inscription, cours ni résultat d’examen existant n’est modifié. Une matière transversale n’est pas une nouvelle filière du catalogue. Les rapprochements restent à confirmer par la scolarité avant affectation administrative.

## Contenus repris dans la refonte

| Pages du guide | Contenu retenu | Page du nouveau site | Intégration |
|---|---|---|---|
| 25–29 | Études de cas, résolution de problèmes, projets, ateliers et accompagnement ; modalités adaptées au parcours. | Approche pédagogique | Bloc complémentaire synthétique ; aucune généralisation des dispositifs spécifiques à l’Executive MBA. |
| 36 | Étude des passerelles et changements de filière, dossier académique et décision individuelle. | Admissions | Étapes de la démarche, sans équivalence ni admission automatique. |
| 23, 93–94 | Travail, excellence, respect, intégrité, confidentialité, propreté et dialogue. | Vie étudiante | Présentation des valeurs et renvoi au règlement remis à l’inscription ; aucune nouvelle sanction ni règle d’examen créée. |

Ces trois compléments sont ajoutés aux pages statiques et aux pages WordPress de refonte en brouillon.

## Contenus utiles pour une seconde intégration

- Pages 48, 50 et 52 : objectifs et organisation des licences santé, gestion et carrières juridiques. Les objectifs peuvent enrichir les fiches correspondantes ; les durées, crédits et conditions doivent être rapprochés des maquettes validées, sans les appliquer à tous les programmes.
- Pages 57–65 : spécialités détaillées en gestion, administration, informatique, santé, pharmacie, industrie et audiovisuel. Les utiliser comme sous-spécialités des parcours existants après validation, sans créer automatiquement des formations ouvertes à l’inscription.
- Pages 67 et suivantes : International Business et Executive MBA. À rattacher à des parcours et partenaires confirmés ; ne pas reconstruire une cinquième école contraire à la navigation validée.
- Page 92 : langues. À envisager en accompagnement ou offre dédiée après confirmation des langues effectivement enseignées.
- Pages 33–38 et 93–94 : documents pratiques pour l’espace étudiant, après validation d’une version cohérente par la direction pédagogique.

## Écarts à résoudre avant reprise

| Référence | Écart constaté | Décision |
|---|---|---|
| Pages 6, 43 et sommaire | Nombre et organisation des écoles/pôles variables. La page 43 associe aussi des descriptions de gestion et d’ingénierie à des pôles inattendus. | Garder les quatre écoles de la refonte ; ne pas recopier ces descriptions. |
| Pages 11, 13–14, 18–19, 96 | Agréments, certifications et partenariats présentés dans le guide. | Conserver les mentions déjà validées ; demander les justificatifs et le périmètre actuel avant toute nouvelle affirmation. Aucune vérification externe n’a été effectuée dans cette analyse. |
| Sommaire et page 13 | Le sommaire situe Lincoln University College en Inde, tandis que sa présentation indique la Malaisie. | Ne pas reprendre une localisation contradictoire. |
| Pages 30, 39–42 | Nomenclature des diplômes, délivrance locale ou en coopération, références à « UIL ». | Clarifier l’établissement, le diplôme et l’organisme délivrant chaque titre avant publication. |
| Pages 34–38 | Plusieurs seuils d’assiduité, règles de notation et conditions d’examen ; références institutionnelles hétérogènes. | Aucune modification des examens, notes, seuils ou droits d’accès. |
| Pages 59 et 62 | Références et lignes de tableaux superposées ou incohérentes ; codes et numérotations réutilisés. | Ne pas importer les codes ni des tableaux complets sans correction. |
| Pages 62, 65, 67, 92 | Psychologie, audiovisuel, International Business et langues plus détaillés que le catalogue actuel. | Réserver comme propositions d’enrichissement ; ne pas créer des formations non validées. |
| Pages 11 et 96 | Ancienne adresse villa/impasse 163, coordonnées distinctes de la refonte. | Garder les coordonnées validées du nouveau site ; faire confirmer toute mise à jour. |

Les promesses absolues de reconnaissance, double diplôme ou insertion ne sont pas ajoutées. Aucun tarif ni calendrier validé de la campagne 2026–2027 n’est remplacé par ce guide.

## Vérification

Les 68 identifiants du classement sont uniques et correspondent au relevé WordPress. Chaque rapprochement utilise un identifiant existant dans le catalogue. Les trois insertions éditoriales ont été contrôlées dans les données Elementor, avant la fermeture du contenu principal, sans duplication du pied de page. Les fichiers PHP du classement sont contrôlés syntaxiquement par WordPress lors de l’enregistrement. Le classement doit encore être revu depuis le tableau de bord connecté et confirmé par la scolarité.

## Confirmation du 15 octobre 2026

La direction a confirmé les 19 rapprochements. Le tableau de bord permet désormais de modifier chaque classement avec un sélecteur et le bouton Enregistrer. Les changements sont conservés dans une option WordPress dédiée, réservés aux administrateurs et protégés par un nonce. Les inscriptions et les droits d’accès restent inchangés. Les matières communes et les sept cas à préciser ne sont pas automatiquement affectés.
