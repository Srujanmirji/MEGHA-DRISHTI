import React from 'react';
import { ShieldAlert, Sun, Moon, Languages, Calendar, AlertCircle } from 'lucide-react';
import { useApp } from '../common/ThemeContext';
import { DemoDataBadge, ForecasterAdvisoryNotice } from '../common/Badge';
import type { ForecastCycle } from '../../types/weather';

interface ForecasterTopBarProps {
  cycles: ForecastCycle[];
  selectedCycleId: string;
  onSelectCycle: (cycleId: string) => void;
  onNavigateHome: () => void;
  onNavigateMethod: () => void;
}

export const ForecasterTopBar: React.FC<ForecasterTopBarProps> = ({
  cycles,
  selectedCycleId,
  onSelectCycle,
  onNavigateHome,
  onNavigateMethod,
}) => {
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();

  return (
    <header className="h-14 w-full bg-[#060B18] border-b border-white/10 px-4 flex items-center justify-between z-40 select-none">
      
      {/* Left: Brand & Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
          title="Back to Landing Page"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0070C0] via-[#1F3864] to-[#F28C28] p-0.5 flex items-center justify-center shadow-glow-blue">
            <div className="w-full h-full bg-[#060B18] rounded-[6px] flex items-center justify-center">
              <span className="font-heading font-black text-xs text-[#F28C28]">MD</span>
            </div>
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-sm tracking-tight text-white">
                MEGHA-DRISHTI
              </span>
              <span className="font-devanagari text-[10px] text-slate-400">
                मेघ-दृष्टि
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#F28C28] block -mt-0.5">
              {t('missionControlSub')}
            </span>
          </div>
        </button>

        {/* Cycle Selector Dropdown */}
        <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-white/10">
          <Calendar className="w-3.5 h-3.5 text-blue-400 hidden md:inline" />
          <span className="text-[11px] font-mono text-slate-400 hidden lg:inline">
            {t('selectCycle')}
          </span>
          <select
            value={selectedCycleId}
            onChange={(e) => onSelectCycle(e.target.value)}
            className="bg-[#0B1426] text-white border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-[#F28C28] transition-colors"
          >
            {cycles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.activeThreatCount} {t('active')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center: Advisory Notice */}
      <div className="hidden lg:flex items-center">
        <ForecasterAdvisoryNotice />
      </div>

      {/* Right Tools */}
      <div className="flex items-center gap-2.5">
        <DemoDataBadge className="hidden sm:inline-flex" />

        {/* Methodology link button */}
        <button
          onClick={onNavigateMethod}
          className="hidden md:inline-flex px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 border border-white/10 transition-colors"
        >
          {t('methodology')}
        </button>

        {/* Language switch */}
        <button
          onClick={toggleLanguage}
          title="Toggle English / हिन्दी"
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 border border-white/10 transition-colors"
        >
          <Languages className="w-3.5 h-3.5 text-[#F28C28]" />
          <span className="font-bold">{language === 'en' ? 'हिन्दी' : 'EN'}</span>
        </button>

        {/* Dark/Light toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-blue-600" />
          )}
        </button>
      </div>

    </header>
  );
};
