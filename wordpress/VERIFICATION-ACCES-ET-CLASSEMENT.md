# Vérification des accès et du classement — 15 octobre 2026

## Constats vérifiés sur WordPress

- Inscription des utilisateurs activée ; rôle par défaut : abonné.
- Pages publiées : Mon Compte (2550), Inscription (2450), confirmation (2451), réinitialisation du mot de passe (2452).
- LearnDash référence bien les pages 2450, 2451 et 2452 dans ses réglages d’inscription.
- Inventaire complet : 68 contenus LearnDash, tous publiés. Ce total inclut les épreuves enregistrées comme cours.
- Catalogue de référence : 72 filières. Les 68 identifiants de cours sont uniques et les 19 rapprochements confirmés pointent vers des filières existantes.
- Répartition : 19 rapprochements, 32 matières communes de santé, 10 matières générales communes, 7 affectations à préciser.
- Aucune modification manuelle enregistrée dans scipt_classification_overrides au moment du contrôle. Le formulaire d’administration permet d’enregistrer les modifications ultérieures, protégées par un nonce et la capacité manage_options.

## Correction du brouillon

Le tableau de bord utilisait uniquement la taxonomie WordPress des filières et ignorait les rapprochements validés. Il utilise désormais ces derniers lorsque le cours ne possède pas de classement taxonomique. Une modification explicite du tableau de classement a priorité. Les 72 filières sont affichées, y compris celles sans contenu, et les compteurs respectent le statut et le filtre de dates du contenu.

Cette correction ne modifie ni les inscriptions, ni les notes, ni les conditions d’accès LearnDash. Le thème actif reste Hello Elementor ; le thème de refonte demeure en brouillon.

## Limites et suite des tests

- Les cours 7212 et 6442 contrôlés sont configurés en mode LearnDash « free » (gratuit avec inscription). Ce constat ne vaut pas pour les 66 autres contenus et ne démontre pas une restriction par filière.
- Le classement pédagogique sert aux indicateurs ; il ne crée pas automatiquement de groupes d’étudiants ni de restrictions d’accès.
- La connexion a été confirmée auparavant par l’utilisateur ; ce contrôle n’a pas simulé une connexion étudiante.
- Restent à vérifier avec des comptes de test : création de compte complète, réception des e-mails, mot de passe oublié, accès autorisé et refusé à un cours, dépôt de contenu enseignant.
- Aucun e-mail de test n’a été envoyé et aucun compte réel ni résultat d’examen n’a été modifié.
- Les 7 affectations à préciser nécessitent une décision pédagogique avant rattachement à une filière unique.
