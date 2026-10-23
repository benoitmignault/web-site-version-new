-- ============================================================================
-- Base de données : benoitmignault_poker_night_organizers
-- Nouveau schéma prod du minuteur de poker (timer-poker) : organisateurs,
-- couleurs et valeurs de jetons, structures de blinds, journal de stats.
--
-- Charset utf8mb4 / collation unicode_ci : supporte les accents
-- (ex. : « Bleu foncé ») et l'Unicode complet, comme toutes les tables.
--
-- Notes hébergeur (cPanel) :
-- - La base se crée via « Bases de données MySQL » ; le préfixe du compte
--   (benoitmignault_) est ajouté automatiquement au nom.
-- - L'utilisateur MySQL existant doit ensuite être rattaché à cette base
--   avec ALL PRIVILEGES — ses identifiants vont dans info-connexion-bd.php
--   (fichier jamais versionné dans Git).
--
-- Suite du déploiement : exécuter les fichiers de create-table/ dans
-- l'ordre, puis ceux de insert-table/ dans l'ordre.
-- ============================================================================
CREATE DATABASE `benoitmignault_poker_night_organizers`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
  