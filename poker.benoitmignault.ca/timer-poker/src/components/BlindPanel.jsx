import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { t } from "../i18n/i18n";

function BlindPanel({ organizerId, level }) {

	// La paire de mises pour le niveau courant
	const [blinds, setBlinds] = useState(null);

	useEffect(() => {
		// Rien à charger tant qu'aucun organisateur n'est choisi
		if (!organizerId) {
			return;
		}
		fetch(`${API_BASE_URL}/blinds.php?id=${organizerId}&level=${level}`)
			.then((response) => response.json())
			.then((data) => setBlinds(data))
			.catch(() => setBlinds(null));
	}, [organizerId, level]);

	// Si on n'a pas d'organisateur sélectionné, on ne peut pas afficher les blinds, 
	// mais on va afficher -- dans chaque case et non un message erreur
	if (!organizerId) {
		return (
			<section className="blind-panel">
				<h2>{t("blinds")}</h2>
				<p className="level">
					{t("level")} {level}
				</p>
				<div className="blind-values">
					<div className="blind">						
						<span className="blind-label">{t("smallBlind")}</span>
						<span className="blind-amount">--</span>
					</div>
					<div className="blind">						
						<span className="blind-label">{t("bigBlind")}</span>
						<span className="blind-amount">--</span>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="blind-panel">
			<h2>{t("blinds")}</h2>
			<p className="level">
				{t("level")} {level}
				{blinds.maxLevel ? ` / ${blinds.maxLevel}` : ""}
			</p>
			<div className="blind-values">
				<div className="blind">					
					<span className="blind-label">{t("smallBlind")}</span>
					<span className="blind-amount">{blinds.smallBlind}</span>
				</div>
				<div className="blind">					
					<span className="blind-label">{t("bigBlind")}</span>
					<span className="blind-amount">{blinds.bigBlind}</span>
				</div>
			</div>
		</section>
	);
}

export default BlindPanel;
