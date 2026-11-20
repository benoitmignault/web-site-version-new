import { SITE_URL } from "../config";
import { t } from "../i18n/i18n";

/**
 * Pied de page du minuteur : barre ancrée en bas de l'écran (déclinée en
 * bloc statique empilé sur mobile).
 *
 * Trois zones :
 * - gauche : copyright — année courante et nom du tournoi, avec le nom de
 *   l'organisateur quand il est sélectionné (« CHEZ ... »)
 * - centre : sous-titre traduit (clé i18n "subtitle")
 * - droite : lien vers la page d'accueil
 *
 * L'horloge en temps réel n'est plus affichée ici : elle vit dans
 * l'en-tête (voir Index).
 *
 * @param {Object} props
 * @param {string} props.organizerName - Nom de l'organisateur sélectionné (chaîne vide si aucun).
 */
function Footer( {organizerName} ) {

    // L'année courante pour le copyright
	const year = new Date().getFullYear();

	return (		
		<footer className="footer-bar">
			<div className="footer-section footer-copyright">
				<span>
					© {year} {t("siteName")}
					{organizerName ? ` ${t("atOrganizer")} ${organizerName.toUpperCase()}` : ""} - {t("allRightsReserved")}
				</span>
			</div>
			<div className="footer-section footer-subtitle">
				<span>{t("subtitle")}</span>
			</div>
			<div className="footer-section footer-link">
				<a href={SITE_URL}>{t("homePage")}</a>
			</div>
		</footer>
	);
}

export default Footer;
