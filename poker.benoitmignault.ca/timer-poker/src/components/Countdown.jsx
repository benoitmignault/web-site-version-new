import { t } from "../i18n/i18n";

/**
 * Compte à rebours du minuteur.
 *
 * Version minimale temporaire : la logique complète (périodes 15/30,
 * arrêt, poursuivre, réinitialiser, alerte sonore) sera portée
 * de timer.js dans une prochaine étape.
 */
function Countdown( { organizerId, level, setLevel } ) {



	








	return (
		<section>
			<p>30:00</p>



			<button
				type="button" className="change-button"
				onClick={handleStop} disabled={!organizerId || (maxLevel !== null && level >= maxLevel)}			
			>
				{t("stop")}
			</button>
			<button
				type="button" className="btn-resume"
				onClick={handleResume} disabled={!organizerId || level <= 1}
			>
				{t("resume")}
			</button>
			<button
				type="button" className="btn-reset"
				onClick={handleReset} disabled={!organizerId || level <= 1}
			>
				{t("reset")}
			</button>




		</section>
	);
}

export default Countdown;
