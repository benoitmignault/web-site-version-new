// Ce fichier Index va commencer par récupérer la liste des organisateurs disponibles depuis l'API. 
// Ensuite, on va passer l'informaton 
// mettre à jour l'état de l'application pour . Il va également gérer le changement du favicon lorsque le composant est monté.


import { useEffect, useState } from "react";
import OrganisateurListe from "./OrganisateurListe";
// import TableauJetons from "./TableauJetons";
// import TableauMises from "./TableauMises";
// import CompteRebours from "./CompteRebours";
import { API_BASE_URL, SITE_URL } from "../config";
import { t } from "../i18n/i18n";
import '../css/index.css';

function Index() {

	// La liste des valeurs couleurs et la mise initiale sont stockées dans l'état global de l'application
	const [couleurs, setCouleurs] = useState([]);

	// La mise dans laquelle on est actuellement entrains d'utilisé dans l'état global de l'application
	const [mise, setMise] = useState(null);


	// Changer le titre de la page et le favicon lorsque le composant est monté
	useEffect(() => {
		document.title = t('titre-page');
		const favicon = document.getElementById("dynamic-favicon");

		// On part de /timer-poker car c'est la vraie racine du projet
		if (favicon) {
			favicon.href = `${import.meta.env.BASE_URL}favicon/favicon-timer-Muse.png`;
		}

	}, []);	

	// Reçoit les données d'OrganisateurListe et les redistribue
	const recevoirDonnees = (donnees) => {
		setCouleurs(donnees.couleurs);
		setMise({
			petiteMise: donnees.premiereMise.valeurSmall,
			grosseMise: donnees.premiereMise.valeurBig,
			niveau: 1,
			niveauMax: donnees.niveauMax,
		});
	};	

	return (
		<div>
			<header>
				<a href={SITE_URL} className="retour-site">← {t('pageAccueil')}</a>
				<h1>{t('titre')}</h1>
				<OrganisateurListe onDonneesRecues={recevoirDonnees} />
			</header>
			<div className="main-container">
				<TableauJetons couleurs={couleurs} />
				<TableauMises mise={mise} />
			</div>
			<CompteRebours />
		</div>
	);
}

export default Index;
