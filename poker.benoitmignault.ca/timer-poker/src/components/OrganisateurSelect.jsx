import { t } from "../i18n/i18n";

function OrganisateurSelect({ organisateurs, valeur, onChange }) {
	return (
		<div>
			<label>{t('organisateur')}</label>
			<select value={valeur} onChange={(e) => onChange(e.target.value)}>
				<option value="">{t('choisirOrganisateur')}</option>
				{organisateurs.map((org) => (
					<option key={org.user} value={org.user}>{org.user}</option>
				))}
			</select>
		</div>
	);
}

export default OrganisateurSelect;
