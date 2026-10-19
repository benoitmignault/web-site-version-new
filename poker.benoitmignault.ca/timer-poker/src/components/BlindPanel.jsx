import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { t } from "../i18n/i18n";

/**
 * Panneau des mises (petite et grosse) pour le niveau courant.
 *
 * Va chercher les mises via l'API quand l'organisateur ou le niveau change.
 * Le bouton Changer passe au niveau suivant (désactivé au dernier niveau).
 * Le bouton de réinitialisation ramène au premier niveau (désactivé au niveau 1).
 * Tant qu'il n'y a pas de données, on affiche "--", comme un vrai tableau de bord.
 * En cas d'erreur, le message s'affiche sous les boutons, avec le panneau.
 *
 * @param {Object} props Les propriétés du composant.
 * @param {number|null} props.organizerId ID de l'organisateur sélectionné (null si aucun choisi).
 * @param {number} props.level Niveau de blindes courant (base 1).
 * @param {Function} props.setLevel Fonction pour mettre à jour le niveau de blindes.
 * @param {number|null} props.maxLevel Le nombre total de niveaux pour l'organisateur (null si inconnu).
 * @param {Function} props.setMaxLevel Fonction pour mettre à jour le nombre total de niveaux.
 */
function BlindPanel({ organizerId, level, setLevel, maxLevel, setMaxLevel }) {

	// Les mises reçues de l'API (null = pas encore de données)
	const [small, setSmall] = useState(null);
	const [big, setBig] = useState(null);

	// Le message d'erreur à afficher si le chargement échoue
	const [error, setError] = useState("");

	// fonction pour charger les blinds de l'organisateur sélectionné pour le niveau courant
	const loadBlinds = async () => {

		// Rien à charger tant qu'aucun organisateur n'est choisi
		// On doit attendre que l'organizerId soit défini avant de faire l'appel API, car sinon, on va utiliser la version sans id
		if (!organizerId) {
			return;
		}

		try {
			// On va chercher les jetons de l'organisateur sélectionné via l'API
			// mais en mode asynchrone pour pouvoir attendre la réponse avant de mettre à jour l'état      
			const response = await fetch(`${API_BASE_URL}/blinds.php?id=${organizerId}&level=${level}`);

			// On attend la réponse et on la convertit en JSON
			const data = await response.json();

			// Vérification de la réponse de l'API pour voir si la récupération des détails du joueur a réussi
			if (data.success) {

				// Mettre à jour les informations des blinds en cours
				setSmall(data.small);
				setBig(data.big);
				setMaxLevel(data.maxLevel);
				setError("");
			} else {

				// Erreur retournée par l'API lors du chargement des blinds
				setError(data.message);
			}

		} catch (err) {

			// En cas d'erreur, on affiche le message d'erreur dans la console et on met à jour l'état
			console.error(err);
			setError("Une erreur est survenue lors du chargement des blinds.");
		}

		// Pas d'indicateur de chargement ici : on affiche les mises
		// (ou "--" s'il n'y en a pas), ou un message d'erreur s'il y en a un
	};

	// Si on utilise le bouton "Passer au niveau suivant", on incrémente le niveau de 1 et 
	// on récupère les blinds pour le niveau suivant. On ne peut pas dépasser le nombre de niveaux maximum pour l'organisateur.
	const handleChange = () => {
		setLevel((prev) => prev + 1);
	};

	// Revenir au premier niveau (en cas d'erreur ou pour recommencer)
	const handleReset = () => {
		setLevel(1);
	};

	// On charge la combinaison où on est rendu au niveau courant de l'organisateur sélectionné au montage du composant
	// et à chaque fois que l'organizerId ou le level change
	useEffect(() => {

        const initializeData = async () => {

            // On charge les blinds de l'organisateur sélectionné pour le niveau courant
			// Au moment de l'appel de cette fonction, organizerId est déjà défini, donc on peut appeler loadChips directement
            await loadBlinds();
        };

        initializeData();		
		// On relance le useEffect à chaque fois que l'organizerId change
    }, [organizerId, level]);	

	return (
		<section className="blind-panel">			
			<div className="blind-values">
				<div className="blind">					
					<span className="blind-label">{t("smallBlind")}</span>
					<span>{small === null ? "--" : small}</span>
				</div>
				<div className="blind">					
					<span className="blind-label">{t("bigBlind")}</span>
					<span>{big === null ? "--" : big}</span>
				</div>
				<button
					type="button" className="change-button"
					onClick={handleChange} disabled={!organizerId || (maxLevel !== null && level >= maxLevel)}			
				>
					{t("change")}
				</button>
				<button
					type="button" className="btn-reset"
					onClick={handleReset} disabled={!organizerId || level <= 1}
				>
					{t("reset")}
				</button>
			</div>
			{/* Erreur affichée avec le panneau, pas à la place : on garde les contrôles */}
			{error && <p className="error">{error}</p>}
		</section>
	);
}

export default BlindPanel;
