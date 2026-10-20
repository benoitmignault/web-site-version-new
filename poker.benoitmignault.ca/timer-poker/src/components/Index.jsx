import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import OrganizerList from "./OrganizerList";
import ChipList from "./ChipList";
import BlindPanel from "./BlindPanel";
import Countdown from "./Countdown.jsx";
import Footer from "./Footer.jsx";
import { t } from "../i18n/i18n";
import '../css/index.css';
import '../css/mobile.css';

/**
 * Composant principal du minuteur de poker.
 *
 * Rôle : assembler les sections de la page et détenir l'état partagé minimal.
 * Chaque section est autonome et va chercher ses propres données via l'API ;
 * Index ne fait que distribuer les valeurs et les setters.
 *
 * État partagé :
 * - organizerId : id de l'organisateur sélectionné (ex. 7), utilisé par ChipList, BlindPanel et Countdown.
 * - organizerName : prénom de l'organisateur (ex. "Frantz"), affiché dans le Footer.
 * - level : niveau de blinds courant (ex. 1) ; remis à 1 à chaque changement d'organisateur,
 *   incrémenté par le bouton Changer de BlindPanel ; Countdown se réinitialise à 30:00 quand il change.
 *
 * Mise en page : en-tête (titre + OrganizerList), contenu (jetons / blinds + chrono),
 * puis Footer. ChipList n'est affiché que quand un organisateur est choisi ;
 * BlindPanel affiche "--" tant qu'il n'a pas de données.
 *
 * Au montage, règle le titre de l'onglet et le favicon du minuteur.
 */
function Index() {
	
	// On doit stocker le prénom de l'organisateur sélectionné pour l'affichage dans le tableau des mises
	const [organizerName, setOrganizerName] = useState(""); // ← le prénom (ex. "Frantz")

	// On doit stocker l'id de l'organisateur sélectionné pour l'affichage dans le tableau des mises
	const [organizerId, setOrganizerId] = useState(null); // ← le "id" (ex. 7")

	// On doit stocker le niveau de blinds sélectionné pour l'affichage dans le tableau des mises
	const [level, setLevel] = useState(1); // ← le niveau de blinds (ex. 1")

	// On doit stocker le nombre total de niveaux pour l'organisateur sélectionné pour l'affichage dans le tableau des mises
	const [maxLevel, setMaxLevel] = useState(null);

	// État pour gérer l'affichage du bouton de retour en haut de page
	const [showScrollTop, setShowScrollTop] = useState(false);

	// Changer le titre de la page et le favicon lorsque le composant est monté
	useEffect(() => {
		document.title = t('title-page');
		const favicon = document.getElementById("dynamic-favicon");

		// On part de /timer-poker car c'est la vraie racine du projet
		if (favicon) {
			favicon.href = `${import.meta.env.BASE_URL}favicon/favicon-timer-Muse.png`;
		}

	}, []);

	// Gestion du bouton de retour en haut de page
	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 300);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
		
	}, []);

	return (
		<div>
			<div className="header-container">
				<h1>
					<span className="chip gold header-chip" aria-hidden="true"></span>
					{t("title")}
				</h1>
				<OrganizerList setOrganizerName={setOrganizerName} setOrganizerId={setOrganizerId} setLevel={setLevel} />
			</div>
			<div className="main-container">
				<div className={`content-container${organizerId ? "" : " is-hidden"}`}>
					<ChipList organizerId={organizerId} />
				</div>
				<div className="timer-column">
					<div className="content-container">
						<BlindPanel organizerId={organizerId} level={level} setLevel={setLevel} maxLevel={maxLevel} setMaxLevel={setMaxLevel} />
					</div>
					<div className="content-container">
						<Countdown organizerId={organizerId} level={level} setLevel={setLevel} maxLevel={maxLevel} />
					</div>
				</div>				
			</div>
			<Footer organizerName={organizerName} />
			{showScrollTop && (
				<button
					type="button" className="scroll-top" aria-label={t("backToTop")}
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}					
				>
					<FaArrowUp />
				</button>
			)}
		</div>
	);
}

export default Index;
