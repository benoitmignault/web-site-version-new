import { t } from "../i18n/i18n";

/**
 * Compte à rebours du minuteur.
 *
 * Version minimale temporaire : la logique complète (périodes 15/30,
 * arrêt, poursuivre, réinitialiser, alerte sonore) sera portée
 * de timer.js dans une prochaine étape.
 */
function Countdown() {
	return (
		<section>
			<h2>{t("countdown")}</h2>
			<p>30:00</p>
		</section>
	);
}

export default Countdown;
