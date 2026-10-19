/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
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

	// État pour stocker les messages d'erreur en prévision de l'ajout d'un joueur à un événement
    const [error, setError] = useState("");

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
	const handleChange = (event) => {

		// On retrouve l'organisateur choisi dans la liste (la valeur du select est une chaîne, l'id un nombre)
		const selected = organizers.find(
			(organizer) => String(organizer.id) === event.target.value
		);

		if (!selected) {
			return;
		}

		// On stocke son id et son prénom dans Index...
		setOrganizerId(selected.id);
		setOrganizerName(selected.name);
		// ...et on repart au niveau 1
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
		<label>
			{t("organizer")}
			<select onChange={handleChange} defaultValue="">
				<option value="">{t("chooseOrganizer")}</option>
				{organizers.map((organizer) => (
					<option key={organizer.id} value={organizer.id}>
						{organizer.name}
					</option>
				))}
			</select>
		</label>
	);
}

export default OrganizerList;
