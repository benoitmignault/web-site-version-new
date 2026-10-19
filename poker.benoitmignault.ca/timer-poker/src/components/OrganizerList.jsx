/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Select from "react-select";
import { t } from "../i18n/i18n";

/**
 * Liste déroulante des organisateurs.
 *
 * Va chercher la liste via l'API au montage. Quand l'utilisateur en choisit un, stocke son id et son prénom dans Index et remet le
 * niveau des blinds à 1.
 *
 * @param {Object} props Les propriétés du composant.
 * @param {Function} props.setOrganizerName Fonction pour stocker le prénom de l'organisateur dans Index.
 * @param {Function} props.setOrganizerId Fonction pour stocker l'id de l'organisateur dans Index.
 * @param {Function} props.setLevel Fonction pour mettre à jour le niveau de blindes dans Index.
 */
function OrganizerList({ setOrganizerName, setOrganizerId, setLevel }) {

	// La liste des organisateurs reçue de l'API
	const [organizers, setOrganizers] = useState([]);

	// L'option sélectionnée (objet { value, label }), pas juste l'id
	const [selectedOption, setSelectedOption] = useState(null);

	// État pour stocker les messages d'erreur en prévision de l'ajout d'un joueur à un événement
    const [error, setError] = useState("");

	// Préparer les options pour le sélecteur react-select : 
	// on transforme la liste des organisateurs en tableau d'objets {value, label}
	const organizerOptions = organizers.map((organizer) => ({
		value: organizer.id,
		label: organizer.name,
	}));

	// Fonction pour charger la liste des organisateurs pour en sélectionner un
	const loadOrganizers = async () => {

		try {
			const response = await fetch(`${API_BASE_URL}/organizers.php`);

			const data = await response.json();
			if (data.success) {

				// Mettre à jour la liste des organisateurs pour l'afficher dans le sélecteur
				// Le format de la réponse est : {success: true, organizers: [{id, name}]}
				setOrganizers(data.organizers);
				setError("");
			} else {

				// Erreur retournée par l'API lors du chargement des organisateurs
				setError(data.message);
			}
		} catch (err) {
			console.error(err);
			setError("Une erreur est survenue lors du chargement des organisateurs.");
		}

		// Il n'y a pas de finally avec le setLoading car on fait juste afficher
		// la liste des organisateurs, et on peut afficher un message d'erreur
		// s'il y en a un, mais on n'a pas besoin d'afficher un indicateur de chargement
	};

	// Fonction pour gérer le changement de sélection dans la liste déroulante
	const handleChange = (option) => {
		
		setSelectedOption(option);

		if (option) {
			setOrganizerId(option.value);
			setOrganizerName(option.label);
		} else {
			// Le X : on réinitialise tout
			setOrganizerId(null);
			setOrganizerName("");
		}

		setLevel(1);
	};

	useEffect(() => {

		loadOrganizers();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Si le chargement a échoué, on affiche l'erreur au lieu du sélecteur
	if (error) {
		return <p className="error">{error}</p>;
	}
	
	return (
		<div className="organizer-field">
			<span className="organizer-label">{t("organizer")}</span>
			<div className="organizer-select-wrapper">
				<Select
					classNamePrefix="organizer-select"
					options={organizerOptions}
					value={selectedOption}
					onChange={handleChange}
					placeholder={t("chooseOrganizer")}
					isSearchable={false}
					isClearable
					aria-label={t("organizer")}
				/>
			</div>
		</div>		
	);
}

export default OrganizerList;
