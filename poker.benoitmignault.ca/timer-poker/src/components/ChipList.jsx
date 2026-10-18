import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { t } from "../i18n/i18n";

/**
 * Tableau des jetons de l'organisateur sélectionné.
 *
 * Va chercher les jetons via l'API quand l'organizerId change.
 * L'affichage est généré dynamiquement : le nombre de jetons
 * et leurs valeurs varient d'un organisateur à l'autre.
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

        const initializeData = async () => {

            // On charge les jetons de l'organisateur sélectionné
			// Au moment de l'appel de cette fonction, organizerId est déjà défini, donc on peut appeler loadChips directement
            await loadChips();
        };

        initializeData();

    }, []);

	// Si le chargement a échoué, on affiche l'erreur au lieu des jetons
	if (error) {
		return <p className="error">{error}</p>;
	}

	return (
		<ul>
			{chips.map((chip) => (
				<li key={chip.id_couleur ?? chip.amount}>
					<span className={`chip ${chip.color_english}`}>{chip.amount}</span>
					<span>{t(`color_${chip.color_english}`)}</span>
				</li>
			))}
		</ul>
	);
}

export default ChipList;
