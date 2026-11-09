import { useState } from "react";
import PlayersList from "./PlayersList.jsx";
import TournamentList from "./TournamentList.jsx";
import AllResults from "./results/AllResults.jsx";
import PlayerResult from "./results/PlayerResult.jsx";
import LeaderboardResult from "./results/LeaderboardResult.jsx";
import TournamentResult from "./results/TournamentResult.jsx";
import KillersLemonsResult from "./results/KillersLemonsResult.jsx";
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

    // Les vues sans précision produisent leur résultat dès le clic
    const viewsWithoutPrecision = ["all", "killers-lemons"];

    // Ce qui déclenche et nourrit le résultat (null = rien à montrer)
    const [activeResult, setActiveResult] = useState(null);

	// Les 5 vues : l'id sert d'état, la clé i18n sert d'étiquette
	const views = [
		{ id: "all", labelKey: "viewAll" },
		{ id: "player", labelKey: "viewPlayer" },
		{ id: "leaderboard", labelKey: "viewLeaderboard" },
		{ id: "tournament", labelKey: "viewTournament" },
		{ id: "killers-lemons", labelKey: "viewKillersLemons" }
	];    

    // Changer de vue : le résultat démarre tout seul pour les vues sans précision, 
    // et attend la précision pour les autres
    const handleViewChange = (viewId) => {
        setActiveView(viewId);
        setActiveResult(viewsWithoutPrecision.includes(viewId) ? viewId : null);
    };

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
							onClick={() => handleViewChange(view.id)}
						>
							{t(view.labelKey)}
						</button>
					))}
				</div>
				{/* La précision des vues nécessitant une précision viendra ici (au besoin seulement) */}
                {activeView === "player" && (
                    <div className="precision-zone">
                        <PlayersList setActiveResult={setActiveResult} />
                    </div>
                )}

			</section>
			{activeResult !== null && (
                <section className="result-section">
                    {activeView === "all" && <AllResults />}
                    {activeView === "player" && <PlayerResult playerId={activeResult} />}
                    {activeView === "leaderboard" && <LeaderboardResult minPresences={activeResult} />}
                    {activeView === "tournament" && <TournamentResult tournamentId={activeResult} />}
                    {activeView === "killers-lemons" && <KillersLemonsResult />}
                </section>
            )}
		</main>
	);
}

export default Content;
