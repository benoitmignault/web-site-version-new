-- ============================================================================
-- Table : poker
-- Résultats par joueur et par tournoi des soirées de poker entre amis
-- (historique depuis décembre 2011). À exécuter APRÈS joueur
-- (la clé étrangère pointe là).
-- ============================================================================
CREATE TABLE `poker` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_joueur` int(11) DEFAULT NULL,                -- Joueur (joueur), NULL si le joueur a été supprimé
  `gain` int(11) NOT NULL,                         -- Résultat net du tournoi ($), négatif si perdant
  `victoire` tinyint(1) NOT NULL DEFAULT 0,        -- 1 = a remporté le tournoi, 0 sinon
  `fini_2e` tinyint(1) NOT NULL DEFAULT 0,         -- 1 = a terminé 2e, 0 sinon
  `id_tournoi` int(11) NOT NULL,                   -- Numéro du tournoi (1, 2, 3...)
  `date` date NOT NULL,                            -- Date du tournoi
  `killer` decimal(4,2) NOT NULL DEFAULT 0.00,      -- Éliminations (demi-points si une élimination est partagée)
  `prix_citron` decimal(4,2) NOT NULL DEFAULT 0.00, -- Part du prix citron (1 = entier, fractions si partagé)
  PRIMARY KEY (`id`),
  -- Un joueur ne peut pas avoir deux résultats dans le même tournoi
  UNIQUE KEY `uq_poker_joueur_tournoi` (`id_joueur`, `id_tournoi`),
  KEY `idx_poker_tournoi` (`id_tournoi`),
  CONSTRAINT `chk_poker_victoire` CHECK (`victoire` IN (0, 1)),
  CONSTRAINT `chk_poker_fini_2e` CHECK (`fini_2e` IN (0, 1)),
  -- Si le joueur est supprimé, ses résultats restent : l'historique ne s'efface pas
  CONSTRAINT `fk_poker_joueur` FOREIGN KEY (`id_joueur`)
    REFERENCES `joueur` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nous avons corrigé quelques anomalie dans les inserts de backup et maintenant tout est ok. On peut donc ajouter la contrainte d'intégrité référentielle.