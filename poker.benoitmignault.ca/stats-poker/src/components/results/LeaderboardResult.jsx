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

/**
 * Résultat de la vue Classement.
 *
 * Au montage et à chaque changement de seuil, appelle leaderboard.php,
 * qui retourne le classement général des joueurs ayant au moins
 * le nombre de présences demandé (méthode 4 : aucune notion de
 * killer ni de prix citron). L'ordre reçu du serveur est l'ordre
 * d'affichage ; le rang est la position dans la liste.
 * Le tri interactif par colonne viendra plus tard.
 *
 * @param {Object} props Les propriétés du composant.
 * @param {number} props.minPresences Le nombre minimal de présences choisi dans le sélecteur.
 */
function LeaderboardResult({ minPresences }) {

	// Les lignes du classement reçues de l'API
	const [players, setPlayers] = useState(null);

	// L'erreur à afficher : { code, message } — le code est traduit au rendu, donc suit la langue
	const [error, setError] = useState(null);

	// Compteur d'appels : seule la réponse du dernier appel a le droit de mettre à jour l'état
	const requestCount = useRef(0);

	// Fonction pour charger le classement général
	const loadLeaderboard = async () => {

		// Le numéro de cet appel : si un appel plus récent survient, la réponse de celui-ci sera ignorée
		const requestId = ++requestCount.current;

		try {
			const response = await fetch(`${API_BASE_URL}/leaderboard.php?min_presences=${minPresences}`);

			const data = await response.json();

			// Réponse périmée : un autre seuil a été choisi entre-temps, on ignore cette réponse
			if (requestId !== requestCount.current) {
				return;
			}

			if (data.success) {

				// Le format de la réponse est : {success: true, players: [...]}
				setPlayers(data.leaderboard);
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
			setError({ code: "errorLoadingLeaderboard", message: "" });
		}
	};

	// On charge le classement au montage et à chaque changement de seuil
	useEffect(() => {

		// On vide le classement courant : pendant le chargement du nouveau,
		// c'est le message d'attente qui s'affiche, pas l'ancien tableau
		setPlayers(null);
		setError(null);
		loadLeaderboard();
	}, [minPresences]);

	// Si le chargement a échoué, on affiche l'erreur au lieu du résultat
	if (error) {
		return <p className="error-message">{error.code ? t(error.code) : error.message}</p>;
	}

	// Pendant le chargement, on affiche un message d'attente
	if (!players) {
		return <p className="loading-message">{t("loading")}</p>;
	}

	return (
		<div className="leaderboard-result">
			<h2 className="result-subtitle">{t("resultLeaderboard")}</h2>
			<div className="history-table-wrapper">
				<table className="history-table">
					<thead>
						<tr>
							<th className="col-center">{t("rank")}</th>
							<th>{t("playerLabel")}</th>
							<th className="col-right">{t("gain")}</th>
							<th className="col-center">{t("wins")}</th>
							<th className="col-center">{t("secondPlaces")}</th>
							<th className="col-center">{t("presences")}</th>
							<th className="col-right">{t("gainPerPresence")}</th>
						</tr>
					</thead>
					<tbody>
						{players.map((player, index) => (
							<tr key={player.id}>
								<td className="col-center">{index + 1}</td>
								<td className="player-name-cell">
									{player.nom}
									{MEDALS[player.id] && (
										<FaTrophy className={`trophy ${MEDALS[player.id]}`} />
									)}
								</td>
								<td className={player.gain > 0 ? "col-right gain-positive" : player.gain < 0 ? "col-right gain-negative" : "col-right"}>
									{player.gain > 0 ? `+${player.gain} $` : `${player.gain} $`}
								</td>
								<td className="col-center">{player.victoires}</td>
								<td className="col-center">{player.fini2e}</td>
								<td className="col-center">{player.presences}</td>
								<td className={player.gainParPresence > 0 ? "col-right gain-positive" : player.gainParPresence < 0 ? "col-right gain-negative" : "col-right"}>
									{player.gainParPresence > 0 ? `+${player.gainParPresence.toFixed(2)}` : player.gainParPresence.toFixed(2)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default LeaderboardResult;
