import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../../config";
import { FaTrophy, FaSkullCrossbones, FaLemon } from "react-icons/fa";
import { t } from "../../i18n/i18n";

/**
 * Résultat de la vue Joueur.
 *
 * Au montage et à chaque changement de joueur, appelle player.php,
 * qui retourne en une seule réponse le joueur, son sommaire et
 * son historique (les 3 requêtes SQL vivent côté serveur).
 * Le retour compte deux sections distinctes : le sommaire,
 * puis le détaillé.
 *
 * @param {Object} props Les propriétés du composant.
 * @param {number} props.playerId L'id du joueur choisi dans le sélecteur.
 */
function PlayerResult({ playerId }) {

	// Les données du joueur reçues de l'API (sommaire + historique)
	const [player, setPlayer] = useState(null);

	// L'erreur à afficher : { code, message } — le code est traduit au rendu, donc suit la langue
	const [error, setError] = useState(null);

	/**
	 * @description
	 * Le problème du joueur choisi : les réponses de l'API peuvent arriver dans le désordre.
	 * Exemple : 
	 * Tu choisis Benoît dans la liste. L'appel #1 part chercher sa fiche — et elle est lourde : 215 visites à rapatrier. 
	 * Une fraction de seconde plus tard, tu changes d'idée et tu choisis Carl : l'appel #2 part, mais sa fiche est minuscule, 13 visites. 
	 * 
	 * Le piège : le réseau garantit l'ordre d'envoi, jamais l'ordre de retour. La petite réponse de Carl revient en premier → Carl s'affiche, 
	 * tout est beau. Puis la grosse réponse de Benoît finit d'arriver... et comme rien ne la vérifie, elle écrase l'écran : le sélecteur dit « Carl », 
	 * la carte affiche Benoît. L'écran a « sauté » tout seul, sans que tu touches à rien. 
	 * 
	 * Sur ton localhost, les réponses prennent quelques millisecondes — le risque est mince. 
	 * En production, avec un vrai serveur et une vraie connexion, un gros joueur suivi d'un petit, c'est tout à fait plausible. 
	 * Le correctif, c'est le principe du ticket de vestiaire : chaque appel reçoit un numéro (1, 2, 3...). Quand une réponse revient, 
	 * elle présente son ticket — si ce n'est plus le dernier numéro émis, son ticket est périmé et elle est ignorée en silence. 
	 * Seule la réponse du choix le plus récent a le droit d'écrire sur l'écran.
	*/
	
	// Compteur d'appels : seule la réponse du dernier appel a le droit de mettre à jour l'état
	const requestCount = useRef(0);

	// Fonction pour charger le joueur, son sommaire et son historique
	const loadPlayer = async () => {

		// Le numéro de cet appel : si un appel plus récent survient, la réponse de celui-ci sera ignorée
		const requestId = ++requestCount.current;

		try {
			const response = await fetch(`${API_BASE_URL}/player.php?id_joueur=${playerId}`);

			const data = await response.json();

			// Réponse périmée : un autre joueur a été choisi entre-temps, on ignore cette réponse
			if (requestId !== requestCount.current) {
				return;
			}

			if (data.success) {

				// Une seule mise à jour : le sommaire et le détaillé
				// arrivent ensemble, jamais l'un sans l'autre
				// Le format de la réponse est : {success: true, player: {id, nom, summary, history}}
				setPlayer(data.player);
				setError(null);
			} else {

				// Erreur retournée par l'API lors du chargement du joueur
				setPlayer(null);
				setError({ code: data.code, message: data.message });
			}
		} catch (err) {
			if (requestId !== requestCount.current) {
				return;
			}

			console.error(err);
			setPlayer(null);
			setError({ code: "errorLoadingPlayer", message: "" });
		}
	};

	// On charge le joueur au montage et à chaque changement d'id
	useEffect(() => {

		// On vide le joueur courant : pendant le chargement du nouveau,
		// c'est le message d'attente qui s'affiche, pas l'ancienne carte
		setPlayer(null);
		loadPlayer();
	}, [playerId]);

	// Si le chargement a échoué, on affiche l'erreur au lieu du résultat
	if (error) {
		return <p className="error-message">{error.code ? t(error.code) : error.message}</p>;
	}

	// Pendant le chargement, on affiche un message d'attente
	if (!player) {
		return <p className="loading-message">{t("loading")}</p>;
	}

	return (
		<div className="player-result">		
			<h2>{t("resultSummary")}</h2>			
			<div className="player-summary">
				<h3 className="player-summary-title">{player.nom}</h3>
				<div className="player-stats-grid">
					<div className="player-stat-card">
						<span className="stat-icon-spacer"></span>
						<span className="player-stat-label">{t("presences")}</span>
						<span className="player-stat-value">{player.summary.presences}</span>
					</div>
					<div className="player-stat-card">
						<span className="stat-icon-spacer"></span>
						<span className="player-stat-label">{t("netGain")}</span>
						<span className={`player-stat-value ${player.summary.gainNet > 0 ? "gain-positive" : player.summary.gainNet < 0 ? "gain-negative" : ""}`}>
							{player.summary.gainNet > 0 ? "+" : ""}{player.summary.gainNet} $
						</span>
					</div>
					<div className="player-stat-card player-trophies-card">
						<div className="player-trophy-card">
							<FaTrophy className="trophy gold" />
							<span className="player-trophy-label">{t("wins")}</span>
							<span className="player-trophy-count">{player.summary.victoires}</span>							
						</div>
						<div className="player-trophy-card">
							<FaTrophy className="trophy silver" />
							<span className="player-trophy-label">{t("secondPlaces")}</span>
							<span className="player-trophy-count">{player.summary.deuxiemes}</span>							
						</div>
					</div>
					<div className="player-stat-card">
						<FaSkullCrossbones className="stat-icon killer-icon" />
						<span className="player-stat-label">{t("killers")}</span>
						<span className="player-stat-value">{player.summary.killers}</span>
					</div>
					<div className="player-stat-card">
						<FaLemon className="stat-icon lemon-icon" />
						<span className="player-stat-label">{t("lemons")}</span>
						<span className="player-stat-value">{player.summary.prixCitrons}</span>
					</div>
				</div>
			</div>
			<h3 className="result-subtitle">{t("resultDetail")}</h3>
			<p className="table-scroll-hint playerresult">{t("tableScrollHint")}</p>
			<div className="history-table-wrapper">
				<table className="history-table history-table-playerresult">			
					<thead>
						<tr>
							<th className="col-center">{t("tournament")}</th>
							<th className="col-center">{t("date")}</th>
							<th className="col-right">{t("gain")}</th>
							<th className="col-center">{t("killer")}</th>
							<th className="col-center">{t("lemon")}</th>
							<th className="col-center">{t("result")}</th>
						</tr>
					</thead>
					<tbody>
						{player.history.map((visit) => (
							<tr key={visit.idTournoi}>
								<td className="col-center">{visit.idTournoi}</td>
								<td className="col-center">{visit.date}</td>
								<td className={`col-right ${visit.gain > 0 ? "gain-positive" : visit.gain < 0 ? "gain-negative" : ""}`}>
									{visit.gain > 0 ? "+" : ""}{visit.gain} $
								</td>
								<td className="col-center">{visit.killer}</td>
								<td className="col-center">{visit.prixCitron}</td>
								<td className="col-center">
									{visit.victoire === 1 && (
										<span className="place-badge">
											<FaTrophy className="trophy gold" aria-hidden="true" /> {t("win")}
										</span>
									)}
									{visit.fini2e === 1 && (
										<span className="place-badge">
											<FaTrophy className="trophy silver" aria-hidden="true" /> {t("secondPlace")}
										</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
export default PlayerResult;
