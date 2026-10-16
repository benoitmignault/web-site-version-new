import { SITE_URL } from "../config";
import { t } from "../i18n/i18n";

function Footer() {

    // Va retourner l'année en cours pour l'affichage du copyright
	const annee = new Date().getFullYear();

	return (
		<footer>
			<span>© {annee} {t('titre-footer')} — {t('droitsReserves')}</span>
			<a href={SITE_URL}>← {t('pageAccueil')}</a>
		</footer>
	);
}

export default Footer;
