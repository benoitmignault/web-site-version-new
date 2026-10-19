import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { t } from "../i18n/i18n";

/**
 * Tableau des jetons de l'organisateur sélectionné.
 *
 * Va chercher les jetons via l'API quand l'organizerId change.
 * L'affichage est généré dynamiquement : le nombre de jetons et leurs valeurs varient d'un organisateur à l'autre.
 * Index ne l'affiche que quand un organisateur est choisi.
 *
 * @param {Object} props Les propriétés du composant.
 * @param {number} props.organizerId ID de l'organisateur sélectionné.
 */
function ChipList({ organizerId }) {

	// Les jetons reçus de l'API
	const [chips, setChips] = useState([]);

	// Le message d'erreur à afficher si le chargement échoue
	const [error, setError] = useState("");

	// Fonction pour charger les jetons de l'organisateur sélectionné
	const loadChips = async () => {

		try {
			// On va chercher les jetons de l'organisateur sélectionné via l'API
			// mais en mode asynchrone pour pouvoir attendre la réponse avant de mettre à jour l'état      
			const response = await fetch(`${API_BASE_URL}/chips.php?id=${organizerId}`);

			// On attend la réponse et on la convertit en JSON
			const data = await response.json();

			// Vérification de la réponse de l'API pour voir si la récupération des détails du joueur a réussi
			if (data.success) {

				// Mettre à jour la liste des jetons pour l'afficher dans le tableau
				// la liste sera déjà trier via la réponse de l'API, donc pas besoin de trier ici
				setChips(data.chips);
				setError("");
			} else {

				// Erreur retournée par l'API lors du chargement des jetons
				setError(data.message);
			}

		} catch (err) {

			// En cas d'erreur, on affiche le message d'erreur dans la console et on met à jour l'état
			console.error(err);
			setError("Une erreur est survenue lors du chargement des jetons.");
		}
	};

	// On charge les jetons de l'organisateur sélectionné au montage du composant
	useEffect(() => {

		// Sans organisateur sélectionné, on ne peut pas charger les jetons, donc on quitte la fonction
		if (!organizerId) {
			return;
		}

		// Sinon, on charge les jetons de l'organisateur sélectionné
        const initializeData = async () => {

            // On charge les jetons de l'organisateur sélectionné
			// Au moment de l'appel de cette fonction, organizerId est déjà défini, donc on peut appeler loadChips directement
            await loadChips();
        };

        initializeData();		
		// On relance le useEffect à chaque fois que l'organizerId change
    }, [organizerId]); 

	// Si le chargement a échoué, on affiche l'erreur au lieu des jetons
	if (error) {
		return <p className="error">{error}</p>;
	}

	// Titre toujours affiché : la section garde sa place même sans organisateur,
	// la largeur ne bouge jamais à la sélection
	if (!organizerId) {
		return (
			<div className="chip-list">
				<h2>{t("chipValues")}</h2>
			</div>
		);
	}

	// Il est important d'avoir un id pour une liste car React utilise les clés 
	// pour identifier les éléments de la liste et optimiser le rendu.
	return (
		<div className="chip-list">
			<h2>{t('chipValues')}</h2>
			<ul>
				{chips.map((chip) => (
					<li key={chip.id}>
						<div className={`chip ${chip.color_english}`} />
						<div className="chip-text">
							<div className="chip-amount">{chip.amount}</div>
							<div className="chip-color-name">{chip.color_french}</div>
						</div>
					</li>
				))}
			</ul>		
		</div>		
	);
}

export default ChipList;
