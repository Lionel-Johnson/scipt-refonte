# Vérification sécurisée des diplômes
La page GitHub Pages utilise une Edge Function Supabase pour consulter des registres privés.
- Genius College / Blessed Cosmopolitan College UK : table `partner_diplomas`.
- SCIPT INTERNATIONAL — Gabon : table `scipt_gabon_diplomas`.
Les tables ont RLS activé et aucune lecture n'est accordée à anon/authenticated. La clé service_role reste exclusivement dans les secrets de la fonction.
## Installation
1. Créer un projet Supabase dédié.
2. Exécuter la migration `supabase/migrations/202611040001_private_diploma_registers.sql`.
3. Déployer `supabase/functions/verify-diploma/index.ts` sous le nom `verify-diploma`.
4. Configurer les secrets SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY côté Supabase.
5. Renseigner l'URL du projet et la clé anon publique dans `assets/diploma-verification-config.js`.
6. Importer uniquement les données vérifiées et autorisées dans chaque table séparément.
## Données sources
Le document `code GENIUS.docx` et ses fiches ne sont pas dans ce dépôt. Aucun dossier fictif n'est créé. Il faudra réimporter les données du document original dans le registre privé Genius/BCC. Les diplômes SCIPT Gabon seront importés séparément.
## À compléter
PDF officiel, photo éventuelle, gestion administrative sécurisée, journal d'audit et import contrôlé nécessitent le document source et les règles de validation de l'établissement.