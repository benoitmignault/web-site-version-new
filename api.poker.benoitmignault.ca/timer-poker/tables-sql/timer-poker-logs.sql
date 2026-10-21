-- Logs du minuteur de poker : chargements de page et sélections d'organisateur
CREATE TABLE `timer_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `log_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `action_type` varchar(50) NOT NULL,
  `action_name` varchar(255) NOT NULL,
  `organizer_id` int(11) DEFAULT NULL,
  `ip_address` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_action_type` (`action_type`),
  KEY `idx_log_date` (`log_date`),
  KEY `idx_organizer_id` (`organizer_id`),
  CONSTRAINT `fk_timer_logs_organisateur` FOREIGN KEY (`organizer_id`)
    REFERENCES `login_organisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
