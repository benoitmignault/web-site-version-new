-- ============================================================================
-- Table : amount_color
-- Valeurs des jetons de chaque organisateur (une couleur = un montant).
-- À exécuter APRÈS les tables `color` et `login_organisateur` (clés étrangères).
-- ============================================================================
CREATE TABLE `amount_color` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,               -- Organisateur propriétaire (login_organisateur)
  `id_color` int(11) NOT NULL,              -- Couleur du jeton (color)
  `amount` int(11) NOT NULL,               -- Valeur du jeton
  PRIMARY KEY (`id`),
  -- Un organisateur ne peut pas avoir deux fois la même couleur
  UNIQUE KEY `uq_amount_color_user_color` (`id_user`, `id_color`),
  -- Un organisateur ne peut pas avoir deux fois le même montant
  UNIQUE KEY `uq_amount_color_user_amount` (`id_user`, `amount`),
  KEY `idx_amount_color_color` (`id_color`),
  -- Si l'organisateur est supprimé, ses jetons le sont aussi
  CONSTRAINT `fk_amount_color_user` FOREIGN KEY (`id_user`)
    REFERENCES `login_organisateur` (`id`) ON DELETE CASCADE,
  -- Une couleur utilisée ne peut pas être supprimée
  CONSTRAINT `fk_amount_color_color` FOREIGN KEY (`id_color`)
    REFERENCES `color` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
