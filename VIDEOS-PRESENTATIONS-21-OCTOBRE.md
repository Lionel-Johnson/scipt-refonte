# Présentations ESSA et ESGA

Les deux vidéos remises le 21 octobre 2026 sont intégrées aux pages de leurs
écoles, immédiatement après le bandeau portant le nom et le blason officiel.
Un lecteur natif avec commandes permet leur lecture directe sur le site.

- `ecole-sante-developpement.html#presentation-essa`
- `ecole-droit-sciences-gestion.html#presentation-esga`

Les fichiers de diffusion sont en MP4 H.264, 1280 × 720, avec audio AAC et
index de lecture placé en début de fichier pour démarrer le téléchargement
progressif. Aucun plan n’est retiré. Les fichiers originaux fournis restent
inchangés ; le manifeste conserve leur empreinte et celle des versions web.

Le spot santé déjà validé reste accessible dans les archives de l’ESSA.
Le témoignage de Pemba et le bloc consacré au droit restent sur la page ESGA.
Les autres témoignages et galeries restent en place.

Après une régénération des pages et des présentations, exécuter :

```bash
python scripts/integrer-videos-presentations.py
```

Le script actualise aussi les deux fragments du brouillon WordPress et le
référentiel de vidéos local. Cette préparation ne publie pas le site WordPress.
