import React, { lazy, Suspense, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { PersonaSwitcher } from './components/PersonaSwitcher';
import { SkipNavLink } from './components/SkipNavLink';
import { ErrorBoundary } from './components/ErrorBoundary';
import { usePersona } from './hooks/usePersona';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import type { Persona } from './types';

const FanView = lazy(() => import('./views/FanView'));
const StaffView = lazy(() => import('./views/StaffView'));
const VolunteerView = lazy(() => import('./views/VolunteerView'));
const OrganizerView = lazy(() => import('./views/OrganizerView'));
const AccessibilityView = lazy(() => import('./views/AccessibilityView'));

/**
 * Main Layout wrapper syncing the persona selection state with React Router paths.
 * @returns React.ReactElement
 */
const MainLayout: React.FC = (): React.ReactElement => {
  const {
    persona,
    setPersona,
    language,
    setLanguage,
    venueId,
    setVenueId,
    accessibilityNeeds,
    toggleAccessibilityNeed
  } = usePersona();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect((): void => {
    const currentPath = location.pathname.substring(1);
    if (['fan', 'staff', 'volunteer', 'organizer', 'accessibility'].includes(currentPath)) {
      if (currentPath === 'accessibility') {
        return;
      }
      setPersona(currentPath as Persona);
    }
  }, [location, setPersona]);

  /**
   * Modifies persona and routes programmatically.
   * @param target - Target Persona
   * @returns void
   */
  const handlePersonaChange = (target: Persona): void => {
    setPersona(target);
    navigate(`/${target}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
      <SkipNavLink targetId="main-content" />
      <Navbar
        activeVenueId={venueId}
        onVenueChange={setVenueId}
        activeLanguage={language}
        onLanguageChange={setLanguage}
        onNavigateToAccessibility={(): void => navigate('/accessibility')}
      />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6" tabIndex={-1}>
        {location.pathname !== '/accessibility' && (
          <PersonaSwitcher currentPersona={persona} onChange={handlePersonaChange} />
        )}

        <Suspense fallback={<LoadingSkeleton type="card" count={3} />}>
          <Routes>
            <Route path="/fan" element={<FanView venueId={venueId} language={language} />} />
            <Route path="/staff" element={<StaffView venueId={venueId} language={language} />} />
            <Route path="/volunteer" element={<VolunteerView venueId={venueId} language={language} />} />
            <Route path="/organizer" element={<OrganizerView venueId={venueId} language={language} />} />
            <Route
              path="/accessibility"
              element={
                <AccessibilityView
                  venueId={venueId}
                  language={language}
                  accessibilityNeeds={accessibilityNeeds}
                  onToggleNeed={toggleAccessibilityNeed}
                />
              }
            />
            <Route path="*" element={<Navigate to="/fan" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

/**
 * Root Application Router with Error Boundary.
 * @returns React.ReactElement
 */
export const App: React.FC = (): React.ReactElement => {
  return (
    <ErrorBoundary>
      <Router>
        <MainLayout />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
