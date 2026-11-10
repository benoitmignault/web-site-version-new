import { useState } from "react";
import Select from "react-select";
import { t } from "../../i18n/i18n";

// Les seuils de présences minimales offerts (fixes : la liste ne change jamais)
const MIN_PRESENCES_OPTIONS = [1, 3, 5, 10, 20];

/**
 * Sélecteur du nombre minimal de présences.
 *
 * Sert aux vues Classement et Killers & citrons : aucun appel à l'API,
 * les choix sont fixes. Quand l'utilisateur choisit un seuil, stocke
 * sa valeur dans Content, qui affichera le résultat dans la section 2.
 *
 * @param {Object} props Les propriétés du composant.
 * @param {Function} props.setActiveResult Fonction pour stocker le seuil choisi dans Content.
 */
function MinPresencesSelect({ setActiveResult }) {

	// L'option sélectionnée (objet { value, label }), pas juste la valeur
	const [selectedOption, setSelectedOption] = useState(null);

	// Préparer les options pour le sélecteur react-select :
	// on transforme les seuils en tableau d'objets {value, label}
	const presencesOptions = MIN_PRESENCES_OPTIONS.map((minPresences) => ({
		value: minPresences,
		label: `${minPresences} ${t("andMore")}`,
	}));

	// Fonction pour gérer le changement de sélection dans la liste déroulante
	const handleChange = (option) => {

		setSelectedOption(option);

		if (option) {
			setActiveResult(option.value);   // option.value = 5, le seuil remonte
		} else {
			setActiveResult(null);           // le X
		}
	};

	return (
		<div className="choice-field">
			<span className="choice-label">{t("minPresencesLabel")}</span>
			<div className="choice-select-wrapper">
				<Select
					classNamePrefix="choice-select"
					options={presencesOptions}
					value={selectedOption}
					onChange={handleChange}
					placeholder={t("chooseMinPresences")}
					isClearable
					aria-label={t("minPresencesLabel")}
				/>
			</div>
		</div>
	);
}

export default MinPresencesSelect;
