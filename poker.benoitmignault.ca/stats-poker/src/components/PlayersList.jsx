import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Select from "react-select";
import { t } from "../i18n/i18n";

/**
 * Liste déroulante des joueurs.
 *
 * Va chercher la liste via l'API au montage (players.php). Quand
 * l'utilisateur en choisit un, stocke son id dans Content, qui
 * affichera sa carte dans la section Résultat.
 *
 * @param {Object} props Les propriétés du composant.
 * @param {Function} props.setActiveResult Fonction pour stocker l'id du joueur choisi dans Content.
 */
function PlayersList({ setActiveResult }) {

	// La liste des joueurs reçue de l'API
	const [players, setPlayers] = useState([]);

	// L'option sélectionnée (objet { value, label }), pas juste l'id
	const [selectedOption, setSelectedOption] = useState(null);

	// L'erreur à afficher : { code, message } — le code est traduit au rendu, donc suit la langue
	const [error, setError] = useState(null);

	// Préparer les options pour le sélecteur react-select :
	// on transforme la liste des joueurs en tableau d'objets {value, label}
	const playerOptions = players.map((player) => ({
		value: player.id,
		label: player.nom,
	}));

	// Fonction pour charger la liste des joueurs pour en sélectionner un
	const loadPlayers = async () => {

		try {
			const response = await fetch(`${API_BASE_URL}/players.php`);

			const data = await response.json();
			if (data.success) {

				// Mettre à jour la liste des joueurs pour l'afficher dans le sélecteur
				// Le format de la réponse est : {success: true, players: [{id, nom}]}
				setPlayers(data.players);
				setError(null);
			} else {

				// Erreur retournée par l'API lors du chargement des joueurs
				setError({ code: data.code, message: data.message });
			}			
		} catch (err) {
			console.error(err);
			setError({ code: "errorLoadingPlayers", message: "" });
		}
	};

	// Fonction pour gérer le changement de sélection dans la liste déroulante
	const handleChange = (option) => {

		setSelectedOption(option);

		if (option) {
            setActiveResult(option.value);   // option.value = 3, l'id du joueur remonte
        } else {
            setActiveResult(null);           // le X
        }
	};

	// On charge la liste des joueurs au montage du composant
	useEffect(() => {
		loadPlayers();
	}, []);

	// Si le chargement a échoué, on affiche l'erreur au lieu de la liste déroulante
	if (error) {
		return <p className="error-message">{error.code ? t(error.code) : error.message}</p>;
	}

	return (
		<div className="player-field">
			<span className="player-label">{t("playerLabel")}</span>
			<div className="player-select-wrapper">
				<Select
					classNamePrefix="player-select"
					options={playerOptions}
					value={selectedOption}
					onChange={handleChange}
					placeholder={t("choosePlayer")}
					isClearable
					aria-label={t("playerLabel")}
				/>
			</div>
		</div>
	);
}

export default PlayersList;
