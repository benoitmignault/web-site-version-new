-- ============================================================================
-- Table : login_organisateur
-- Les organisateurs des soirées de poker (identifiant, mot de passe haché,
-- nom affiché). Table racine : à exécuter AVANT amount_color, mise_small_big
-- et timer_logs (leurs clés étrangères pointent ici).
-- ============================================================================
CREATE TABLE `login_organisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(30) NOT NULL,              -- Identifiant de connexion, unique
  `password` varchar(100) NOT NULL,         -- Mot de passe haché (bcrypt)
  `name` varchar(30) NOT NULL,              -- Nom affiché dans la liste des organisateurs
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_login_organisateur_user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
