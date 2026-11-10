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

/**
 * Retourne le suffixe ordinal d'un nombre dans la langue active.
 * Français : 1er, puis 2e, 3e, ... — Anglais : 1st, 2nd, 3rd, 4th, ...
 * avec l'exception 11th, 12th, 13th (et 111th, 112th, 113th).
 *
 * @param {number} n Le nombre à suffixer.
 * @returns {string} Le suffixe ordinal (à afficher en exposant).
 */
export function ordinalSuffix(n) {

	// En anglais, les exceptions sont 11, 12 et 13 (et 111, 112, 113, etc.)
	if (currentLanguage === "en") {
		const lastTwo = n % 100;
		if (lastTwo >= 11 && lastTwo <= 13) {
			return "th";
		}

		switch (n % 10) {
			case 1: return "st";
			case 2: return "nd";
			case 3: return "rd";
			default: return "th";
		}
	}

	// En français, seul le 1er est spécial, tous les autres sont "e"
	return n === 1 ? "er" : "e";
}

/**
 * Indique si le suffixe ordinal de la langue active s'affiche en exposant.
 * Français : oui (220ᵉ). Anglais : non, il reste sur la ligne (220th).
 *
 * @returns {boolean} Vrai si le suffixe va en exposant.
 */
export function ordinalInSuperscript() {
	return currentLanguage === "fr";
}

