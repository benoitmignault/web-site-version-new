import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import OrganizerList from "./OrganizerList";
import ChipList from "./ChipList";
import BlindPanel from "./BlindPanel";
import Countdown from "./Countdown.jsx";
import Footer from "./Footer.jsx";
import { API_BASE_URL } from "../config";
import { shouldExcludeStats } from "../utils/logging";
import { t, setLanguage } from "../i18n/i18n";
import '../css/index.css';
import '../css/mobile.css';

/**
 * Page principale du minuteur de poker (dashboard).
 *
 * Structure :
 * - En-tête : jeton doré et titre « DASHBOARD », horloge en temps réel
 *   centrée (mise à jour chaque seconde), sélecteur d'organisateur et
 *   interrupteur de langue FR | EN
 * - Corps : carte des valeurs des jetons (ChipList) à gauche — invisible
 *   mais espace réservé tant qu'aucun organisateur n'est choisi — et
 *   colonne du minuteur à droite (BlindPanel et Countdown)
 * - Pied de page : le composant Footer, qui reçoit le nom de
 *   l'organisateur
 * - Bouton « retour en haut » : apparaît après défilement et ramène
 *   en haut de la page en douceur
 *
 * État détenu ici : l'organisateur choisi (id et nom), le niveau de
 * blinds courant et le niveau maximum, le clignotement d'alerte du
 * minuteur et l'affichage du bouton de retour en haut.
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

	// État pour gérer le flash du chrono (Countdown.jsx) : on le passe à true quand le chrono clignote
	const [isTimerFlashing, setIsTimerFlashing] = useState(false);

	// État pour gérer la langue du site : "fr" ou "en"
	const [language, setLanguageState] = useState("fr");

	// Change la langue du dictionnaire et force React à tout ré-afficher
	const changeLanguage = (lang) => {
		setLanguage(lang);
		setLanguageState(lang);
	};

	// L'heure courante, rafraîchie à chaque seconde
	const [now, setNow] = useState(new Date());

	useEffect(() => {

		const timer = setInterval(() => setNow(new Date()), 1000);

		// On nettoie l'intervalle quand le composant est démonté
		return () => clearInterval(timer);
	}, []);

	// Changer le titre de la page et le favicon lorsque le composant est monté
	useEffect(() => {

		const favicon = document.getElementById("dynamic-favicon");

		// On part de /timer-poker car c'est la vraie racine du projet
		if (favicon) {
			favicon.href = `${import.meta.env.BASE_URL}favicon/favicon-timer-Muse.png`;
		}

		document.title = t('title-page');		
		// On met la langue du document pour l'accessibilité et le SEO		
		document.documentElement.lang = language;

		// On met à jour la langue du document pour l'accessibilité et le SEO
	}, [language]);

	// On logge le chargement de la page pour les stats, mais seulement si l'utilisateur n'a pas choisi d'exclure ses stats
	useEffect(() => {

		fetch(`${API_BASE_URL}/log-timer.php`,
			{ 
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					action_type: "page_load",
					action_name: "Affichage page",
					organizer_id: organizerId,
					// Vérifier si la variable locale "exclude_stats" est défini dans le navigateur
					exclude_stats: shouldExcludeStats()
				})
			}
		);
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
				<div className="header-clock">
					<span>
						{now.toLocaleTimeString("fr-FR", {
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
						})}
					</span>
				</div>			
				<div className="header-controls">
					<OrganizerList setOrganizerName={setOrganizerName} setOrganizerId={setOrganizerId} setLevel={setLevel} />
					<div className="language-switch">
						<button type="button" aria-pressed={language === "fr"} className={language === "fr" ? "active" : ""} onClick={() => changeLanguage("fr")}>FR</button>
						<span>|</span>
						<button type="button" aria-pressed={language === "en"} className={language === "en" ? "active" : ""} onClick={() => changeLanguage("en")}>EN</button>
					</div>
				</div>
			</div>
			<div className="main-container">
				<div className={`content-container${organizerId ? "" : " is-hidden"}`}>
					<ChipList organizerId={organizerId} />
				</div>
				<div className="timer-column">
					<div className="content-container">
						<BlindPanel organizerId={organizerId} level={level} setLevel={setLevel} maxLevel={maxLevel} setMaxLevel={setMaxLevel} />
					</div>
					<div className={`content-container${isTimerFlashing ? " flashing" : ""}`}>
						<Countdown organizerId={organizerId} level={level} setLevel={setLevel} maxLevel={maxLevel} setIsTimerFlashing={setIsTimerFlashing} />
					</div>
				</div>				
			</div>			
			{showScrollTop && (
				<button
					type="button" className="scroll-top" aria-label={t("backToTop")}
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}					
				>
					<FaArrowUp />
				</button>
			)}
			<Footer organizerName={organizerName} />
		</div>
	);
}

export default Index;
