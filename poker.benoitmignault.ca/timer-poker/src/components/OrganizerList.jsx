import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Select from "react-select";
import { shouldExcludeStats } from "../utils/logging";
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

	// L'erreur à afficher : { code, message } — le code est traduit au rendu, donc suit la langue
	// La traduction du code d'erreur est faite dans le rendu, car la langue peut changer après le chargement des données
	// Utiliser un objet plutôt qu'une chaîne permet de changer de langue
	const [error, setError] = useState(null);

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
				setError(null);
			} else {

				// Erreur retournée par l'API lors du chargement des organisateurs
				setError({ code: data.code, message: data.message });
			}
		} catch (err) {
			console.error(err);
			setError({ code: "errorLoadingOrganizers", message: "" });
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
			
			// On logge le choix de l'organisateur pour les stats, mais seulement 
			// si l'utilisateur n'a pas choisi d'exclure ses stats avant d'arriver sur la page
			fetch(`${API_BASE_URL}/log-timer.php`,
				{ 
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({
						action_type: "organizer_load",
						action_name: "Affichage organisateur",
						organizer_id: option.value,
						// Vérifier si la variable locale "exclude_stats" est défini dans le navigateur
						exclude_stats: shouldExcludeStats()
					})
				}
			);

		} else {
			// Le X : on réinitialise tout
			// Il ne pas nécessaire de remettre à null setError car on ne fait pas d'appel API ici, donc pas d'erreur à réinitialiser
			setOrganizerId(null);
			setOrganizerName("");
		}

		setLevel(1);
	};

	// On charge la liste des organisateurs au montage du composant
	useEffect(() => {

        loadOrganizers();
	}, []);

	// Si le chargement a échoué, on affiche l'erreur au lieu de la liste déroulante via le code récupéré de l'object error
	if (error) {
		return <p className="error-message">{error.code ? t(error.code) : error.message}</p>;
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
