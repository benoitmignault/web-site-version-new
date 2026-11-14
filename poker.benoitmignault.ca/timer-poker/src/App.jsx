import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Chargement immédiat
import Index from "./components/Index";

/**
 * App.jsx
 *
 * Point d'entrée du minuteur de poker : ne contient que le routage.
 * Aucun état global ici — l'état partagé (organisateur sélectionné,
 * niveau de blindes) et l'assemblage des sections vivent dans
 * components/Index.jsx.
 *
 * Routes :
 * - /timer-poker/ : page du minuteur (Index, chargé immédiatement)
 * - /timer-poker/exclude-analytics : désactive les statistiques
 *   d'usage sur ce navigateur (chargé à la demande)
 * - /timer-poker/include-analytics : les réactive (chargé à la demande)
 *
 * Suspense affiche « Chargement... » pendant le chargement à la
 * demande des pages de statistiques.
 */

// Chargement à la demande
const ExcludeAnalytics = lazy(() => import("./components/settings/ExcludeAnalytics"));
const IncludeAnalytics = lazy(() => import("./components/settings/IncludeAnalytics"));

function App() {

  return (
    <BrowserRouter>
        <Suspense fallback={<div>Chargement...</div>}>
            <Routes>
                <Route path="/timer-poker/exclude-analytics" element={<ExcludeAnalytics />} />
                <Route path="/timer-poker/include-analytics" element={<IncludeAnalytics />} />
                <Route path="/timer-poker/" element={<Index />}/>              
            </Routes>
        </Suspense>            
    </BrowserRouter>
  )
}

export default App
