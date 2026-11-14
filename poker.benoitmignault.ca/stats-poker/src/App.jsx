import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Chargement immédiat
import Index from "./components/Index";

/**
 * Racine de l'application Statistiques de Poker.
 *
 * Rôle : monter le routeur et déclarer les routes de l'application.
 * Une route principale affiche les statistiques publiques et deux routes permettent de gérer l'exclusion ou la réinclusion des statistiques (exclude-analytics, include-analytics).
 * Le Suspense couvre le chargement à la demande des futurs composants.
 */

// Chargement à la demande
const ExcludeAnalytics = lazy(() => import("./components/settings/ExcludeAnalytics"));
const IncludeAnalytics = lazy(() => import("./components/settings/IncludeAnalytics"));

function App() {

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Chargement...</div>}>
          <Routes>
            <Route path="/stats-poker/" element={<Index />}/>
            <Route path="/stats-poker/exclude-analytics" element={<ExcludeAnalytics />} />
            <Route path="/stats-poker/include-analytics" element={<IncludeAnalytics />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
