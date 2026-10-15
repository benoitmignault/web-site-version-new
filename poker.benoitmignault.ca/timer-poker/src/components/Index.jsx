import { useEffect, useState } from "react";
import Header from "./Header";
import { API_BASE_URL } from "../config";
import { t } from "../i18n/i18n";
import '../css/index.css';

function Index() {

	// États globaux de l'application
	const [organisateurs, setOrganisateurs] = useState([]);
	const [organisateur, setOrganisateur] = useState("");

	// Changer le titre de la page et le favicon lorsque le composant est monté
	useEffect(() => {
		document.title = t('titre');
		const favicon = document.getElementById("dynamic-favicon");

		// On part de /timer-poker car c'est la vraie racine du projet
		if (favicon) {
			favicon.href = `${import.meta.env.BASE_URL}favicon/favicon-timer-Muse.png`;
		}
	}, []);

	// Charger la liste des organisateurs au montage du composant
	useEffect(() => {  
        // Récupérer la liste des organisateurs depuis l'API et mettre à jour l'état      
		//fetch(`${API_BASE_URL}/organisateurs.php`)
			//.then((res) => res.json())
			//.then((data) => setOrganisateurs(data));
	}, []);

	// Mémoriser l'organisateur choisi (les détails viendront avec les prochains composants)
	const selectionnerOrganisateur = (user) => {
		setOrganisateur(user);
	};

	return (
		<div>
			<Header
				organisateurs={organisateurs}
				organisateurChoisi={organisateur}
				onSelectionner={selectionnerOrganisateur}
			/>
		</div>
	);
}

export default Index;
