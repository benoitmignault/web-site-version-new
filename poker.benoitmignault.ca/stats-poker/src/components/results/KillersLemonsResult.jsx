import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../../config";
import { FaLemon, FaSkullCrossbones, FaTrophy } from "react-icons/fa";
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
 * Résultat de la vue Killers & citrons.
 *
 * Au montage et à chaque changement de minimum de présences, appelle killers-lemons.php,
 * qui retourne les spécialités des joueurs ayant au moins le nombre de présences demandé
 * (méthode 7 : killers et prix citrons seulement, à partir du 101e tournoi — les 100 premiers
 * n'avaient ni l'un ni l'autre —, avec les ratios par présence calculés en SQL).
 * Aucune notion de victoire ni de 2e place dans cette vue.
 * L'ordre reçu du serveur est l'ordre d'affichage dans un premier temps
 * (killers décroissants, citrons croissants, présences croissantes).
 * Le triage interactif est côté client : on peut trier par n'importe quelle colonne, dans les deux sens.
 *  - Sauf le rang, qui est fixe et ne se trie pas.
 *
 * @param {Object} props Les propriétés du composant.
 * @param {number} props.minPresences Le nombre minimal de présences choisi dans le sélecteur.
 */
function KillersLemonsResult( { minPresences }) {
	
	// Les lignes du classement reçues de l'API
	const [players, setPlayers] = useState(null);

	// Le tri courant : la colonne (key) et le sens (direction).
	// Par défaut, celui de l'endpoint : killer décroissant.
	const [sort, setSort] = useState({ key: "killer", direction: "desc" });
	
	// L'erreur à afficher : { code, message } — le code est traduit au rendu, donc suit la langue
	const [error, setError] = useState(null);

	// Compteur d'appels : seule la réponse du dernier appel a le droit de mettre à jour l'état
	const requestCount = useRef(0);

	// Fonction pour charger le classement général des killers et citrons, avec le minimum de présences choisi.
	const loadKillersLemons = async () => {

		// Le numéro de cet appel : si un appel plus récent survient, la réponse de celui-ci sera ignorée
		const requestId = ++requestCount.current;

		try {
			const response = await fetch(`${API_BASE_URL}/killers-lemons.php?min_presences=${minPresences}`);

			const data = await response.json();

			// Réponse périmée : un autre seuil a été choisi entre-temps, on ignore cette réponse
			if (requestId !== requestCount.current) {
				return;
			}

			if (data.success) {

				// Le format de la réponse est : {success: true, leaderboard: [...]}
				setPlayers(data.killersLemons);
				setError(null);
			} else {

				// Erreur retournée par l'API lors du chargement du classement
				setPlayers(null);
				setError({ code: data.code, message: data.message });
			}
		} catch (err) {

			// Erreur périmée, même principe : un appel plus récent a pris le relais
			if (requestId !== requestCount.current) {
				return;
			}

			console.error(err);
			setPlayers(null);
			setError({ code: "errorLoadingKillersLemons", message: "" });
		}
	};

	// On charge le classement au montage et à chaque changement de seuil
	useEffect(() => {

		// On vide le classement courant : pendant le chargement du nouveau,
		// c'est le message d'attente qui s'affiche, pas l'ancien tableau
		setPlayers(null);
		setError(null);
		loadKillersLemons();
	}, [minPresences]);

	// Fonction pour changer le tri quand on clique un en-tête :
	// même colonne = on inverse le sens ; nouvelle colonne = son sens
	// naturel (croissant pour le nom, décroissant pour les chiffres)
	const handleSort = (key) => {

		if (sort.key === key) {
			setSort({ key, direction: sort.direction === "asc" ? "desc" : "asc" });
		} else {
			setSort({ key, direction: key === "nom" ? "asc" : "desc" });
		}
	};

	// Si le chargement a échoué, on affiche l'erreur au lieu du résultat
	if (error) {
		return <p className="error-message">{error.code ? t(error.code) : error.message}</p>;
	}

	// Pendant le chargement, on affiche un message d'attente
	if (!players) {
		return <p className="loading-message">{t("loading")}</p>;
	}

	// Copie triée des lignes selon le tri courant : on ne trie jamais
	// le tableau reçu (players), toujours une copie.
	// Le tri JavaScript est stable : à valeur égale, l'ordre du serveur
	// est conservé (killers, puis citrons, puis présences) — ce sont
	// les départages de l'endpoint, gratuits.
	const sortedPlayers = [...players].sort((a, b) => {
		const aValue = a[sort.key];
		const bValue = b[sort.key];

		// Le nom se compare comme du texte, les autres colonnes comme des nombres
		const comparison = typeof aValue === "string"
			? aValue.localeCompare(bValue)
			: aValue - bValue;

		return sort.direction === "asc" ? comparison : -comparison;
	});

	// En-tête triable : le clic trie par sa colonne, la flèche montre le tri actif
	const sortableHeader = (key, label, className) => (
		<th
			className={`${className} sortable-header`}
			aria-sort={sort.key === key ? (sort.direction === "asc" ? "ascending" : "descending") : undefined}
		>
			<button type="button" className="sort-button" onClick={() => handleSort(key)}>
				{label}
				{sort.key === key && (
					<span className="sort-arrow"> {sort.direction === "asc" ? "▲" : "▼"}</span>
				)}
			</button>
		</th>
	);

	return (
		<div className="killers-lemons-result">
			<h2 className="result-subtitle">{t("resultKillersLemons")}</h2>
			<div className="history-table-wrapper">
				<table className="history-table">
					<thead>
						<tr>
							<th className="col-center">{t("rank")}</th>
							{sortableHeader("nom", t("playerLabel"), "")}
							<th className="col-center">
								<a className="special-mentions-link" href="#special-mentions-note">
									{t("specialMentions")} *
								</a>
							</th>
							{sortableHeader("killers", (<><FaSkullCrossbones aria-hidden="true" /> {t("killers")}</>), "col-right")}
							{sortableHeader("citrons", (<><FaLemon aria-hidden="true" /> {t("lemons")}</>), "col-right")}
							{sortableHeader("presences", t("presences"), "col-center")}
							{sortableHeader("killerParPresence", t("killerPerPresence"), "col-right ratio-start")}
							{sortableHeader("citronParPresence", t("lemonPerPresence"), "col-right")}
						</tr>
					</thead>
					<tbody>
						{sortedPlayers.map((player, index) => (
							<tr key={player.id}>
								<td className="col-center rank-cell">
									{index < 3 ? (
										<span className="place-badge">
											<FaTrophy className={`trophy ${RANK_TROPHIES[index]}`} aria-hidden="true" /> {t(RANK_LABEL_KEYS[index])}
										</span>
									) : (
										index + 1
									)}
								</td>
								<td>{player.nom}</td>
								<td className="col-center special-mention-cell">
									{MEDALS[player.id] && (
										<span className="place-badge">
											<FaTrophy className={`trophy ${MEDALS[player.id]}`} aria-hidden="true" /> {t(MEDAL_LABEL_KEYS[MEDALS[player.id]])}
										</span>
									)}
								</td>
								<td className="col-right">{player.killers.toFixed(2)}</td>
								<td className="col-right">{player.citrons.toFixed(2)}</td>
								<td className="col-center">{player.presences}</td>
								<td className="col-right ratio-start">{player.killerParPresence.toFixed(2)}</td>
								<td className="col-right">{player.citronParPresence.toFixed(2)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<p className="leaderboard-note" id="special-mentions-note">* {t("specialMentionsNote")}</p>
		</div>
	);
}

export default KillersLemonsResult;
