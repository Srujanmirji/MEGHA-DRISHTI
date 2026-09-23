import React, { useEffect, useState, Suspense, lazy } from 'react';
import { AppProvider } from './components/common/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';

const ForecasterConsolePageLazy = lazy(() =>
  import('./pages/ForecasterConsolePage').then((m) => ({ default: m.ForecasterConsolePage }))
);

const MethodologyPageLazy = lazy(() =>
  import('./pages/MethodologyPage').then((m) => ({ default: m.MethodologyPage }))
);

export const App: React.FC = () => {
  // Normalize initial route from window.location.pathname
  const getInitialRoute = (): string => {
    const path = window.location.pathname;
    if (path.startsWith('/console')) return '/console';
    if (path.startsWith('/method')) return '/method';
    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute());

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: string) => {
    if (route !== currentRoute) {
      window.history.pushState({}, '', route);
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#060B18] text-slate-100 flex flex-col font-sans">
        
        {/* Render common Navbar on Landing and Methodology pages */}
        {currentRoute !== '/console' && (
          <Navbar
            currentRoute={currentRoute}
            onRouteChange={handleNavigate}
          />
        )}

        {/* Page Switcher */}
        <div className="flex-1 flex flex-col">
          <Suspense
            fallback={
              <div className="w-full h-96 flex flex-col items-center justify-center text-slate-400 font-mono text-xs">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-3" />
                LOADING MODULE...
              </div>
            }
          >
            {currentRoute === '/' && (
              <LandingPage onNavigate={handleNavigate} />
            )}

            {currentRoute === '/console' && (
              <ForecasterConsolePageLazy onNavigate={handleNavigate} />
            )}

            {currentRoute === '/method' && (
              <MethodologyPageLazy onNavigate={handleNavigate} />
            )}
          </Suspense>
        </div>

        {/* Render common Footer on Landing and Methodology pages */}
        {currentRoute !== '/console' && (
          <Footer onRouteChange={handleNavigate} />
        )}

      </div>
    </AppProvider>
  );
};

export default App;
