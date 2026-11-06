import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Chargement immédiat
import Index from "./components/Index";

// Chargement à la demande
//const ExcludeAnalytics = lazy(() => import("./components/settings/ExcludeAnalytics"));
//const IncludeAnalytics = lazy(() => import("./components/settings/IncludeAnalytics"));

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
