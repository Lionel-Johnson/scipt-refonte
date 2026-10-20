# Repères des écoles dans le catalogue universitaire

Les cinq blasons officiels sont visibles dans le sélecteur des écoles et en
tête de chaque section de `programmes-universitaires.html`. Les titres, les
filières et les destinations des liens sont conservés. Les images restent
entières grâce à `object-fit: contain`, sans recadrage ni redessin.

Chaque école possède un bandeau séparateur avec son blason, son numéro et son
intitulé. La navigation devient une grille de cartes avec ombres et survol,
adaptée aux écrans mobiles et aux préférences de réduction des mouvements.

Après une régénération du catalogue, appliquer :

```bash
python scripts/integrer-logos-programmes.py
```

Le script est idempotent et met aussi à jour le fragment WordPress et sa feuille
de style. Pour le brouillon WordPress, synchroniser uniquement après le retour
du quota WPVibe : `assets/institution-pages.json`,
`assets/programmes-identites.css` et `inc/scipt-institution.php`. Les autres
modifications en attente des tâches précédentes restent à synchroniser.

Les vérifications portent sur les cinq correspondances de blasons, les liens,
les filières conservées et les images non recadrées. Le navigateur de contrôle
n’étant pas disponible, le rendu visuel en navigateur reste à vérifier.
