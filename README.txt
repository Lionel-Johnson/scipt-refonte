SCIPT INTERNATIONAL — Site HTML5, CSS, JavaScript et Bootstrap

Ouvrir index.html dans un navigateur. Le site fonctionne sans compilation. Les quatre pages sont Accueil, Programmes universitaires, Admissions et Médias. Leurs images, scripts et styles sont inclus dans assets/.

Les deux vues de l'accueil changent automatiquement. Le logo est entouré d'un anneau animé. Les parcours dévoilent leurs photos au survol ; sur écran tactile, elles sont affichées directement. Les filtres de formations, la galerie Médias et son affichage agrandi fonctionnent dans le navigateur.

Les deux fonds de slide et les visuels photographiques ont été créés à partir des prototypes du client. Le blason de l'École Doctorale provient du fichier fourni. Les autres insignes sont affichées intégralement sans recadrage.

Le formulaire de contact de l'accueil prépare un email dans la messagerie du visiteur. Pour recevoir les demandes sans messagerie locale, connecter un traitement serveur avant la publication.

MÉDIATECH (septembre 2026)
- La page medias.html rassemble la galerie existante et la nouvelle rubrique Images / Textes / Vidéos. Un accès en trois cartes figure sur l'accueil.
- Le contenu est modifiable dans assets/mediatech-content.js. Ajoutez un objet de type 'image', 'texte' ou 'video' au tableau window.SCIPT_MEDIATECH. Exemple vidéo :
  {type:'video', category:'TÉMOIGNAGE', title:'Mon parcours', text:'Présentation validée.', video:'https://www.youtube.com/watch?v=XXXXXXXXXXX', image:'assets/cours-universitaire.png', alt:'Couverture de la vidéo', credit:'Prénom, formation'}
- Les URL YouTube, Vimeo et les fichiers MP4/WebM placés dans assets/ sont pris en charge. Aucun témoignage vidéo fictif n'est publié.
- Le formulaire « Votre histoire dans la Médiatech » prépare un courriel vers info@sciptinternational.com. Il nécessite une messagerie configurée sur l'appareil de la personne qui soumet le contenu. Aucun fichier ne peut être transféré directement par le site HTML : demandez un lien partageable. Vérifiez les droits de diffusion et ajoutez manuellement les contributions validées dans mediatech-content.js.
- Pour permettre un téléversement direct et une modération en ligne, il faut une fonction côté serveur (par exemple le module vidéo WordPress).
