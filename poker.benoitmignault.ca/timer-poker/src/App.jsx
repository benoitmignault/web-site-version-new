/**
 * App.jsx
 *
 * Composant principal du minuteur de poker.
 * Gère l'état global : organisateur sélectionné, niveau de blindes en cours,
 * valeurs/couleurs des jetons et le compte à rebours.
 *
 * Composants :
 * - OrganisateurSelect : liste des organisateurs (API organisateurs.php) ;
 *   au choix, récupère jetons + première mise (API organisateur.php)
 * - TableauJetons : affiche les valeurs et couleurs des jetons de l'organisateur
 * - TableauMises : petite et grosse mise du niveau en cours ; boutons
 *   Changer (niveau suivant via mises.php) et Réinitialiser
 * - CompteRebours : minuteur 15/30 minutes avec Arrêt / Poursuivre / Réinitialiser
 *
 * L'URL de l'API vient de config.js (API_BASE_URL), qui bascule entre dev et
 * prod via .env.development et .env.production.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Chargement immédiat
import Index from "./components/Index";

// Chargement à la demande

function App() {

  return (
    <></>
  )
}

export default App
