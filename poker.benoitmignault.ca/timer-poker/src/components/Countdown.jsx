/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { ALERT_SOUND_URL } from "../config";
import { t } from "../i18n/i18n";

// Durée d'un niveau en secondes (pas d'option 15 minutes pour l'instant)
const DEFAULT_SECONDS = 30 * 60; // 30 minutes

// Le red alert joue à partir de ce nombre de secondes avant la fin
const ALERT_SECONDS = 7;

// Pause sur 00:00 (en secondes) avant d'avancer automatiquement au niveau suivant
const LEVEL_END_PAUSE_SECONDS = 3;

/**
 * Compte à rebours du niveau de blinds courant.
 *
 * Affiche le temps restant (30:00 par défaut), avec une bordure de couleur
 * selon le temps restant (vert ≥ 15 min, orange 5–15 min, rouge < 5 min).
 * Le red alert sonore joue pendant les 7 dernières secondes et l'encadré FLASH en rouge.
 *
 * Contrôles : Arrêt (pause), Poursuivre (démarre/reprend), Réinitialiser (30:00, arrêté).
 * À 00:00, le chrono s'arrête et avance automatiquement au prochain niveau
 * si un organisateur est choisi.
 *
 * Le chrono se réinitialise à 30:00 (arrêté) quand l'organisateur ou le niveau change.
 *
 * @param {Object} props Les propriétés du composant.
 * @param {number|null} props.organizerId ID de l'organisateur sélectionné (null si aucun choisi).
 * @param {number} props.level Niveau de blinds courant (base 1).
 * @param {Function} props.setLevel Fonction pour mettre à jour le niveau de blindes.
 */
function Countdown( { organizerId, level, setLevel } ) {

	// Le nombre de secondes restantes avant la fin du niveau
	const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);

	// Est-ce que le chrono est en cours ou arrêté ? (true = en cours, false = arrêté)
	const [isRunning, setIsRunning] = useState(false);

	// Pause de fin de niveau en cours : 3 secondes sur 00:00 avant l'avance auto
	const [isLevelEnd, setIsLevelEnd] = useState(false);

	// L'objet Audio du red alert : créé une seule fois, conservé entre les rendus
	const alertRef = useRef(null);

	// L'encadré clignote en rouge pendant l'alerte (7 dernières secondes)
	// À chaque changement de secondsLeft, on vérifie si on est dans la période d'alerte
	const isAlerting = secondsLeft <= ALERT_SECONDS && secondsLeft > 0 || isLevelEnd;

	// Couleur de la bordure du chrono selon le temps restant
	const getTimeColor = () => {

		const minutesLeft = secondsLeft / 60;

		if (minutesLeft >= 15) {
			return "green";
		}

		if (minutesLeft >= 5) {
			return "orange";
		}

		return "red";
	};

	// Formate un nombre de secondes en "MM:SS" (ex. 90 -> "01:30")
	const formatTime = (totalSeconds) => {
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		const paddedMinutes = String(minutes).padStart(2, "0");
		const paddedSeconds = String(seconds).padStart(2, "0");

		return `${paddedMinutes}:${paddedSeconds}`;
	};

	// Fonction pour arrêter le chrono
	const handleStop = () => {

		setIsRunning(false);
	};

	// Fonction pour reprendre le chrono
	const handleResume = () => {

		setIsRunning(true);
	};

	// Fonction pour réinitialiser le chrono
	const handleReset = () => {

		setIsLevelEnd(false);
		setIsRunning(false);		
		setSecondsLeft(DEFAULT_SECONDS);
	};

	// Cette fonction permet de jouer le red alert (sans le redémarrer s'il joue déjà) et sera caller à moins de 7 secondes 
	const playAlert = () => {
		alertRef.current?.play().catch(() => {
			console.error("Erreur lecture audio :", err);
		});
	};

	// Créer l'objet Audio au montage du composant et le nettoyer au démontage
	useEffect(() => {
		
		// Créer l'objet Audio au montage du composant
		alertRef.current = new Audio(ALERT_SOUND_URL);

		// Nettoyer au démontage : arrêter le son s'il joue encore
		return () => {
			alertRef.current?.pause();
			alertRef.current = null;
		};
	}, []);

	// Remettre le countdown à 30:00 (arrêté) quand l'organisateur ou le niveau change
	useEffect(() => {

		setSecondsLeft(DEFAULT_SECONDS);
		setIsRunning(false);
	}, [organizerId, level]);

	// Faire couler le temps quand le chrono est en marche
	useEffect(() => {

		// À chaque seconde, on décrémente le nombre de secondes restantes si le chrono est en marche.
		// Comme la constante «secondsLeft» fait partie de ce useEffect, donc à chaque changement état, on relance ce useEffect.

		// En pause : rien à faire
		if (!isRunning) {
			return;
		}

		// 00:00 : on arrête le chrono et on avance au prochain niveau
		// si un organisateur est choisi ; la remise à 30:00 se fait
		// ensuite via l'effet sur [organizerId, level]
		if (secondsLeft <= 0) {

			setIsRunning(false);

			if (organizerId) {
				setLevel((prev) => prev + 1);
			}
			return;
		}

		// Sinon, on décrémente dans une seconde
		const timer = setTimeout(() => {
			const next = secondsLeft - 1;

			// Red alert à partir des 7 dernières secondes
			if (next <= ALERT_SECONDS && next > 0) {

				// Jouer le son d'alerte (sans le redémarrer s'il joue déjà)
				playAlert();
			}

			setSecondsLeft(next);
		}, 1000);

		// Nettoyer le timeout si l'effet est relancé ou le composant démonté
		return () => clearTimeout(timer);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRunning, secondsLeft]);

	return (
		<section>
			<div className={`countdown-display ${getTimeColor()}${isAlerting ? " flashing" : ""}`}>
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
