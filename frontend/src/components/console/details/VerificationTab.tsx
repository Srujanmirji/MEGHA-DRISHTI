import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Award, Info, CheckCircle2 } from 'lucide-react';
import type { WeatherThreat } from '../../../types/weather';
import { useApp } from '../../common/ThemeContext';

interface VerificationTabProps {
  threat: WeatherThreat;
}

export const VerificationTab: React.FC<VerificationTabProps> = ({ threat }) => {
  const { t } = useApp();
  // 1. Synthetic Power Spectrum Data (log wavenumber vs log energy)
  const powerSpectrumData = [
    { wavenumber: 1, coarse12km: 100, corrDiff5km: 100, referenceK53: 100 },
    { wavenumber: 2, coarse12km: 65,  corrDiff5km: 68,  referenceK53: 70 },
    { wavenumber: 4, coarse12km: 35,  corrDiff5km: 44,  referenceK53: 45 },
    { wavenumber: 8, coarse12km: 14,  corrDiff5km: 26,  referenceK53: 28 },
    { wavenumber: 16, coarse12km: 3,   corrDiff5km: 15,  referenceK53: 16 }, // 12km model dampens out here
    { wavenumber: 32, coarse12km: 0.5, corrDiff5km: 7.5, referenceK53: 8 },  // 5km maintains energy!
    { wavenumber: 64, coarse12km: 0.1, corrDiff5km: 3.2, referenceK53: 3.5 },
  ];

  // 2. Synthetic Tail Q-Q Plot Data (Model Quantiles vs Observed IPED Gauges)
  const qqData = [
    { obs: 20,  model: 21,  perfect1to1: 20 },
    { obs: 50,  model: 52,  perfect1to1: 50 },
    { obs: 100, model: 98,  perfect1to1: 100 },
    { obs: 150, model: 154, perfect1to1: 150 },
    { obs: 200, model: 205, perfect1to1: 200 },
    { obs: 250, model: 248, perfect1to1: 250 },
    { obs: 300, model: 295, perfect1to1: 300 },
  ];

  // 3. Reliability Diagram Data (Forecast probability vs Observed relative frequency)
  const reliabilityData = [
    { forecastProb: 0.1, observedFreq: 0.12, ideal: 0.1 },
    { forecastProb: 0.3, observedFreq: 0.28, ideal: 0.3 },
    { forecastProb: 0.5, observedFreq: 0.52, ideal: 0.5 },
    { forecastProb: 0.7, observedFreq: 0.69, ideal: 0.7 },
    { forecastProb: 0.9, observedFreq: 0.88, ideal: 0.9 },
  ];

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* Verification Header */}
      <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/25 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-purple-300 font-bold uppercase">
            {t('verificationBenchmark')}
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30">
            {t('illustrativeBadge')}
          </span>
        </div>
        <p className="text-xs text-slate-300">
          {t('verificationSub')}
        </p>
      </div>

      {/* Chart 1: Kinetic Energy Power Spectrum */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white font-semibold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            {t('powerSpectrumTitle')}
          </span>
          <span className="text-[10px] text-amber-400 font-mono">
            {t('illustrativeBadge')}
          </span>
        </div>

        <div className="h-44 w-full p-2 rounded-xl bg-black/40 border border-white/10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={powerSpectrumData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="wavenumber" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1426',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Line type="monotone" dataKey="referenceK53" stroke="#64748b" strokeDasharray="3 3" name="k^(-5/3) Theory" dot={false} />
              <Line type="monotone" dataKey="coarse12km" stroke="#3b82f6" name="NEPS-G 12km (Damped)" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="corrDiff5km" stroke="#F28C28" name="CorrDiff ~5km (Preserved)" dot={false} strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-slate-400 font-mono">
          {threat.verification.powerSpectrumLabel}
        </p>
      </div>

      {/* Chart 2: Tail Q-Q Plot */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white font-semibold">
            {t('tailQqTitle')}
          </span>
          <span className="text-[10px] text-amber-400 font-mono">
            {t('illustrativeBadge')}
          </span>
        </div>

        <div className="h-40 w-full p-2 rounded-xl bg-black/40 border border-white/10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={qqData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="obs" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis domain={[0, 300]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1426',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Line type="monotone" dataKey="perfect1to1" stroke="#64748b" strokeDasharray="3 3" dot={false} name="1:1 Perfect Fit" />
              <Line type="monotone" dataKey="model" stroke="#2E7D32" strokeWidth={2} name="CorrDiff 5km vs IPED" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-slate-400 font-mono">
          {threat.verification.tailQqDescription}
        </p>
      </div>

      {/* Chart 3: Reliability Diagram */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white font-semibold">
            {t('reliabilityDiagramTitle')}
          </span>
          <span className="text-[10px] text-amber-400 font-mono">
            {t('illustrativeBadge')}
          </span>
        </div>

        <div className="h-40 w-full p-2 rounded-xl bg-black/40 border border-white/10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reliabilityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="forecastProb" domain={[0, 1]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis domain={[0, 1]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1426',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Line type="monotone" dataKey="ideal" stroke="#64748b" strokeDasharray="3 3" dot={false} name="Ideal Calibration" />
              <Line type="monotone" dataKey="observedFreq" stroke="#0070C0" strokeWidth={2.5} name="Ensemble Reliability" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{t('brierSkillScore')} {threat.verification.reliabilityScore} ({t('wellCalibrated')})</span>
        </div>
      </div>

    </div>
  );
};
