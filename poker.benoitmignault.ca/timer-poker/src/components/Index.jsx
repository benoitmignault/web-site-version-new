import { useEffect, useState } from "react";
import OrganizerList from "./OrganizerList";
import ChipList from "./ChipList";
import BlindPanel from "./BlindPanel";
// import CompteRebours from "./CompteRebours";
import { API_BASE_URL, SITE_URL } from "../config";
import { t } from "../i18n/i18n";
import '../css/index.css';

function Index() {

	// La liste des valeurs couleurs et la mise initiale sont stockées dans l'état global de l'application
	const [colors, setColors] = useState([]);
	
	// On doit stocker le prénom de l'organisateur sélectionné pour l'affichage dans le tableau des mises
	const [organizerName, setOrganizerName] = useState(""); // ← le prénom (ex. "Frantz")

	// On doit stocker l'id de l'organisateur sélectionné pour l'affichage dans le tableau des mises
	const [organizerId, setOrganizerId] = useState(null); // ← le "id" (ex. 7")

	// On doit stocker la mise initiale (petite et grosse blindes) pour l'affichage dans le tableau des mises
	const [bet, setBet] = useState({
		smallBlind: null, 
		bigBlind: null, 
		level: 1, 
		maxLevel: null
	});

	// Reçoit les données d'OrganizerList et les redistribue
	const handleDataReceived = (user, data) => {
		setOrganizerName(data.name);
		setOrganizerId(data.id);
		setColors(data.colors);
		setBet({
			smallBlind: data.premiereMise.small,
			bigBlind: data.premiereMise.big,
			level: 1,
			maxLevel: data.maxLevel,
		});
	};	

	// Changer le titre de la page et le favicon lorsque le composant est monté
	useEffect(() => {
		document.title = t('titre-page');
		const favicon = document.getElementById("dynamic-favicon");

		// On part de /timer-poker car c'est la vraie racine du projet
		if (favicon) {
			favicon.href = `${import.meta.env.BASE_URL}favicon/favicon-timer-Muse.png`;
		}

	}, []);

	return (
		<div>
			<header>
				<h1>{t('titre')}</h1>
				<OrganizerList onDataReceived={handleDataReceived} />
			</header>
			<div className="main-container">
				<ChipList colors={colors} />
				<BlindPanel bet={bet} />
			</div>
		</div>
	);
}

export default Index;
