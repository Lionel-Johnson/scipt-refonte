# Refonte WordPress — 14 octobre 2026

Toutes les pages ci-dessous sont enregistrées en brouillon. Le thème actif
Hello Elementor a été copié dans `hello-elementor-wpvibe-draft`. Le thème en ligne
n’a pas été publié ni remplacé. Les rôles et comptes existants n’ont pas été modifiés.

| Page | ID WordPress |
| --- | --- |
| Qui sommes-nous | 8039 |
| Agrément et reconnaissance | 8040 |
| Pourquoi nous choisir | 8041 |
| Notre approche pédagogique | 8042 |
| Membres du corps professoral | 8043 |
| Blog | 8044 |
| Connexion | 8045 |
| Partage de commentaire et fichier | 8046 |

Les cinq pages institutionnelles utilisent la présentation de la refonte et des
contenus du site existant ; la page Qui sommes-nous reprend la présentation déjà
préparée dans la refonte. Elles sont reliées entre elles dans leurs menus.

Les pages de refonte existantes reçoivent, dans l’aperçu du thème brouillon, les
menus corrigés via `assets/scipt-retours.js` et `assets/scipt-retours.css`.
Le module PHP du brouillon est `inc/scipt-campus.php`, chargé depuis functions.php.
Les liens des parcours pointent vers les brouillons 7839 et 7509.

Le blog utilise les articles WordPress publiés. La connexion utilise le formulaire
WordPress natif. Les enseignants Instructor sont dirigés vers le tableau de bord
installé `/instructor-dashboard/`, les étudiants vers `/mon-compte/` et
l’administration vers wp-admin. Les permissions de LearnDash restent celles de
l’installation existante ; aucun compte ni privilège supplémentaire n’est créé.

Le formulaire de partage est un shortcode WordPress avec modération et fichiers
privés. Le dossier privé doit encore être configuré sur l’hébergement avant les
tests d’envoi. Les traitements PHP restent dans le thème brouillon ; ils ne sont
pas activés pour le public et ne peuvent pas être considérés comme opérationnels
sur le thème en ligne.

Pour examiner les pages privées, se connecter à WordPress, puis ouvrir l’éditeur
de la page et son aperçu. La consultation publique automatisée renvoie une page
non trouvée, ce qui ne permet pas de vérifier visuellement les brouillons.
La recette visuelle, les tests de connexion et les tests de téléversement restent
nécessaires dans l’aperçu authentifié avant toute mise en ligne.

Le dépôt distant GitHub n’a pas été modifié dans cette étape.
