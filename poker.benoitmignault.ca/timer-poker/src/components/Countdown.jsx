import { useEffect, useRef, useState } from "react";
import { ALERT_SOUND_URL } from "../config";
import { t } from "../i18n/i18n";

// Durée d'un niveau en secondes (pas d'option 15 minutes pour l'instant)
const DEFAULT_SECONDS = 30 * 60;

// Le red alert joue à partir de ce nombre de secondes avant la fin
const ALERT_SECONDS = 7;

/**
 * Compte à rebours du minuteur.
 *
 * Version minimale temporaire : la logique complète (périodes 15/30,
 * arrêt, poursuivre, réinitialiser, alerte sonore) sera portée
 * de timer.js dans une prochaine étape.
 */
function Countdown( { organizerId, level, setLevel } ) {

	// Le nombre de secondes restantes avant la fin du niveau
	const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);

	// Est-ce que le chrono est en cours ou arrêté ? (true = en cours, false = arrêté)
	const [isRunning, setIsRunning] = useState(true);

	// L'objet Audio du red alert : créé une seule fois, conservé entre les rendus
	const alertRef = useRef(null);






	// Fonction pour arrêter le chrono
	useEffect(() => {
		// Créer l'objet Audio au montage du composant
		alertRef.current = new Audio(ALERT_SOUND_URL);

		// Nettoyer au démontage : arrêter le son s'il joue encore
		return () => {
			alertRef.current?.pause();
			alertRef.current = null;
		};
	}, []);

	// Jouer le red alert (sans le redémarrer s'il joue déjà)
	const playAlert = () => {
		alertRef.current?.play().catch(() => {
			// Ignorer les erreurs de lecture (ex. lecture interrompue)
		});
	};



	return (
		<section>
			<div className={`countdown-display ${getTimeColor()}`}>
				<span>{formatTime(secondsLeft)}</span>
			</div>




			<button
				type="button" className="btn-stop"
				onClick={handleStop} disabled={!organizerId || !isRunning}		
			>
				{t("stop")}
			</button>
			<button
				type="button" className="btn-resume"
				onClick={handleResume} disabled={!organizerId || isRunning}
			>
				{t("resume")}
			</button>
			<button
				type="button" className="btn-reset"
				onClick={handleReset} disabled={!organizerId}
			>
				{t("reset")}
			</button>




		</section>
	);
}

export default Countdown;
