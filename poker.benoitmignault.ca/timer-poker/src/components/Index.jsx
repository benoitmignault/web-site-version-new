import { useEffect, useState } from "react";
import Header from "./Header";
import TableauJetons from "./TableauJetons";
import TableauMises from "./TableauMises";
import CompteRebours from "./CompteRebours";
import { API_BASE_URL } from "../config";
import { t } from "../i18n/i18n";
import '../css/index.css';

function Index() {

	// États globaux de l'application
	const [organisateurs, setOrganisateurs] = useState([]);
	const [organisateur, setOrganisateur] = useState("");
	const [couleurs, setCouleurs] = useState([]);
	const [niveau, setNiveau] = useState(1);
	const [niveauMax, setNiveauMax] = useState(0);
	const [petiteMise, setPetiteMise] = useState(null);
	const [grosseMise, setGrosseMise] = useState(null);

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
		fetch(`${API_BASE_URL}/organisateurs.php`)
			.then((res) => res.json())
			.then((data) => setOrganisateurs(data));
	}, []);

	// Au choix d'un organisateur : récupérer ses jetons et sa première mise
	const selectionnerOrganisateur = (user) => {
		setOrganisateur(user);
		fetch(`${API_BASE_URL}/organisateur.php?user=${user}`)
			.then((res) => res.json())
			.then((data) => {
				setCouleurs(data.couleurs);
				setPetiteMise(data.premiereMise.valeurSmall);
				setGrosseMise(data.premiereMise.valeurBig);
				setNiveau(1);
				setNiveauMax(data.niveauMax);
			});
	};

	// Passer au niveau de blindes suivant
	const changerMise = () => {
		const prochain = niveau + 1;
		fetch(`${API_BASE_URL}/mises.php?user=${organisateur}&niveau=${prochain}`)
			.then((res) => res.json())
			.then((data) => {
				setPetiteMise(data.valeurSmall);
				setGrosseMise(data.valeurBig);
				setNiveau(prochain);
			});
	};

	// Revenir à la première mise de l'organisateur
	const reinitialiserMise = () => {
		selectionnerOrganisateur(organisateur);
	};

	return (
		<div>
			<Header
				organisateurs={organisateurs}
				organisateurChoisi={organisateur}
				onSelectionner={selectionnerOrganisateur}
			/>
			<div className="main-container">
				<TableauJetons couleurs={couleurs} />
				<TableauMises
					petiteMise={petiteMise}
					grosseMise={grosseMise}
					niveau={niveau}
					niveauMax={niveauMax}
					onChanger={changerMise}
					onReinitialiser={reinitialiserMise}
				/>
			</div>
			<CompteRebours />
		</div>
	);
}

export default Index;
