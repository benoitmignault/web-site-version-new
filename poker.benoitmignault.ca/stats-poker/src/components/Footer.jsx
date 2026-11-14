import { SITE_URL } from "../config";
import { t } from "../i18n/i18n";

/**
 * Pied de page des statistiques de poker.
 *
 * Deux zones : à gauche le copyright avec le nom du site,
 * à droite le lien de retour vers la page d'accueil du site.
 * Même structure que le pied de page du minuteur, sans l'horloge.
 */
function Footer() {

	// L'année courante pour le copyright
	const year = new Date().getFullYear();

	return (
		<footer className="footer-bar">
			<div className="footer-section footer-copyright">
				<span>© {year} {t("siteName")} - {t("allRightsReserved")}</span>
			</div>
			<div className="footer-section footer-link">
				<a href={SITE_URL}>{t("homePage")}</a>
			</div>
		</footer>
	);
}

export default Footer;
