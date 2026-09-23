import React, { useState } from 'react';
import { AlertCircle, Clock, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export const GapTimelineSection: React.FC = () => {
  const [highlightGap, setHighlightGap] = useState(true);

  return (
    <section id="the-gap" className="w-full py-20 bg-[#060B18] border-t border-white/5 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-96 h-96 bg-[#F28C28]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F28C28]/10 border border-[#F28C28]/25 text-[#F28C28] text-xs font-mono font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>OPERATIONAL METEOROLOGY GAP ANALYSIS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            The Critical 10-Day Forecasting Gap
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            India&apos;s operational numerical models provide high spatial detail only for the very near term. Beyond Day 3, forecasters must rely on coarse 12 km grids where localized extreme rain cores and cyclonic eyewalls are severely washed out.
          </p>
        </div>

        {/* Interactive Timeline Visualizer */}
        <div className="glass-panel p-6 sm:p-8 space-y-8 relative">
          
          {/* Day Axis (0 to 10) */}
          <div className="relative pt-6 pb-2">
            <div className="h-1.5 w-full bg-slate-800 rounded-full relative">
              {/* Day markers */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((day) => (
                <div
                  key={day}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${day * 10}%` }}
                >
                  <div className={`w-3 h-3 rounded-full border-2 ${day >= 4 ? 'bg-[#F28C28] border-white' : 'bg-slate-700 border-slate-500'}`} />
                  <span className="font-mono text-xs font-semibold text-slate-300 mt-2">
                    Day {day}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    +{day * 24}h
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Forecast Model Bars */}
          <div className="space-y-4 pt-4">
            
            {/* Bar 1: NEPS-R (4 km Regional Ensemble) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  4 km Regional Ensemble (NEPS-R)
                </span>
                <span className="font-mono text-emerald-400 text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Day 0 to Day 3 (+72h) only
                </span>
              </div>
              <div className="h-9 w-full bg-slate-900/60 rounded-xl p-1 border border-white/5 relative overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-lg flex items-center px-3 text-xs font-semibold text-white shadow-sm transition-all duration-700"
                  style={{ width: '30%' }}
                >
                  <span className="truncate">High-res 4 km detail &bull; 12 members</span>
                </div>
              </div>
            </div>

            {/* Bar 2: BFS Deterministic (6 km) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
                  6 km Deterministic Model (BFS)
                </span>
                <span className="font-mono text-blue-400 text-[11px] bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                  Day 0 to Day 7 (+168h) &bull; Single trajectory (no uncertainty spread)
                </span>
              </div>
              <div className="h-9 w-full bg-slate-900/60 rounded-xl p-1 border border-white/5 relative overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center px-3 text-xs font-semibold text-white shadow-sm transition-all duration-700"
                  style={{ width: '70%' }}
                >
                  <span className="truncate">Deterministic 6 km &bull; Zero ensemble spread</span>
                </div>
              </div>
            </div>

            {/* Bar 3: NEPS-G Global Ensemble (12 km, 23 members) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
                  12 km Global Ensemble (NEPS-G, 23 members)
                </span>
                <span className="font-mono text-indigo-300 text-[11px] bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                  Day 0 to Day 10 (+240h) &bull; Full uncertainty coverage, but coarse 12 km
                </span>
              </div>
              <div className="h-9 w-full bg-slate-900/60 rounded-xl p-1 border border-white/5 relative overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-lg flex items-center px-3 text-xs font-semibold text-white shadow-sm transition-all duration-700"
                  style={{ width: '100%' }}
                >
                  <span className="truncate">Coarse 12 km global mesh &bull; 23 ensemble members</span>
                </div>
              </div>
            </div>

            {/* Glowing Orange Overlay: THE GAP (Days 4 to 10) */}
            <div className="pt-2 relative">
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="font-mono font-bold text-[#F28C28] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  MEGHA-DRISHTI SOLUTION SPACE (DAYS 4–10)
                </span>
                <button
                  onClick={() => setHighlightGap(!highlightGap)}
                  className="text-[11px] font-mono text-slate-400 hover:text-white underline"
                >
                  {highlightGap ? 'Hide Sweep' : 'Show Sweep'}
                </button>
              </div>

              <div className="relative h-14 w-full bg-slate-950/80 rounded-xl border border-white/10 p-1 flex items-center">
                {/* Left empty (Day 0-3 covered by NEPS-R) */}
                <div className="w-[30%] h-full flex items-center px-3 text-slate-500 text-[11px] font-mono">
                  Covered by 4km NEPS-R
                </div>

                {/* Days 4 to 10 Glowing Sweep */}
                <div 
                  className={`w-[70%] h-full rounded-lg transition-all duration-700 flex items-center justify-between px-4 border ${
                    highlightGap
                      ? 'bg-gradient-to-r from-[#F28C28]/25 via-[#F28C28]/40 to-[#F28C28]/25 border-[#F28C28] shadow-glow-orange animate-pulse'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#F28C28] shrink-0" />
                    <div>
                      <div className="font-heading font-bold text-white text-xs sm:text-sm">
                        No high-resolution ensemble — this is the gap we fill.
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono hidden sm:block">
                        CorrDiff downscales all 23 NEPS-G members to ~5 km spatial detail.
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-white px-2 py-1 rounded bg-[#F28C28]/40 border border-[#F28C28]/60 shrink-0">
                    Days 4–10: ~5 km
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Operational Impact Callout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Preserves Convective Cores:</strong> Diffusion model retains localized 350+ mm rainfall without damping high wavenumbers.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Every Member Downscaled:</strong> All 23 members are individually sharpened so the full probability density function remains intact.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Honest Footprint Guidance:</strong> Alert zones match verified Fractions Skill Score at each lead-time horizon.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
