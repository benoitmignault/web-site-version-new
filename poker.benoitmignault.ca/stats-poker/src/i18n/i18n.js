import fr from "./fr.json";
import en from "./en.json";

// Les dictionnaires par langue
const translations = { fr, en };

// La langue active (français par défaut)
let currentLanguage = "fr";

/**
 * Change la langue active.
 *
 * @param {string} lang Le code de langue ("fr" ou "en").
 */
export function setLanguage(lang) {
	if (translations[lang]) {
		currentLanguage = lang;
	}
}

/**
 * Retourne le texte pour une clé dans la langue active.
 * Si la clé n'existe pas, retourne la clé elle-même.
 *
 * @param {string} key La clé de traduction.
 * @returns {string} Le texte traduit.
 */
export function t(key) {
	return translations[currentLanguage][key] ?? key;
}
