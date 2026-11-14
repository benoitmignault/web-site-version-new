import { t } from "../i18n/i18n";
import { TIMER_URL } from "../config";

/**
 * En-tête des statistiques de poker.
 *
 * Rôle : afficher le titre du site, le lien vers le minuteur et le
 * sélecteur de langue FR | EN, complètement à droite.
 * Même structure et mêmes classes que l'en-tête du minuteur.
 *
 * Props :
 * - language : la langue active ("fr" ou "en"), détenue par Index.
 * - changeLanguage : change la langue du dictionnaire et force le ré-affichage.
 */
function Header({ language, changeLanguage }) {
	return (
		<header className="header-container">
			<div className="header-title">
				<h1>
					<span className="chip gold header-chip" aria-hidden="true"></span>
					{t("title")}
				</h1>
			</div>
			<div className="header-tagline">
				<span>{t("subtitle")}<span className="tagline-dash">—</span>{t("subtitleSince")}</span>
			</div>
			<div className="header-controls">
				<span className="admin-link" aria-disabled="true">{t("statsManagement")}</span>
				<a className="timer-link" href={TIMER_URL} target="_blank" rel="noopener noreferrer">
					{t("timerLink")}
				</a>
				<div className="language-switch">
					<button type="button" aria-pressed={language === "fr"} className={language === "fr" ? "active" : ""} onClick={() => changeLanguage("fr")}>FR</button>
					<span>|</span>
					<button type="button" aria-pressed={language === "en"} className={language === "en" ? "active" : ""} onClick={() => changeLanguage("en")}>EN</button>
				</div>
			</div>
		</header>
	);
}

export default Header;
