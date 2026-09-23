import React from 'react';
import { Wind, Flame, Snowflake, CloudRain, Activity } from 'lucide-react';
import type { WeatherThreat } from '../../types/weather';
import { SeverityChip } from '../common/Badge';
import { useApp } from '../common/ThemeContext';

interface ThreatCardProps {
  threat: WeatherThreat;
  isSelected: boolean;
  onSelect: (threat: WeatherThreat) => void;
}

export const ThreatCard: React.FC<ThreatCardProps> = ({
  threat,
  isSelected,
  onSelect,
}) => {
  const { language, t } = useApp();

  const getHazardIcon = () => {
    switch (threat.type) {
      case 'cyclone':
        return <Wind className="w-4 h-4 text-blue-400 animate-spin-slow" />;
      case 'heat':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'cold':
        return <Snowflake className="w-4 h-4 text-cyan-300" />;
      case 'rain':
        return <CloudRain className="w-4 h-4 text-indigo-400" />;
      default:
        return <Wind className="w-4 h-4 text-blue-400" />;
    }
  };

  // Colored left severity edge color and glow
  const getSeverityEdgeClass = () => {
    switch (threat.severity) {
      case 'Extreme Warning':
        return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]';
      case 'Warning':
        return 'bg-[#F28C28] shadow-[0_0_8px_rgba(242,140,40,0.6)]';
      case 'Watch':
        return 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]';
      case 'Advisory':
        return 'bg-blue-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]';
      default:
        return 'bg-slate-500';
    }
  };

  // Sparkline of EFI over 10-day lead time
  const renderSparkline = () => {
    const points = threat.timeSeries;
    if (!points || points.length === 0) return null;

    const w = 180;
    const h = 26;
    const padY = 3;

    const values = points.map((p) => Math.abs(p.efi));
    const maxVal = Math.max(...values, 0.01);

    const coords = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * w;
      const norm = Math.abs(p.efi) / maxVal;
      const y = h - padY - norm * (h - padY * 2);
      return [x, y];
    });

    const linePath = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;

    // Find peak point coordinates
    let peakIdx = 0;
    let maxEfi = 0;
    points.forEach((p, idx) => {
      if (Math.abs(p.efi) > maxEfi) {
        maxEfi = Math.abs(p.efi);
        peakIdx = idx;
      }
    });
    const peakCoord = coords[peakIdx];
    const strokeColor = threat.severity === 'Extreme Warning' ? '#EF4444' : '#F28C28';
    const gradId = `sparkline-grad-${threat.id}`;

    return (
      <div className="w-full pt-1 space-y-1">
        <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-[#F28C28]" />
            <span>{t('tenDayTrend')}</span>
          </span>
          <span className="text-slate-300 font-bold">
            {t('peak')}: {threat.peakEfi > 0 ? `+${threat.peakEfi}` : threat.peakEfi}
          </span>
        </div>

        <div className="relative h-7 w-full bg-black/45 rounded-lg overflow-hidden border border-white/5 px-1 py-0.5">
          <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.5" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Area gradient under sparkline */}
            <path d={areaPath} fill={`url(#${gradId})`} />
            {/* Smooth sparkline */}
            <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
            {/* Peak indicator dot */}
            <circle cx={peakCoord[0]} cy={peakCoord[1]} r="2.5" fill="#FFFFFF" stroke={strokeColor} strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={() => onSelect(threat)}
      className={`p-3.5 pl-4 rounded-xl border cursor-pointer transition-all duration-200 space-y-2.5 relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 ${
        isSelected
          ? 'bg-blue-950/80 border-[#F28C28] shadow-glow-orange scale-[1.01]'
          : 'bg-[#0B1426]/75 border-white/10 hover:border-white/25 hover:bg-[#101C36]'
      }`}
    >
      {/* Coloured Left Severity Edge */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${getSeverityEdgeClass()}`} />

      {/* Top row: Type Icon + Severity */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
            {getHazardIcon()}
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
            {t(threat.type)}
          </span>
        </div>

        <SeverityChip severity={threat.severity} />
      </div>

      {/* Name and Region */}
      <div>
        <h4 className="font-heading font-bold text-white text-sm leading-snug group-hover:text-blue-300 transition-colors">
          {language === 'hi' ? (threat.hindiName || threat.name) : threat.name}
        </h4>
        <div className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">
          {threat.region}
        </div>
      </div>

      {/* Key Metrics: Lead time window & Member agreement */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 border-t border-white/5">
        <div>
          <span className="text-slate-500 block text-[9px] uppercase">{t('window')}</span>
          <span className="text-slate-300 font-medium">{threat.leadTimeWindow.split('(')[0]}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[9px] uppercase">{t('agreement')}</span>
          <span className="text-[#F28C28] font-bold">
            {threat.memberAgreement} / {threat.totalMembers}
          </span>
        </div>
      </div>

      {/* Tiny Sparkline of EFI over 10-day lead time */}
      {renderSparkline()}
    </div>
  );
};

