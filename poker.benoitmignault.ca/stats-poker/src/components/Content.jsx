import { useState } from "react";
import PlayersList from "./PlayersList.jsx";
import { t } from "../i18n/i18n";

/**
 * Contenu des statistiques de poker.
 *
 * Deux sections : en haut, la recherche et les choix (les 5 vues,
 * plus la précision quand la vue en demande une) ; en bas, le résultat.
 * Pour l'instant, les zones de précision et de résultat sont vides :
 * chaque vue viendra les remplir dans sa propre branche.
 */
function Content() {

	// La vue active parmi les 5 choix d'affichage (aucune au départ)
    const [activeView, setActiveView] = useState(null);

	// Les 5 vues : l'id sert d'état, la clé i18n sert d'étiquette
	const views = [
		{ id: "all", labelKey: "viewAll" },
		{ id: "player", labelKey: "viewPlayer" },
		{ id: "leaderboard", labelKey: "viewLeaderboard" },
		{ id: "tournament", labelKey: "viewTournament" },
		{ id: "killers-lemons", labelKey: "viewKillersLemons" }
	];

	return (
		<main className="content-container">
			<section className="choice-section">
				<h2>{t("choiceTitle")}</h2>
				<div className="view-choices">
					{views.map((view) => (
						<button
							key={view.id}
							type="button"
							aria-pressed={activeView === view.id}
							className={activeView === view.id ? "view-btn active" : "view-btn"}
							onClick={() => setActiveView(view.id)}
						>
							{t(view.labelKey)}
						</button>
					))}
				</div>
				{/* La précision de la vue active viendra ici (au besoin seulement) */}
			</section>
			{activeView !== null && (
                <section className="result-section">
                    <h2>{t("resultTitle")}</h2>
                    {/* Le résultat de la vue active viendra ici */}
                </section>
            )}
		</main>
	);
}

export default Content;
