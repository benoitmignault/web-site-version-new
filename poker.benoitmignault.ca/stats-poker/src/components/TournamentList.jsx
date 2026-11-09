import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import Select from "react-select";
import { t } from "../i18n/i18n";

/**
 * Liste déroulante des tournois.
 *
 * Va chercher la liste via l'API au montage (tournaments.php). Quand
 * l'utilisateur en choisit un, stocke son id dans Content, qui
 * affichera sa carte dans la section Résultat.
 *
 * @param {Object} props Les propriétés du composant.
 * @param {Function} props.setActiveResult Fonction pour stocker l'id du tournoi choisi dans Content.
 */
function TournamentList({ setActiveResult }) {
    
    // La liste des tournois reçue de l'API
    const [tournaments, setTournaments] = useState([]);

    // L'option sélectionnée (objet { value, label }), pas juste l'id
    const [selectedOption, setSelectedOption] = useState(null);

    // L'erreur à afficher : { code, message } — le code est traduit au rendu, donc suit la langue
    const [error, setError] = useState(null);

    // Préparer les options pour le sélecteur react-select :
    // on transforme la liste des tournois en tableau d'objets {value, label}
    const tournamentOptions = tournaments.map((tournament) => ({
        value: tournament.id_tournoi,
        // Ajancement du label pour inclure la date du tournoi et du # 
        label: `${tournament.id_tournoi} - ${tournament.date}`,
    }));

    // Fonction pour charger la liste des tournois pour en sélectionner un
    const loadTournaments = async () => {

        try {
            const response = await fetch(`${API_BASE_URL}/tournaments.php`);

            const data = await response.json();
            if (data.success) {

                // Mettre à jour la liste des tournois pour l'afficher dans le sélecteur
                // Le format de la réponse est : {success: true, tournaments: [{id_tournoi, date}]}
                setTournaments(data.tournaments);
                setError(null);
            } else {

                // Erreur retournée par l'API lors du chargement des tournois
                setError({ code: data.code, message: data.message });
            }            
        } catch (error) {            
            console.error(err);
			setError({ code: "errorLoadingTournaments", message: "" });
        }
    };

    // Fonction pour gérer le changement de sélection dans la liste déroulante
	const handleChange = (option) => {

		setSelectedOption(option);

		if (option) {
            setActiveResult(option.value);   // option.value = 3, l'id du tournoi remonte
        } else {
            setActiveResult(null);           // le X
        }
	};

    // Charger la liste des tournois au montage du composant
    useEffect(() => {
        loadTournaments();
    }, []);

    // Si le chargement a échoué, on affiche l'erreur au lieu de la liste déroulante
	if (error) {
		return <p className="error-message">{error.code ? t(error.code) : error.message}</p>;
	}

    return (
		<div className="player-field">
			<span className="player-label">{t("tournamentLabel")}</span>
			<div className="player-select-wrapper">
				<Select
					classNamePrefix="player-select"
					options={tournamentOptions}
					value={selectedOption}
					onChange={handleChange}
					placeholder={t("chooseTournament")}
					isClearable
					aria-label={t("tournamentLabel")}
				/>
			</div>
		</div>
	);
}

export default TournamentList;
