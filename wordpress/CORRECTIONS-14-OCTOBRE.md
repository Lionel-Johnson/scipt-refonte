# Corrections client — pages, logos et portail

- Les deux fichiers de logos fournis sont conservés intégralement dans assets.
  Le bandeau est placé avant la présentation vidéo sur les deux catalogues.
  Animation CSS légère et arrêt de l’animation si le visiteur préfère réduire
  les mouvements. Aucun recadrage du logo.
- Les cinq pages institutionnelles sont indépendantes dans la refonte.
- Le blog contient les quatre articles publiés du site existant, avec leurs
  images, descriptions, dates et contenus. La version WordPress affiche les
  articles depuis la base existante, avec recherche, catégories et pagination.
  Les formations professionnelles, le parcours de 18 mois et la VAE sont ajoutés
  dans un espace À découvrir.
- Connexion, création de compte, demande de réinitialisation et changement de
  mot de passe utilisent le portail avec l’en-tête de la refonte.
  La création de compte respecte users_can_register et attribue uniquement
  le rôle subscriber. Elle ne crée aucun administrateur ni enseignant.
- Tableau de bord WordPress en brouillon : page 8063 ; inscription domestique :
  8064 ; internationale : 8065 ; inclusive : 8066. Les descriptions sont reprises
  des pages d’admission existantes ; le formulaire Multi Step Form n°3 est réutilisé.
- Les commentaires acceptent une image ou une vidéo depuis l’appareil. Les
  fichiers sont vérifiés côté serveur et conservés hors de la racine publique.
  Un commentaire comportant un fichier est placé en attente de modération.
- Le stockage privé essaie un dossier voisin de la racine web. Si l’hébergement
  en refuse l’écriture, SCIPT_PRIVATE_UPLOAD_DIR doit désigner un dossier privé
  persistant accessible à PHP. Vérifier les sauvegardes de ce dossier.

Les pages et le thème WordPress restent en brouillon. Aucun compte de test n’a
été créé et aucun courriel de réinitialisation n’a été envoyé. La validation
dans un navigateur authentifié, la création de compte, le routage des tableaux
de bord et la réception d’un fichier doivent être testés avant publication.
La version HTML présente les interfaces ; les traitements serveur appartiennent
à la version WordPress et ne fonctionnent pas sur un hébergement HTML seul.
