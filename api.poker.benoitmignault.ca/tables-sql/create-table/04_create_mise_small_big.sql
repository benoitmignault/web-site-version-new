-- ============================================================================
-- Table : mise_small_big
-- Structure des blinds de chaque organisateur : un niveau = une paire
-- (petite mise, grosse mise). À exécuter APRÈS login_organisateur
-- (la clé étrangère pointe là).
-- ============================================================================
CREATE TABLE `mise_small_big` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,               -- Organisateur propriétaire (login_organisateur)
  `level` int(11) NOT NULL DEFAULT 0,       -- Niveau de blinds (1, 2, 3...)
  `small` int(11) NOT NULL,                 -- Petite mise (small blind)
  `big` int(11) NOT NULL,                   -- Grosse mise (big blind), toujours > small
  PRIMARY KEY (`id`),
  -- Un organisateur ne peut pas avoir deux fois la même paire de mises
  UNIQUE KEY `uq_mise_small_big_user_pair` (`id_user`, `small`, `big`),
  -- Un organisateur ne peut pas avoir deux fois le même niveau
  UNIQUE KEY `uq_mise_small_big_user_level` (`id_user`, `level`),
  -- La grosse mise doit toujours dépasser la petite
  CONSTRAINT `chk_mise_small_big_big_gt_small` CHECK (`big` > `small`),
  -- Si l'organisateur est supprimé, ses blinds le sont aussi
  CONSTRAINT `fk_mise_small_big_user` FOREIGN KEY (`id_user`)
    REFERENCES `login_organisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
