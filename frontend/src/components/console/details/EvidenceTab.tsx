import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ShieldCheck, HelpCircle, Activity, TrendingUp } from 'lucide-react';
import type { WeatherThreat } from '../../../types/weather';
import { getEfiColor } from '../../../lib/utils';
import { useApp } from '../../common/ThemeContext';

interface EvidenceTabProps {
  threat: WeatherThreat;
  currentLeadTime: number;
}

export const EvidenceTab: React.FC<EvidenceTabProps> = ({
  threat,
  currentLeadTime,
}) => {
  const { t } = useApp();
  const currentPt =
    threat.timeSeries.find((p) => p.leadTime === currentLeadTime) ||
    threat.timeSeries[0];

  const chartData = threat.timeSeries.map((p) => ({
    leadTime: `+${p.leadTime}h`,
    hours: p.leadTime,
    efi: p.efi,
    sot: p.sot,
    prob: Math.round(p.exceedanceProb * 100),
  }));

  const efiVal = currentPt.efi;
  const sotVal = currentPt.sot;
  const agreementRatio = (threat.memberAgreement / threat.totalMembers) * 100;

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* EFI Card */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>{t('extremeIndex')}</span>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getEfiColor(efiVal) }} />
          </div>
          <div className="font-heading font-extrabold text-2xl text-white">
            {efiVal > 0 ? `+${efiVal.toFixed(2)}` : efiVal.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            {Math.abs(efiVal) > 0.8
              ? 'Unprecedented extreme relative to M-climate'
              : 'Substantial climatological anomaly'}
          </p>
        </div>

        {/* Shift of Tails (SOT) Card */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>{t('shiftOfTails')}</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#F28C28]" />
          </div>
          <div className="font-heading font-extrabold text-2xl text-[#F28C28]">
            +{sotVal.toFixed(1)}
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            {sotVal > 1.0
              ? 'Tail exceeds 99th percentile of climate'
              : 'Moderate tail shift'}
          </p>
        </div>

      </div>

      {/* Member Agreement & Exceedance Prob */}
      <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/20 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white font-semibold">{t('memberConsensusLabel')}</span>
          <span className="text-[#F28C28] font-bold text-sm">
            {threat.memberAgreement} / {threat.totalMembers} ({Math.round(agreementRatio)}%)
          </span>
        </div>

        {/* Consensus Bar */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-[#F28C28] transition-all duration-500"
            style={{ width: `${agreementRatio}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 pt-1">
          <span>{t('exceedanceProbLabel')}</span>
          <span className="text-emerald-400 font-bold">
            {Math.round(currentPt.exceedanceProb * 100)}%
          </span>
        </div>
      </div>

      {/* EFI Evolution Over Lead Time Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          <span className="font-semibold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            {t('efiTrendAcross')}
          </span>
          <span className="text-[10px] text-slate-500">
            Selected: +{currentLeadTime}h
          </span>
        </div>

        <div className="h-44 w-full p-2 rounded-xl bg-black/40 border border-white/10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="efiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F28C28" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#0070C0" stopOpacity={0.0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="efi"
                stroke="#F28C28"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#efiGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scientific Note */}
      <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-400 space-y-1">
        <div className="text-slate-300 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          {t('climatologicalFoundation')}
        </div>
        <p>
          {t('climatologicalDesc')}
        </p>
      </div>

    </div>
  );
};
