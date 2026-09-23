import React from 'react';
import { Sun, Moon, Languages, Compass, FileText, Activity } from 'lucide-react';
import { useApp } from './ThemeContext';
import { DemoDataBadge } from './Badge';

interface NavbarProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onRouteChange }) => {
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#060B18]/80 dark:bg-[#060B18]/80 light:bg-white/80 border-b border-white/10 light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={() => onRouteChange('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0070C0] via-[#1F3864] to-[#F28C28] p-0.5 flex items-center justify-center shadow-glow-blue transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#060B18] rounded-[10px] flex items-center justify-center">
              <span className="font-heading font-black text-sm tracking-tighter text-[#F28C28]">
                MD
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base tracking-tight text-white light:text-slate-900 group-hover:text-[#F28C28] transition-colors">
                MEGHA-DRISHTI
              </span>
              <span className="font-devanagari text-xs font-semibold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 light:text-slate-600">
                मेघ-दृष्टि
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide">
              NCMRWF &bull; IMD 10-DAY ENSEMBLE AI
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 light:bg-slate-100 p-1 rounded-xl border border-white/5 light:border-slate-200">
          <button
            onClick={() => onRouteChange('/')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentRoute === '/'
                ? 'bg-[#1F3864] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5 light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Story & Overview</span>
          </button>

          <button
            onClick={() => onRouteChange('/console')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentRoute === '/console'
                ? 'bg-[#0070C0] text-white shadow-glow-blue font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5 light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>Forecaster Console</span>
          </button>

          <button
            onClick={() => onRouteChange('/method')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentRoute === '/method'
                ? 'bg-[#1F3864] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5 light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Methodology</span>
          </button>
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-3">
          <DemoDataBadge className="hidden xl:inline-flex" />

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            title="Toggle English / हिन्दी"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 light:bg-slate-100 text-xs font-mono text-slate-300 light:text-slate-700 border border-white/10 light:border-slate-300 transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-[#F28C28]" />
            <span className="font-semibold">{language === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 light:bg-slate-100 text-slate-300 light:text-slate-700 border border-white/10 light:border-slate-300 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>

          {/* Quick CTA if on landing or methodology */}
          {currentRoute !== '/console' && (
            <button
              onClick={() => onRouteChange('/console')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0070C0] to-[#F28C28] text-white text-xs font-semibold shadow-glow-orange hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Console</span>
              <span className="font-mono text-[10px] bg-black/30 px-1 rounded">5 km</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
