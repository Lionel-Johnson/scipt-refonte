# Module SCIPT Campus — préparation du 14 octobre 2026

Ce module complète le site HTML ; il doit être installé sur le WordPress existant.
Il ne remplace pas le module de cours/examens déjà présent dans WordPress.

## Installation

1. Copier le dossier `scipt-campus` dans `wp-content/plugins/`.
2. Créer un dossier privé, persistant et accessible en écriture à PHP, **en dehors
   de tout répertoire servi par le serveur web** (y compris les domaines annexes).
   Ajouter dans `wp-config.php`, avant le chargement WordPress :

   ```php
   define('SCIPT_PRIVATE_UPLOAD_DIR', '/home/VOTRE_COMPTE/scipt-private');
   ```

   Remplacer le chemin par le chemin réel de l’hébergement. Le module refuse un
   dossier situé dans ABSPATH. L’administrateur doit également vérifier qu’aucun
   alias web ne dessert le dossier. Les fichiers restent accessibles uniquement
   par téléchargement authentifié dans l’administration.
3. Activer **SCIPT Campus**. Une page `partager-un-contenu` est créée uniquement
   si elle n’existe pas. Aucun compte existant ni rôle existant n’est modifié.
4. Attribuer manuellement le rôle approprié aux enseignants :
   - Enseignant SCIPT — validation requise : rédaction et soumission d’articles.
   - Enseignant SCIPT — publication directe : publication de ses articles.
   Les droits sur les cours et examens restent ceux du plugin pédagogique installé.
5. Vérifier que `/mon-compte/` fournit bien le tableau de bord étudiant existant.
   Connexion WordPress : administrateur → administration ; rédacteur/enseignant
   autorisé → ses articles ; autres utilisateurs → `/mon-compte/`.
6. Déployer les HTML et les assets de la refonte. Les pages À propos, le Blog et
   les comptes restent reliés aux pages WordPress existantes. Les URL publiques
   doivent être testées : certaines pages historiques n’ont pas répondu à la revue.

## Réception des commentaires et fichiers

La médiathèque affiche le formulaire WordPress dans une iframe nommée. Aucun lien
Drive n’est demandé. La page native et l’iframe utilisent le même traitement.
Les visiteurs peuvent proposer un texte et un fichier. Les propositions restent
en attente ; aucun fichier n’est publié automatiquement. L’administration les
consulte dans **Propositions Médiathèque** et décide de leur diffusion.

Formats : JPEG, PNG, WebP, MP4, WebM. Limite : 20 Mo ou la limite PHP/WordPress si
elle est inférieure. Le type réel est contrôlé côté serveur. Les requêtes sont
protégées par nonce et limitées à cinq tentatives par heure et adresse IP ; derrière
un proxy, configurer correctement REMOTE_ADDR sans faire confiance à un en-tête
fourni librement par le visiteur. Exclure la page de formulaire de la mise en cache.
Sans dossier privé configuré, seul le commentaire texte peut être envoyé.

## Recette obligatoire sur WordPress

- Connexion et déconnexion avec un étudiant, chaque rôle enseignant et un administrateur.
- Soumission d’un article par l’enseignant soumis à validation ; publication par
  l’enseignant habilité ; impossibilité de modifier les articles d’autrui.
- Envoi anonyme d’un texte, d’une image et d’une vidéo ; réception en attente.
- Rejet de fichiers exécutables, falsifiés, trop volumineux et de nonce invalide.
- Téléchargement privé : administrateur autorisé ; visiteurs/enseignants refusés.
- Suppression définitive d’une proposition : suppression du fichier associé.
- Navigation ordinateur/mobile, pages À propos, Blog et catalogues.

La vérification locale du site HTML ne prouve pas le fonctionnement de WordPress.
Le module n’a pas été activé sur le site en ligne dans cette préparation.
