-- ============================================================================
-- Table : color
-- Couleurs de jetons (référence) : nom technique en anglais (clé i18n et CSS)
-- et nom affiché en français. Table racine : à exécuter AVANT amount_color
-- (sa clé étrangère pointe ici).
-- ============================================================================
CREATE TABLE `color` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `color_english` varchar(30) NOT NULL,     -- Identifiant technique (ex. : darkblue), unique
  `color_french` varchar(30) NOT NULL,      -- Nom affiché en français (ex. : Bleu foncé)
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_color_english` (`color_english`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
