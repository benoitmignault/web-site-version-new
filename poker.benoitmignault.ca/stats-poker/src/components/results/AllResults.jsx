import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
import { FaTrophy } from "react-icons/fa";
import { t } from "../../i18n/i18n";

/**
 * Résultat de la vue Tout afficher.
 *
 * Au montage, appelle results.php, qui retourne toutes les présences de tous les tournois, du plus récent au plus ancien. 
 * Dans chaque tournoi, le tri est : gain décroissant, les killers départagent les égalités et 
 * le prix citron à la fin sert de départage ultime (un perdant avec des killers est moins perdant), puis le nom.
 */
function AllResults() {

	// Tous les résultats reçus de l'API
	const [results, setResults] = useState(null);

	// L'erreur à afficher : { code, message } — le code est traduit au rendu, donc suit la langue
	const [error, setError] = useState(null);

	// Fonction pour charger tous les résultats
	const loadResults = async () => {

		try {
			const response = await fetch(`${API_BASE_URL}/results.php`);

			const data = await response.json();
			if (data.success) {

				// Le format de la réponse est : {success: true, results: [...]}
				setResults(data.results);
				setError(null);
			} else {

				// Erreur retournée par l'API lors du chargement des résultats
				setResults(null);
				setError({ code: data.code, message: data.message });
			}
		} catch (err) {
			console.error(err);
			setResults(null);
			setError({ code: "errorLoadingResults", message: "" });
		}
	};

	// On charge tous les résultats au montage du composant
	useEffect(() => {
		loadResults();
	}, []);

	// Si le chargement a échoué, on affiche l'erreur au lieu du résultat
	if (error) {
		return <p className="error-message">{error.code ? t(error.code) : error.message}</p>;
	}

	// Pendant le chargement, on affiche un message d'attente
	if (!results) {
		return <p className="loading-message">{t("loading")}</p>;
	}

	return (
		<div className="all-results">
			<h2>{t("resultAll")}</h2>
			<p className="table-scroll-hint">{t("tableScrollHint")}</p>
			<div className="history-table-wrapper">
				<table className="history-table">
					<thead>
						<tr>
							<th>{t("playerLabel")}</th>
							<th className="col-center">{t("tournament")}</th>
							<th className="col-center">{t("date")}</th>
							<th className="col-right">{t("gain")}</th>
							<th className="col-center">{t("killer")}</th>
							<th className="col-center">{t("lemon")}</th>
							<th className="col-center">{t("result")}</th>
						</tr>
					</thead>
					<tbody>
						{results.map((row, index) => (
							<tr key={row.id} className={index > 0 && row.idTournoi !== results[index - 1].idTournoi ? "tournament-start" : ""}>
								<td>{row.nom}</td>
								<td className="col-center">{row.idTournoi}</td>
								<td className="col-center">{row.date}</td>
								<td className={`col-right ${row.gain > 0 ? "gain-positive" : row.gain < 0 ? "gain-negative" : ""}`}>
									{row.gain > 0 ? "+" : ""}{row.gain} $
								</td>
								<td className="col-center">{row.killer}</td>
								<td className="col-center">{row.prixCitron}</td>
								<td className="col-center">
									{row.victoire === 1 && (
										<span className="place-badge">
											<FaTrophy className="trophy gold" aria-hidden="true" /> {t("win")}
										</span>
									)}
									{row.fini2e === 1 && (
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

export default AllResults;
