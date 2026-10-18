import { useEffect, useState } from "react";
import { SITE_URL } from "../config";
import { t } from "../i18n/i18n";

/**
 * Pied de page du minuteur.
 *
 * Trois zones : à gauche le copyright avec le nom du site et le prénom
 * de l'organisateur sélectionné, au centre l'heure en temps réel,
 * à droite le lien de retour vers la page d'accueil du site.
 *
 * @param {Object} props Les propriétés du composant.
 * @param {string} props.organizerName Prénom de l'organisateur sélectionné (chaîne vide si aucun).
 */
function Footer( {organizerName} ) {


    // L'année courante pour le copyright
	const year = new Date().getFullYear();

	// L'heure courante, rafraîchie à chaque seconde
	const [now, setNow] = useState(new Date());

	useEffect(() => {

		const timer = setInterval(() => setNow(new Date()), 1000);

		// On nettoie l'intervalle quand le composant est démonté
		return () => clearInterval(timer);
	}, []);

	return (		
		<footer>
			<span>
				© {year} {t("siteName")}
				{organizerName ? ` ${t("atOrganizer")} ${organizerName}` : ""} - {t("allRightsReserved")}
			</span>
			<span>
				{now.toLocaleTimeString("fr-FR", {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				})}
			</span>
			<a href={SITE_URL}>{t("homePage")}</a>
		</footer>
	);
}

export default Footer;
