import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Chargement immédiat
import Index from "./components/Index";

/**
 * Racine de l'application Statistiques de Poker.
 *
 * Rôle : monter le routeur et déclarer les routes de l'application.
 * Une seule route active pour l'instant : « /stats-poker/ » vers la page
 * publique des statistiques (Index). Les routes d'exclusion et de
 * réinclusion des statistiques (exclude-analytics, include-analytics)
 * sont prêtes mais commentées, en attendant leur mise en service.
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
            {/* <Route path="/stats-poker/exclude-analytics" element={<ExcludeAnalytics />} />
            <Route path="/stats-poker/include-analytics" element={<IncludeAnalytics />} /> */}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
