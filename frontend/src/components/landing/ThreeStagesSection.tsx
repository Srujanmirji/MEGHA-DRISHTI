import React, { useEffect, useRef, useState } from 'react';
import { Target, Cpu, ShieldCheck, Sliders, ChevronRight, HelpCircle } from 'lucide-react';
import { drawSplitComparison } from '../../lib/canvas-generator';

export const ThreeStagesSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);
  const [splitRatio, setSplitRatio] = useState(0.5);
  const splitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);

  // Redraw split comparison canvas whenever splitRatio changes
  useEffect(() => {
    if (splitCanvasRef.current && activeStage === 2) {
      drawSplitComparison(splitCanvasRef.current, splitRatio, 540, 320);
    }
  }, [splitRatio, activeStage]);

  const handlePointerDown = () => {
    isDraggingRef.current = true;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    setSplitRatio(x / rect.width);
  };

  return (
    <section id="how-it-works" className="w-full py-20 bg-[#060B18] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-medium">
            <Cpu className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>OPERATIONAL AI PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            How MEGHA-DRISHTI Works: 3 Scientific Stages
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            From raw 23-member GRIB2 ensembles to actionable coastal footprints, our physics-informed AI bridges the 10-day predictability horizon without loss of extreme signals.
          </p>
        </div>

        {/* Stage Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <button
            onClick={() => setActiveStage(1)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeStage === 1
                ? 'bg-blue-950/60 border-blue-500/50 shadow-glow-blue'
                : 'glass-panel opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between pb-2">
              <span className="font-mono text-xs font-bold text-[#F28C28]">STAGE 01</span>
              <Target className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="font-heading font-bold text-white text-base">
              Detect &amp; Track
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              EFI anomaly detection vs. model&apos;s own reforecast climate (M-climate).
            </p>
          </button>

          <button
            onClick={() => setActiveStage(2)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeStage === 2
                ? 'bg-blue-950/60 border-blue-500/50 shadow-glow-blue'
                : 'glass-panel opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between pb-2">
              <span className="font-mono text-xs font-bold text-[#F28C28]">STAGE 02</span>
              <Cpu className="w-4 h-4 text-[#F28C28]" />
            </div>
            <h3 className="font-heading font-bold text-white text-base">
              Downscale Every Member
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              CorrDiff diffusion model sharpens 12 km to 5 km preserving convective cores.
            </p>
          </button>

          <button
            onClick={() => setActiveStage(3)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeStage === 3
                ? 'bg-blue-950/60 border-blue-500/50 shadow-glow-blue'
                : 'glass-panel opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between pb-2">
              <span className="font-mono text-xs font-bold text-[#F28C28]">STAGE 03</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-heading font-bold text-white text-base">
              Honest Footprints
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Alert footprint radius scales with verified Fractions Skill Score (FSS).
            </p>
          </button>

        </div>

        {/* Stage Content Panel */}
        <div className="glass-panel p-6 sm:p-8 relative min-h-[460px] flex flex-col justify-center">
          
          {/* STAGE 1 CONTENT: Detect & Track */}
          {activeStage === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-mono">
                  <span>M-CLIMATE NORMALIZED ANOMALY DETECTION</span>
                </div>
                <h3 className="text-2xl font-heading font-bold text-white">
                  Finding Threats in 4D Spatiotemporal Chaos
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Instead of setting arbitrary absolute thresholds, MEGHA-DRISHTI computes the <strong>Extreme Forecast Index (EFI)</strong> and <strong>Shift of Tails (SOT)</strong> against NCMRWF&apos;s 20-year reforecast climatology (M-climate).
                </p>

                {/* Formula Card */}
                <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2 font-mono text-xs">
                  <div className="text-[#F28C28] font-bold flex items-center justify-between">
                    <span>EXTREME FORECAST INDEX (EFI) FORMULATION</span>
                    <span className="text-[10px] text-slate-400">ECMWF / NCMRWF</span>
                  </div>
                  <div className="text-white bg-slate-900/80 p-2.5 rounded border border-white/5 text-center text-sm font-semibold tracking-wider">
                    EFI = &frac28;&pi; &int;<sub>0</sub><sup>1</sup> &radic;[ (p - F<sub>f</sub>(Q<sub>p</sub>)) / (p (1 - p)) ] dp
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Compares forecast cumulative distribution F<sub>f</sub> against model climate quantiles Q<sub>p</sub>. An EFI &gt; 0.8 signifies an exceptional extreme event.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F28C28]" />
                    <span><strong>4D DBSCAN:</strong> Groups contiguous high-EFI grid cells in (x, y, z, time) into coherent threat objects.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span><strong>Centroid Tracking:</strong> Links cyclonic vortex centers across 12-hour intervals to build consensus storm tracks.</span>
                  </div>
                </div>
              </div>

              {/* Visual Map graphic */}
              <div className="lg:col-span-6 relative p-6 rounded-2xl bg-[#0B1426] border border-white/10 flex flex-col items-center justify-center text-center">
                <div className="relative w-full max-w-md aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-white/5 flex items-center justify-center p-4">
                  {/* Stylized India & Anomaly Heatmap SVG */}
                  <svg viewBox="0 0 400 340" className="w-full h-full">
                    {/* Grid lines */}
                    <defs>
                      <radialGradient id="cycloneHeat" cx="72%" cy="62%" r="40%">
                        <stop offset="0%" stopColor="#C00000" stopOpacity="0.9" />
                        <stop offset="40%" stopColor="#F28C28" stopOpacity="0.75" />
                        <stop offset="70%" stopColor="#FFD966" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0070C0" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    <rect width="400" height="340" fill="#060B18" />
                    {/* Latitude / longitude lines */}
                    <path d="M 0 80 H 400 M 0 160 H 400 M 0 240 H 400" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <path d="M 100 0 V 340 M 200 0 V 340 M 300 0 V 340" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                    {/* India Coastline Outline */}
                    <path
                      d="M 120 70 L 150 90 L 130 140 L 150 180 L 170 230 L 195 280 L 220 230 L 245 180 L 265 140 L 280 120 L 250 80 L 210 60 L 170 60 Z"
                      fill="#0e1f38"
                      stroke="#1F3864"
                      strokeWidth="2"
                    />

                    {/* Bay of Bengal Anomaly blob */}
                    <circle cx="280" cy="210" r="75" fill="url(#cycloneHeat)" className="animate-pulse" />

                    {/* Track line */}
                    <path
                      d="M 285 240 Q 275 190 260 145"
                      fill="none"
                      stroke="#F28C28"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                    />

                    {/* Odisha Landfall target */}
                    <circle cx="260" cy="145" r="8" fill="#C00000" stroke="#fff" strokeWidth="2" />
                    <text x="272" y="148" fill="#FFD966" fontSize="10" fontFamily="monospace">Odisha Landfall (EFI: 0.96)</text>
                    <text x="210" y="275" fill="#38BDF8" fontSize="10" fontFamily="monospace">Central Bay Vortex</text>
                  </svg>
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-2">
                  4D Spatiotemporal Cluster Overlay &bull; EFI Extreme Anomaly Field
                </span>
              </div>
            </div>
          )}

          {/* STAGE 2 CONTENT: Downscale every member */}
          {activeStage === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F28C28]/10 text-[#F28C28] text-xs font-mono">
                    <span>DIFFUSION AI: NVIDIA PHYSICS-NEMO / CORRDIFF ARCHITECTURE</span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white mt-1">
                    Split-Screen Resolution Comparison
                  </h3>
                  <p className="text-xs text-slate-300">
                    Drag the divider to compare the coarse 12 km NEPS-G field against the sharpened ~5 km CorrDiff diffusion field.
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-white/10">
                    Left: 12 km Coarse
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#F28C28]/20 text-[#F28C28] border border-[#F28C28]/40 font-bold">
                    Right: 5 km AI Sharpened
                  </span>
                </div>
              </div>

              {/* Interactive Drag Divider Canvas */}
              <div 
                className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black cursor-ew-resize select-none"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerUp}
              >
                <canvas
                  ref={splitCanvasRef}
                  width={540}
                  height={320}
                  className="w-full h-auto block"
                />

                {/* Overlaid Badges */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-xs font-mono text-slate-300 border border-white/10 pointer-events-none">
                  NEPS-G: 12 km Coarse Grid
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#F28C28]/90 text-white text-xs font-mono font-bold shadow-glow-orange pointer-events-none">
                  Diffusion: ~5 km Convective Core
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-mono text-slate-300 border border-white/10 pointer-events-none flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#F28C28]" />
                  <span>Click and drag slider horizontally</span>
                </div>
              </div>

              <div className="max-w-3xl mx-auto p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 flex items-center justify-between">
                <span><strong>Physics-Guided Diffusion:</strong> Trained on NCMRWF&apos;s 4 km regional ensemble (NEPS-R) to restore physical turbulence spectra without hallucinations.</span>
              </div>
            </div>
          )}

          {/* STAGE 3 CONTENT: Honest Alerts */}
          {activeStage === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-mono">
                  <span>FRACTIONS SKILL SCORE (FSS) CALIBRATED FOOTPRINTS</span>
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mt-1">
                  Alert Footprint Matches Measured Skill
                </h3>
                <p className="text-xs text-slate-300">
                  Instead of issuing misleadingly tight polygons at Day 8, our footprint engine dynamically sizes advisory zones based on historical skill curves.
                </p>
              </div>

              {/* 3 Sequential Panels: Day 8 -> Day 5 -> Day 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Day 8 Panel */}
                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-amber-400 font-bold">DAY 8 (+192h)</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Advisory
                    </span>
                  </div>
                  <div className="h-32 rounded-xl bg-slate-950/80 border border-white/5 relative flex items-center justify-center overflow-hidden">
                    {/* Wide footprint circle */}
                    <div className="w-28 h-28 rounded-full border-2 border-dashed border-amber-400 bg-amber-500/20 flex items-center justify-center animate-pulse">
                      <span className="text-[10px] font-mono text-amber-200">~420 km zone</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="font-semibold text-white">Broad Synoptic Warning</div>
                    <p className="text-[11px] text-slate-400">
                      High track spread. Footprint encompasses broad coast from Andhra to Bengal.
                    </p>
                    <div className="font-mono text-[10px] text-amber-400 pt-1">
                      FSS Skill = 0.35 &bull; Uncertainty High
                    </div>
                  </div>
                </div>

                {/* Day 5 Panel */}
                <div className="p-5 rounded-2xl bg-orange-950/20 border border-orange-500/40 space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-orange-400 font-bold">DAY 5 (+120h)</span>
                    <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                      Cyclone Watch
                    </span>
                  </div>
                  <div className="h-32 rounded-xl bg-slate-950/80 border border-white/5 relative flex items-center justify-center overflow-hidden">
                    {/* Medium footprint circle */}
                    <div className="w-18 h-18 rounded-full border-2 border-dashed border-orange-400 bg-orange-500/25 flex items-center justify-center">
                      <span className="text-[10px] font-mono text-orange-200">~180 km zone</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="font-semibold text-white">Coastal Corridor Focus</div>
                    <p className="text-[11px] text-slate-400">
                      Spread narrows. Threat box tightens on northern Odisha and West Bengal districts.
                    </p>
                    <div className="font-mono text-[10px] text-orange-400 pt-1">
                      FSS Skill = 0.68 &bull; Evacuation Prep
                    </div>
                  </div>
                </div>

                {/* Day 2 Panel */}
                <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/50 space-y-3 shadow-glow-orange">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-red-400 font-bold">DAY 2 (+48h)</span>
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                      Extreme Warning
                    </span>
                  </div>
                  <div className="h-32 rounded-xl bg-slate-950/80 border border-white/5 relative flex items-center justify-center overflow-hidden">
                    {/* Tight landfall footprint circle */}
                    <div className="w-10 h-10 rounded-full border-2 border-red-500 bg-red-600/40 flex items-center justify-center animate-ping" />
                    <div className="w-10 h-10 rounded-full border border-red-400 bg-red-600/60 flex items-center justify-center absolute">
                      <span className="text-[9px] font-mono text-white font-bold">~60 km</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="font-semibold text-white">Pinpoint Landfall Footprint</div>
                    <p className="text-[11px] text-slate-400">
                      Tight eye-wall and storm surge hazard polygon targeted on Puri &amp; Paradip corridor.
                    </p>
                    <div className="font-mono text-[10px] text-red-400 pt-1 font-bold">
                      FSS Skill = 0.89 &bull; Actionable Evacuation
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200">
                <strong>Forecaster Protection:</strong> By aligning polygon radius directly with the model&apos;s verified spatial skill, MEGHA-DRISHTI prevents false precision at long ranges while delivering decisive pinpoint guidance near landfall.
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
