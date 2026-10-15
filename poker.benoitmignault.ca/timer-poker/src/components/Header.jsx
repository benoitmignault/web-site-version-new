import { t } from "../i18n/i18n";
import OrganisateurSelect from "./OrganisateurSelect";

function Header({ organisateurs, organisateurChoisi, onSelectionner }) {
	return (
		<header>
			<a href="https://benoitmignault.ca/" className="retour-site">← {t('pageAccueil')}</a>
			<h1>{t('titre')}</h1>
			<OrganisateurSelect
				organisateurs={organisateurs}
				valeur={organisateurChoisi}
				onChange={onSelectionner}
			/>
		</header>
	);
}

export default Header;
