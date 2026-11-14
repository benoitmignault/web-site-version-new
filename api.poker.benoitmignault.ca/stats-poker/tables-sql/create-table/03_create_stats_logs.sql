-- ============================================================================
-- Table : stats_logs
-- Journal des statistiques de poker : une ligne par événement
-- (chargement de page, sélection d'une option d'affichage et de sa sous-option).
-- Même logique que timer_logs (minuteur) : les logs naissent de l'usage,
-- la table démarre vide, aucun fichier d'insert.
-- À exécuter APRÈS joueur (la clé étrangère pointe là).
-- ============================================================================
CREATE TABLE `stats_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `log_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Remplie par la BD à l'insertion
  `action_type` varchar(50) NOT NULL,       -- Type d'événement : page_load ou view_load
  `action_name` varchar(255) NOT NULL,      -- Libellé de l'action (ex. : Affichage page, Affichage vue)
  `player_id` int(11) DEFAULT NULL,         -- Joueur choisi (vue Joueur seulement, NULL sinon)
  `tournament_id` int(11) DEFAULT NULL,     -- Tournoi choisi (vue Tournoi seulement, NULL sinon ; pas de FK : id_tournoi ne vit que dans poker)
  `min_presences` int(11) DEFAULT NULL,     -- Seuil choisi (vues Classement et Killers & citrons seulement, NULL sinon)
  `ip_address` varchar(45) NOT NULL,        -- Adresse IP du visiteur (IPv4 ou IPv6)
  PRIMARY KEY (`id`),
  KEY `idx_action_type` (`action_type`),
  KEY `idx_log_date` (`log_date`),
  KEY `idx_player_id` (`player_id`),
  KEY `idx_tournament_id` (`tournament_id`),
  -- Si le joueur est supprimé, ses logs sont conservés (id passé à NULL) :
  -- les statistiques ne doivent jamais perdre de lignes
  CONSTRAINT `fk_stats_logs_joueur` FOREIGN KEY (`player_id`)
    REFERENCES `joueur` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
