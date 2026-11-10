import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../../config";
import { FaTrophy } from "react-icons/fa";
import { ordinalInSuperscript, ordinalSuffix, t } from "../../i18n/i18n";

/**
 * Résultat de la vue Tournois.
 *
 * Au montage et à chaque changement de tournoi, appelle tournament.php,
 * qui retourne les participants d'un tournoi, triés par gain décroissant,
 * les killers départageant les égalités (un perdant avec des killers est
 * moins perdant), le prix citron fermant sa classe de gain, puis le nom.
 * Le tri est fixe : aucun tri interactif dans cette vue.
 * Le garde anti-réponse-périmée est le même que dans PlayerResult :
 * si le tournoi change vite deux fois, seule la réponse du dernier
 * choix a le droit de mettre à jour l'écran.
 */
function TournamentResult({ tournamentId }) {

	// Le tournoi reçu de l'API (numéro, date, participants)
	const [tournament, setTournament] = useState(null);

	// L'erreur à afficher : { code, message } — le code est traduit au rendu, donc suit la langue
	const [error, setError] = useState(null);

	// Compteur d'appels : seule la réponse du dernier appel a le droit de mettre à jour l'état
	const requestCount = useRef(0);

	// Fonction pour charger le tournoi et ses participants
	const loadTournament = async () => {

		// Le numéro de cet appel : si un appel plus récent survient, la réponse de celui-ci sera ignorée
		const requestId = ++requestCount.current;

		try {
			const response = await fetch(`${API_BASE_URL}/tournament.php?id_tournoi=${tournamentId}`);

			const data = await response.json();

			// Réponse périmée : un autre tournoi a été choisi entre-temps, on ignore cette réponse
			if (requestId !== requestCount.current) {
				return;
			}

			if (data.success) {

				// Le format de la réponse est : {success: true, tournament: {id, date, players: [...]}}
				setTournament(data.tournament);
				setError(null);
			} else {

				// Erreur retournée par l'API lors du chargement du tournoi
				setTournament(null);
				setError({ code: data.code, message: data.message });
			}
		} catch (err) {

			// Erreur périmée, même principe : un appel plus récent a pris le relais
			if (requestId !== requestCount.current) {
				return;
			}

			console.error(err);
			setTournament(null);
			setError({ code: "errorLoadingTournament", message: "" });
		}
	};

	// On charge le tournoi au montage et à chaque changement d'id
	useEffect(() => {

		// On vide le tournoi courant : pendant le chargement du nouveau, c'est le message d'attente qui s'affiche, pas l'ancien tableau
		setError(null); // On vide l'erreur courante : si le nouveau tournoi n'existe pas, on affichera l'erreur de l'API, pas celle du tournoi précédent
		setTournament(null);
		loadTournament();
	}, [tournamentId]);

	// Si le chargement a échoué, on affiche l'erreur au lieu du résultat
	if (error) {
		return <p className="error-message">{error.code ? t(error.code) : error.message}</p>;
	}

	// Pendant le chargement, on affiche un message d'attente
	if (!tournament) {
		return <p className="loading-message">{t("loading")}</p>;
	}

	// Le suffixe ordinal du tournoi : en exposant en français, sur la ligne en anglais
	const suffix = ordinalSuffix(tournament.id);
	const tournamentSuffix = ordinalInSuperscript() ? <sup>{suffix}</sup> : suffix;

	return (
		<div className="tournament-result">
			<h2 className="result-subtitle">{t("resultTournament")}</h2>
			<h3 className="tournament-summary-title">{tournament.id}{tournamentSuffix} - {tournament.date}</h3>
			<div className="history-table-wrapper">
				<table className="history-table">
					<thead>
						<tr>
							<th>{t("playerLabel")}</th>
							<th className="col-right">{t("gain")}</th>
							<th className="col-center">{t("killer")}</th>
							<th className="col-center">{t("lemon")}</th>
							<th className="col-center">{t("result")}</th>
						</tr>
					</thead>
					<tbody>
						{tournament.players.map((row) => (
							<tr key={row.id}>
								<td>{row.nom}</td>
								<td className={`col-right ${row.gain > 0 ? "gain-positive" : row.gain < 0 ? "gain-negative" : ""}`}>
									{row.gain > 0 ? "+" : ""}{row.gain} $
								</td>
								<td className="col-center">{row.killer}</td>
								<td className="col-center">{row.prixCitron}</td>
								<td className="col-center">
									{row.victoire === 1 && (
										<span className="place-badge">
											<FaTrophy className="trophy gold" />
										</span>
									)}
									{row.fini2e === 1 && (
										<span className="place-badge">
											<FaTrophy className="trophy silver" />
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

export default TournamentResult;
