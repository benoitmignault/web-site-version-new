-- ============================================================================
-- Table : joueur
-- Joueurs des soirées de poker entre amis (nom affiché). Table racine :
-- à exécuter AVANT poker (sa clé étrangère pointe ici).
-- ============================================================================
CREATE TABLE `joueur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `joueur` varchar(50) NOT NULL,            -- Nom du joueur (ex. : Benoit), unique
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_joueur_joueur` (`joueur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
