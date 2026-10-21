-- ============================================================================
-- Table : timer_logs
-- Journal des statistiques du minuteur : une ligne par événement
-- (chargement de page, sélection d'un organisateur).
-- À exécuter APRÈS login_organisateur (la clé étrangère pointe là).
-- Aucun fichier d'insert : les logs naissent de l'usage, la table démarre vide.
-- ============================================================================
CREATE TABLE `timer_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `log_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Remplie par la BD à l'insertion
  `action_type` varchar(50) NOT NULL,       -- Type d'événement : page_load ou organizer_load
  `action_name` varchar(255) NOT NULL,      -- Libellé de l'action (ex. : Affichage page)
  `organizer_id` int(11) DEFAULT NULL,      -- Organisateur choisi (NULL pour un page_load)
  `ip_address` varchar(45) NOT NULL,        -- Adresse IP du visiteur (IPv4 ou IPv6)
  PRIMARY KEY (`id`),
  KEY `idx_action_type` (`action_type`),
  KEY `idx_log_date` (`log_date`),
  KEY `idx_organizer_id` (`organizer_id`),
  -- Si l'organisateur est supprimé, ses logs sont conservés (id passé à NULL) :
  -- les statistiques ne doivent jamais perdre de lignes
  CONSTRAINT `fk_timer_logs_organisateur` FOREIGN KEY (`organizer_id`)
    REFERENCES `login_organisateur` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
