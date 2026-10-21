-- ============================================================================
-- Base de données : benoitmignault_poker_night_stats
-- Statistiques des soirées de poker entre amis (tenues depuis décembre 2011) :
-- les joueurs et les résultats par tournoi. Schéma du prochain outil de l'API
-- (stats des soirées de poker), préparé d'avance.
--
-- Charset utf8mb4 / collation unicode_ci : comme toutes les autres bases
-- du projet.
--
-- Notes hébergeur (cPanel) : mêmes règles que poker_night_organizers —
-- création via « Bases de données MySQL » (préfixe ajouté automatiquement),
-- utilisateur existant rattaché avec ALL PRIVILEGES, identifiants dans
-- info-connexion-bd.php (jamais versionné).
--
-- Suite (au moment de bâtir l'outil) : les tables `joueur` et `poker`
-- recevront le même traitement create-table/ + insert-table/ que celles
-- des organisateurs.
-- ============================================================================
CREATE DATABASE `benoitmignault_poker_night_stats`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
