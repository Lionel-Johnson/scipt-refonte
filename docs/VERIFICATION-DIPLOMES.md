# Vérification sécurisée des diplômes

Les pages GitHub Pages et WordPress consultent le même registre privé Supabase au moyen de l’Edge Function `verify-diploma` (projet `bhudlcvksspivxqqyaxs`). Les fiches personnelles restent dans Supabase : aucun export nominatif n’est nécessaire dans ce dépôt public.

## Registres actifs

| Code envoyé au service | Table privée |
| --- | --- |
| `GENIUS` | `genius_diplomas` |
| `BCC` | `bcc_diplomas` |
| `MJB` | `mjb_diplomas` |
| `SCIPT_GABON` | `scipt_gabon_diplomas` |

Les tables conservent RLS. La clé `service_role` reste exclusivement côté serveur. `assets/diploma-verification-config.js` contient uniquement l’URL du projet et sa clé publique.

## Ajout et contrôle

1. Vérifier que la référence est unique dans le registre de l’établissement ; conserver les zéros initiaux.
2. Ajouter uniquement les données vérifiées et autorisées, avec les dates au format ISO `YYYY-MM-DD`.
3. Un dossier disponible pour consultation porte le statut `valid`.
4. Conserver `photo_url` à `NULL` lorsqu’aucune photo n’a été fournie.
5. Tester `POST /functions/v1/verify-diploma` avec `issuer` et `serial_number`, puis contrôler la fiche renvoyée.
6. Une nouvelle fiche Supabase est consultable par les deux sites sans copier ses données personnelles dans GitHub ni redéployer le service.

## Suivi du 10 novembre 2026

- Référence `101065`, établissement `GENIUS` : ajoutée au registre privé ; photo volontairement vide.
- Références `00101202` et `00101221`, établissement `SCIPT_GABON` : ajoutées au registre privé après correction de la seconde référence par l’administration ; photos volontairement vides. Les zéros initiaux sont conservés.

## Accès

- WordPress : https://sciptinternational.com/verification-diplomes/
- GitHub Pages : https://lionel-johnson.github.io/scipt-refonte/verification-diplomes.html
