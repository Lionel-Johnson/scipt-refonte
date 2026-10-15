# Cinq écoles et présentations vidéo — 15 octobre 2026

Présentation client : **5 écoles**, dans l’ordre ESSA, ESGA, ESTI, ESHC, École Doctorale Internationale SCIPT. Les regroupements, identifiants et 40 filières de la synthèse sont conservés. Les menus, la sélection de l’accueil et les pages de catalogue suivent cet ordre ; la santé arrive aussi en tête de l’offre professionnelle.

Les pages des cinq écoles comportent un lecteur vidéo natif avec commandes, sans lecture automatique. Santé : film « Spot Final Santé » de la médiathèque existante. Gestion : témoignage transport et logistique. ESTI, ESHC et école doctorale : trois séquences institutionnelles éditoriales de 15 secondes, construites à partir des domaines de la synthèse, avec texte à l’écran et blasons d’origine. Ces trois séquences sont sans voix et ne présentent pas de prises de vue de campus. Leurs sources reproductibles sont dans `scripts/produire-videos-ecoles.py`.

Les blasons santé, droit-gestion et technologies déjà extraits du guide sont repris intégralement. L’ESHC utilise la signature officielle University, aucun blason propre à cette école n’étant identifié dans la synthèse. Les descriptions proviennent des guides santé et général et des domaines de la synthèse ; leur provenance est indiquée dans le référentiel. Le premier pôle santé est intitulé « Médecine Générale et Pharmacie ». Les deux filières et leurs identifiants restent distincts.

WordPress : mise à jour du thème en brouillon et du registre commun (11 fragments). Aucun changement du thème public, des inscriptions, des comptes ou des rattachements des cours.

Vérifications : `node scripts/verifier-architecture.cjs`, `python scripts/verifier-ecoles-videos.py`, contrôle du rendu WordPress et de la lecture des médias.

Compatibilité du thème existant : `assets/ecoles-titres.js` place désormais l’école doctorale en dernier et la santé en premier. Dans le `functions.php` du brouillon existant, la version de son enqueue est passée de `20261014-3` à `20261015-ecoles-videos` pour invalider l’ancien script en cache. Le texte de la fenêtre À propos indique également cinq écoles.

Contrôle effectué : chargement et lecture effective du film santé (158,88 s) et de la séquence ESTI (15 s) dans le navigateur WordPress ; ordre après exécution des scripts vérifié. Les trois nouveaux MP4 sont accessibles en HTTP 200 et identiques aux fichiers sources. Les cinq pages restent en statut `draft`.
