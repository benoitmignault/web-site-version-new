import fr from './fr.json';

const dictionnaires = { fr };
let langue = 'fr';

// Changer la langue active (ex. : setLangue('en') quand en.json existera)
export function setLangue(l) {
	langue = l;
}

// Retourne le terme traduit pour la clé donnée, ou la clé si introuvable
export function t(cle) {
	return dictionnaires[langue][cle] ?? cle;
}
