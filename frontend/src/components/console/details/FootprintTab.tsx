import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ShieldCheck, MapPin, Compass, AlertCircle } from 'lucide-react';
import type { WeatherThreat } from '../../../types/weather';
import { useApp } from '../../common/ThemeContext';

interface FootprintTabProps {
  threat: WeatherThreat;
  currentLeadTime: number;
}

export const FootprintTab: React.FC<FootprintTabProps> = ({
  threat,
  currentLeadTime,
}) => {
  const { t } = useApp();
  const currentPt =
    threat.timeSeries.find((p) => p.leadTime === currentLeadTime) ||
    threat.timeSeries[0];

  const skillData = threat.timeSeries.map((p) => ({
    leadTime: `+${p.leadTime}h`,
    fss: Number(p.fssSkill.toFixed(2)),
    radius: p.footprintRadiusKm,
  }));

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* Footprint Category & Sizing Basis Banner */}
      <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/25 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#F28C28] font-bold uppercase tracking-wider">
            {t('footprintEngineStatus')}
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {t('fssCalibrated')}
          </span>
        </div>

        <div className="font-heading font-bold text-white text-base">
          {threat.severity} {t('impactCorridor')}
        </div>

        <div className="text-xs text-slate-300 leading-relaxed font-sans">
          {t('sizeBasis')} <strong className="text-white">{t('sizeBasisDesc')} ({currentPt.footprintRadiusKm} km radius).</strong>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">{t('effectiveRadius')}</span>
          <div className="font-heading font-extrabold text-xl text-white">
            {currentPt.footprintRadiusKm} km
          </div>
          <span className="text-[10px] text-slate-500">
            Shrinking rate: ~2.8 km/hour
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">{t('fssSkillScore')}</span>
          <div className="font-heading font-extrabold text-xl text-emerald-400">
            {currentPt.fssSkill.toFixed(2)} / 1.00
          </div>
          <span className="text-[10px] text-slate-500">
            Calibrated spatial threshold
          </span>
        </div>
      </div>

      {/* Small Chart: Fractions Skill Score vs Lead Time */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          <span className="font-semibold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#F28C28]" />
            {t('spatialSkill')}
          </span>
          <span className="text-[10px] text-slate-500">
            At +{currentLeadTime}h: {currentPt.fssSkill.toFixed(2)}
          </span>
        </div>

        <div className="h-40 w-full p-2 rounded-xl bg-black/40 border border-white/10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={skillData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="leadTime" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis domain={[0, 1]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1426',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Line
                type="monotone"
                dataKey="fss"
                stroke="#2E7D32"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Affected Districts Checklist */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-red-400" />
          <span>{t('affectedDistricts')}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {currentPt.affectedDistricts.map((d, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[11px] text-red-200 flex items-start gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
        <span>
          <strong>{t('operationalSafeguard')}</strong> {t('operationalSafeguardDesc')}
        </span>
      </div>

    </div>
  );
};
