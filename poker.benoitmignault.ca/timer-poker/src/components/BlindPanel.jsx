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

	if (!organizerId) {
		return <p>{t("errorNoOrganizer")}</p>;
	}

	if (!blinds) {
		return <p>{t("loading")}</p>;
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
					<span className="blind-amount">{blinds.smallBlind}</span>
					<span className="blind-label">{t("smallBlind")}</span>
				</div>
				<div className="blind">
					<span className="blind-amount">{blinds.bigBlind}</span>
					<span className="blind-label">{t("bigBlind")}</span>
				</div>
			</div>
		</section>
	);
}

export default BlindPanel;
