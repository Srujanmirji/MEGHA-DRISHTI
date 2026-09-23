import React, { useState } from 'react';
import { Filter, Layers, Search, Flame, Wind, Snowflake, CloudRain, ShieldCheck } from 'lucide-react';
import type { WeatherThreat, HazardType } from '../../types/weather';
import { ThreatCard } from './ThreatCard';
import { useApp } from '../common/ThemeContext';

interface ThreatBoardProps {
  threats: WeatherThreat[];
  selectedThreatId: string;
  onSelectThreat: (threat: WeatherThreat) => void;
}

export const ThreatBoard: React.FC<ThreatBoardProps> = ({
  threats,
  selectedThreatId,
  onSelectThreat,
}) => {
  const { t } = useApp();
  const [hazardFilter, setHazardFilter] = useState<'all' | HazardType>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreats = threats.filter((threat) => {
    if (hazardFilter !== 'all' && threat.type !== hazardFilter) return false;
    if (severityFilter !== 'all' && threat.severity !== severityFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = threat.name.toLowerCase().includes(q);
      const matchRegion = threat.region.toLowerCase().includes(q);
      if (!matchName && !matchRegion) return false;
    }
    return true;
  });

  return (
    <aside className="w-80 h-full flex flex-col bg-[#060B18]/95 border-r border-white/10 select-none overflow-hidden shrink-0 z-20">
      
      {/* Board Header */}
      <div className="p-4 border-b border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F28C28] animate-pulse" />
            <h3 className="font-heading font-bold text-white text-sm tracking-tight uppercase">
              {t('threatBoard')}
            </h3>
          </div>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
            {filteredThreats.length} {t('active')}
          </span>
        </div>

        {/* Hazard Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
          <button
            onClick={() => setHazardFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-colors shrink-0 ${
              hazardFilter === 'all'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {t('allHazards')}
          </button>
          <button
            onClick={() => setHazardFilter('cyclone')}
            className={`px-2 py-1 rounded-md transition-colors shrink-0 flex items-center gap-1 ${
              hazardFilter === 'cyclone'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3 h-3 text-blue-400" />
            {t('cyclone')}
          </button>
          <button
            onClick={() => setHazardFilter('heat')}
            className={`px-2 py-1 rounded-md transition-colors shrink-0 flex items-center gap-1 ${
              hazardFilter === 'heat'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-400" />
            {t('heat')}
          </button>
          <button
            onClick={() => setHazardFilter('rain')}
            className={`px-2 py-1 rounded-md transition-colors shrink-0 flex items-center gap-1 ${
              hazardFilter === 'rain'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3 h-3 text-indigo-400" />
            {t('rain')}
          </button>
          <button
            onClick={() => setHazardFilter('cold')}
            className={`px-2 py-1 rounded-md transition-colors shrink-0 flex items-center gap-1 ${
              hazardFilter === 'cold'
                ? 'bg-cyan-600 text-white font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Snowflake className="w-3 h-3 text-cyan-300" />
            {t('cold')}
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B1426] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Threats List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredThreats.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 font-mono">
            {t('noThreats')}
          </div>
        ) : (
          filteredThreats.map((threat) => (
            <ThreatCard
              key={threat.id}
              threat={threat}
              isSelected={threat.id === selectedThreatId}
              onSelect={onSelectThreat}
            />
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-[#0B1426]/60 border-t border-white/5 text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <span>{t('mclimateFooter')}</span>
        <span className="text-[#F28C28]">{t('twentyThreeMembers')}</span>
      </div>

    </aside>
  );
};
