import { t } from "../i18n/i18n";

function OrganisateurListe({  }) {

    // États globaux de l'application
	const [organisateurs, setOrganisateurs] = useState([]);
	const [organisateur, setOrganisateur] = useState("");


	// Charger la liste des organisateurs au montage du composant
	useEffect(() => {  
        // Récupérer la liste des organisateurs depuis l'API et mettre à jour l'état      
		//fetch(`${API_BASE_URL}/organisateurs.php`)
			//.then((res) => res.json())
			//.then((data) => setOrganisateurs(data));
	}, []);




	
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

export default OrganisateurListe;
