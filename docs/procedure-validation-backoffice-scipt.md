# SCIPT INTERNATIONAL — Validation du back-office pédagogique (phase 1)

**État :** en prévisualisation, non publié sur le thème WordPress actif.

## État relevé le 16 octobre 2026

- LearnDash LMS, Instructor Role, ProPanel et UpdraftPlus sont actifs.
- WordPress dispose des rôles \`administrator\`, \`wdm_instructor\` et \`group_leader\` ; les étudiants utilisent les comptes de consultation des cours.
- Le rôle \`wdm_instructor\` possède actuellement \`publish_courses\` : la publication directe existe déjà. Aucun droit n'est modifié par cette phase.
- Des cours et quiz d'examens sont déjà enregistrés et publiés dans LearnDash. **Ce n'est pas une confirmation de leurs dates, de leurs inscriptions ni de leur disponibilité aux étudiants.**
- Le tableau admin « Performances SCIPT » existe déjà et classe les cours par filière. Le nouveau module le conserve.

## Livrables de la phase 1

1. \`inc/scipt-espace-pedagogique.php\` : shortcode \`[scipt_espace_pedagogique]\`, statistiques selon le rôle, accès aux outils LearnDash.
2. \`assets/scipt-pedagogie.css\` : habillage des tableaux de bord, accessible sur mobile.
3. \`inc/scipt-campus.php\` : chargement du module.
4. \`scipt-account-page.php\` : affichage du tableau de bord sous « Mon Compte » pour les utilisateurs connectés.

### Les trois expériences

**Administrateur / Direction.** Compteurs LearnDash ; accès aux cours soumis, quiz, permissions et aux performances par filière ; possibilité d'examiner les contenus en attente.

**Enseignant.** Vue de ses propres cours publiés, en attente et en brouillon ; accès aux outils de l'Instructor Role ; bouton facultatif « Soumettre pour validation » pour **ses propres brouillons de cours seulement**, avec nonce WordPress, vérification d'auteur et permission d'édition. Ce bouton passe le contenu à \`pending\`, il ne le publie pas. Les autorisations actuelles de publication directe ne sont pas changées.

**Étudiant.** Liste des cours publiés **auxquels son compte est inscrit selon LearnDash**, sans accès aux brouillons, aux listes d'enseignants ou aux tableaux administratifs.

## Tests obligatoires avant activation publique

1. Faire une sauvegarde vérifiée (fichiers et base de données) ; ne pas activer de thème sans accord explicite de la Direction.
2. En prévisualisation, ouvrir la page « Mon Compte » en tant qu'administrateur ; vérifier les compteurs et la liste d'attente.
3. Avec un **compte enseignant de test**, créer un cours *brouillon de test*, puis cliquer sur « Soumettre pour validation » ; confirmer qu'il devient \`pending\`. Ne pas utiliser un cours réel d'examen.
4. Vérifier qu'un enseignant B ne peut **ni modifier ni soumettre** le brouillon de A. Vérifier la protection nonce.
5. Avec un **compte étudiant de test**, s'assurer que seuls les cours LearnDash effectivement inscrits et publiés sont présentés, et que les autres tableaux de bord sont inaccessibles.
6. Vérifier l'interface sur mobile, le clavier, la lisibilité et les liens vers Instructor Role et LearnDash.
7. Vérifier que les examens déjà publiés ont toujours leurs paramètres de tentative, notation, dates, groupes, questions et restrictions d'accès d'origine.
8. Ne pas ajouter les étudiants et enseignants réels, ne pas envoyer de courriels automatiques et ne pas activer d'examen avant d'avoir les classes et le calendrier validés.

## Étape 2 — préparation des examens

Collecter auprès du service de scolarité : intitulé, filière, classe/niveau, enseignant responsable, date/heure et fuseau horaire de Libreville, durée, nombre de tentatives, barème, niveau minimal, groupe d'étudiants, modalités de surveillance, instructions d'accessibilité et date de publication des résultats.

Vérifier les paramètres LearnDash quiz et les inscriptions aux cours, puis procéder à une répétition avec deux comptes étudiants de test. Seule la Direction autorise l'ouverture réelle d'une session.

## Sécurité et limites

- **Aucune opération sur les utilisateurs, rôles, examens ou inscriptions réels** n'est effectuée par le nouveau module tant qu'un enseignant authentifié ne soumet pas explicitement son propre brouillon.
- Les statistiques sont calculées à partir des données LearnDash existantes ; elles ne représentent pas un taux de réussite et ne certifient pas qu'un examen est ouvert.
- Les autorisations \`publish_courses\` et \`unfiltered_html\` du rôle enseignant devront faire l'objet d'un audit et d'une décision explicite avant toute modification.
- Le travail a été transmis sur une **branche de développement** et dans le **thème WordPress de brouillon** ; la publication exige la recette ci-dessus.

## Note de contrôle

La mise à jour de quatre fichiers dans le brouillon WPVibe a réussi. Le contrôle visuel WordPress restant a été différé : le quota quotidien du connecteur Free a été atteint lors de la tentative d'ouverture de la prévisualisation.
