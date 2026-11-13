import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../../config";
import { FaTrophy } from "react-icons/fa";
import { t } from "../../i18n/i18n";

// Médailles des tournois anniversaires : au 100e et au 150e tournoi,
// un trophée a été remis aux 3 premiers de chaque tournoi.
// La clé est l'id du joueur, la valeur la classe de couleur du trophée.
const MEDALS = {
	39: "gold", // Frederic V — 1er du 100e
	17: "silver", // Frederic — 2e du 100e
	10: "bronze", // Marc-Andre — 3e du 100e
	14: "gold", // Richard — 1er du 150e
	27: "silver", // Maxime — 2e du 150e
	7: "bronze", // Jean-Philippe — 3e du 150e
};

// Trophées du podium : la couleur suit la position dans le classement affiché
const RANK_TROPHIES = ["gold", "silver", "bronze"];

// Noms accessibles des mentions : l'exploit des tournois spéciaux, selon la couleur
const MEDAL_LABEL_KEYS = {
	gold: "firstPlace", // 1re place — nouvelle clé
	silver: "secondPlace", // 2e place — existe déjà
	bronze: "thirdPlace", // 3e place — nouvelle clé
};

// Noms accessibles du podium : la position dans le classement affiché, selon l'index
const RANK_LABEL_KEYS = ["rankFirst", "rankSecond", "rankThird"];

/**
 * Résultat de la vue Killers Lemons.
 *
 * À venir dans la branche feature/poker/killers-lemons-results :
 * pour l'instant, le composant ne rend rien.
 */
function KillersLemonsResult() {
	return null;
}

export default KillersLemonsResult;
