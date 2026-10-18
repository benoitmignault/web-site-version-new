import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { t } from "../i18n/i18n";

function BlindPanel({ organizerId, level, setLevel }) {

	// Les mises reçues de l'API (null = pas encore de données)
	const [small, setSmall] = useState(null);
	const [big, setBig] = useState(null);

	// Le nombre total de niveaux pour l'organisateur
	const [maxLevel, setMaxLevel] = useState(null);

	// Le message d'erreur à afficher si le chargement échoue
	const [error, setError] = useState("");

	// fonction pour charger les blinds de l'organisateur sélectionné pour le niveau courant
	const loadBlinds = async () => {

		// Rien à charger tant qu'aucun organisateur n'est choisi
		// On doit attendre que l'organizerId soit défini avant de faire l'appel API, car sinon, on va utiliser la version sans id
		if (!organizerId) {
			return;
		}

		try {
			// On va chercher les jetons de l'organisateur sélectionné via l'API
			// mais en mode asynchrone pour pouvoir attendre la réponse avant de mettre à jour l'état      
			const response = await fetch(`${API_BASE_URL}/blinds.php?id=${organizerId}&level=${level}`);

			// On attend la réponse et on la convertit en JSON
			const data = await response.json();

			// Vérification de la réponse de l'API pour voir si la récupération des détails du joueur a réussi
			if (data.success) {

				// Mettre à jour les informations des blinds en cours
				setSmall(data.small);
				setBig(data.big);
				setMaxLevel(data.maxLevel);
				setError("");
			} else {

				// Erreur retournée par l'API lors du chargement des blinds
				setError(data.message);
			}

		} catch (err) {

			// En cas d'erreur, on affiche le message d'erreur dans la console et on met à jour l'état
			console.error(err);
			setError("Une erreur est survenue lors du chargement des blinds.");
		}

		// Pas d'indicateur de chargement ici : on affiche les mises
		// (ou "--" s'il n'y en a pas), ou un message d'erreur s'il y en a un
	};

	// Si on utilise le bouton "Passer au niveau suivant", on incrémente le niveau de 1 et 
	// on récupère les blinds pour le niveau suivant. On ne peut pas dépasser le nombre de niveaux maximum pour l'organisateur.
	const handleChange = () => {
		setLevel((prev) => prev + 1);
	};

	// On charge la combinaison où on est rendu au niveau courant de l'organisateur sélectionné au montage du composant
	// et à chaque fois que l'organizerId ou le level change
	useEffect(() => {

        const initializeData = async () => {

            // On charge les blinds de l'organisateur sélectionné pour le niveau courant
			// Au moment de l'appel de cette fonction, organizerId est déjà défini, donc on peut appeler loadChips directement
            await loadBlinds();
        };

        initializeData();		
		// On relance le useEffect à chaque fois que l'organizerId change
    }, [organizerId, level]); 

	// Si le chargement a échoué, on affiche l'erreur au lieu des mises
	if (error) {
		return <p className="error">{error}</p>;
	}

	return (
		<section className="blind-panel">			
			<div className="blind-values">
				<div className="blind">					
					<span className="blind-label">{t("smallBlind")}</span>
					{ /*<span className="blind-amount">{blinds.smallBlind}</span> */}
				</div>
				<div className="blind">					
					<span className="blind-label">{t("bigBlind")}</span>
					{ /*<span className="blind-amount">{blinds.bigBlind}</span> */ }
				</div>
				<button
					type="button" className="change-button"
					onClick={() => setLevel((currentLevel) => currentLevel + 1)}
				>
					{t("change")}
				</button>
			</div>
		</section>
	);
}

export default BlindPanel;
