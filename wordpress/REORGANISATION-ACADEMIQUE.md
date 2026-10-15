# Réorganisation académique et pages institutionnelles

Application de la demande du 15 octobre 2026, fondée sur la synthèse des écoles fournie par la direction.

## Architecture corrigée

- 4 écoles académiques : ESGA, ESTI, ESSA, ESHC ; 20 départements.
- 40 filières : ESGA 10, ESTI 11, ESSA 11, ESHC 8. Correction du sous-total ESGA erroné (8) et du total annoncé (38).
- 3 parcours en réserve : Pétrole/Gaz, Radiothérapie/Physique médicale, Appareillage/Technologies de santé. Ils restent consultables mais exclus de la candidature et de l’orientation automatique.
- L’École Doctorale Internationale SCIPT reste distincte et en première position.
- Secrétariat médical (7665) : offre Academy transversale, sans suppression de l’identifiant existant.
- Médecine et Pharmacie : niveau Doctorat conformément à la synthèse. Les anciens intitulés Licence/Master des groupes de semestres médicaux ne sont plus présentés comme des diplômes de médecine.
- Sciences infirmières et Maïeutique restent deux filières distinctes.
- Énergies : le génie électrique présente le volet technique ; la filière Énergies et environnement présente la gestion des ressources, la sécurité et les impacts environnementaux.

## Regroupements et compatibilité

| Identifiant antérieur | Filière principale | Parcours conservé |
| --- | --- | --- |
| 7657 | 7653 — Génie Civil et Bâtiment | Architecture et BTP |
| 7701 | 7654 — Génie Électrique et Systèmes Énergétiques | Automatisme, robotique et mécatronique |
| 7705 | 7647 — Management et Organisations | Gestion de projets |
| 7706 | 7658 — Énergies Renouvelables et Gestion Environnementale | QHSE |

Les anciens liens sont résolus vers la filière principale. Les identifiants des cours LearnDash, les inscriptions et les résultats ne sont pas modifiés. Les 19 rapprochements confirmés restent confirmés ; leurs destinations suivent les regroupements. Les 7 affectations ambiguës restent à préciser : l’architecture ne suffit pas à décider du public pédagogique d’un cours partagé.

## Présentation et maintenance

Les pages Corps professoral, Approche pédagogique, Pourquoi nous choisir et Agrément et reconnaissance sont reconstruites avec des cartes responsive et un style commun. Les neuf portraits existants sont conservés ; aucun portrait ni diplôme n’est inventé. Les images redondantes de la page pédagogique ne sont pas reprises deux fois. Les fenêtres de Qui sommes-nous sont conservées et harmonisées.

Référentiel unique : assets/architecture-academique.json. Génération des catalogues, menus et fragments : scripts/reorganiser-scipt.py. Une feuille institution.css et un script institution.js communs ; aucune page -v2 ou copie de travail publiée. Le répertoire WordPress contient le paquet du thème en brouillon, pas une deuxième version éditoriale du site.

La nouvelle page ESHC WordPress porte l’identifiant 8076 et reste en brouillon. Les autres pages gardent leurs identifiants. La publication du thème WordPress n’est pas effectuée.
