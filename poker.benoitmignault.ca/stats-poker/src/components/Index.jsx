import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import Header from "./Header.jsx";
import Content from "./Content.jsx";
import Footer from "./Footer.jsx";
import { API_BASE_URL } from "../config";
import { shouldExcludeStats } from "../utils/logging";
import { t, setLanguage } from "../i18n/i18n";
import "../css/index.css";
import "../css/mobile.css";

/**
 * Page principale des statistiques de poker.
 *
 * Rôle : assembler les trois parties de la page (Header, Content, Footer)
 * et détenir l'état partagé minimal — pour l'instant, la langue.
 * Au montage, règle le titre de l'onglet et le favicon des statistiques.
 */
function Index() {

	// État pour gérer la langue du site : "fr" ou "en"
	const [language, setLanguageState] = useState("fr");

	// État pour gérer l'affichage du bouton de retour en haut de page
	const [showScrollTop, setShowScrollTop] = useState(false);

	// Change la langue du dictionnaire et force React à tout ré-afficher
	const changeLanguage = (lang) => {
		setLanguage(lang);
		setLanguageState(lang);
	};

	// Changer le titre de la page et le favicon lorsque le composant est monté
	useEffect(() => {

		const favicon = document.getElementById("dynamic-favicon");

		// On part de /stats-poker car c'est la vraie racine du projet
		if (favicon) {
			favicon.href = `${import.meta.env.BASE_URL}favicon/favicon-stats-poker.png`;
		}

		document.title = t("title-page");

		// On met la langue du document pour l'accessibilité et le SEO
		document.documentElement.lang = language;

	}, [language]);
	
	/**
	 * Bouton de retour en haut : visible seulement après 300 px de défilement.
	 * L'écouteur est passif pour ne jamais bloquer le défilement, et la mise à
	 * jour retourne la valeur actuelle quand rien ne bascule : React ne re-rend
	 * pas la page à chaque événement, seulement au franchissement du seuil.
	 */
	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop((current) => {
				const shouldShow = window.scrollY > 300;
				return current === shouldShow ? current : shouldShow;
			});
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	// On logge le chargement de la page pour les stats, mais seulement si l'utilisateur n'a pas choisi d'exclure ses stats
	useEffect(() => {

		fetch(`${API_BASE_URL}/log-stats.php`,
			{ 
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					action_type: "page_load",
					action_name: "Affichage page",
					// Vérifier si la variable locale "exclude_stats" est défini dans le navigateur
					exclude_stats: shouldExcludeStats()
				})
			}
		);
	}, []);

	return (
		<>
			<Header language={language} changeLanguage={changeLanguage} />
			<Content />
			<Footer />
			{showScrollTop && (
				<button
					type="button"
					className="scroll-top-btn"
					aria-label={t("backToTop")}
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				>
					<FaArrowUp />
				</button>
			)}
		</>
	);
}

export default Index;
