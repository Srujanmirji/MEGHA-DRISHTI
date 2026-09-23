import React, { useEffect, useRef, useState } from 'react';
import { Layers, AlertTriangle, Eye, ShieldAlert, Check } from 'lucide-react';
import { drawWeatherTile } from '../../lib/canvas-generator';

export const PeakAveragingDemo: React.FC = () => {
  const [showMean, setShowMean] = useState(false);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Render the 23 small tiles
    canvasRefs.current.forEach((canvas, idx) => {
      if (!canvas) return;
      drawWeatherTile(canvas, idx, showMean ? 'mean' : '5km', 90, 90);
    });

    // Render the main preview canvas
    if (mainCanvasRef.current) {
      drawWeatherTile(mainCanvasRef.current, 0, showMean ? 'mean' : '5km', 240, 240);
    }
  }, [showMean]);

  return (
    <section className="w-full py-20 bg-[#060B18] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>THE ENSEMBLE AVERAGING TRAP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Peaks Get Averaged Away
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            In standard NWP workflows, forecasters frequently inspect the &ldquo;ensemble mean&rdquo; to reduce noise. But taking an arithmetic average of 23 spatial tracks smears intense, localized convective rainfall into a broad, pale, harmless-looking puddle.
          </p>
        </div>

        {/* Interactive Comparison Card */}
        <div className="glass-panel p-6 sm:p-8 space-y-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <h3 className="font-heading font-bold text-white text-lg">
                Interactive 23-Member Demonstration
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Click the toggle below to witness how averaging destroys catastrophic extreme signals.
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => setShowMean(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  !showMean
                    ? 'bg-[#0070C0] text-white shadow-glow-blue'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>23 Individual Members (Sharp 5 km)</span>
              </button>

              <button
                onClick={() => setShowMean(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  showMean
                    ? 'bg-[#F28C28] text-white shadow-glow-orange'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Show Ensemble Mean (Blurred)</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Main Canvas + 23 Member Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Big Zoom View */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/10 text-center space-y-4">
              <div className="text-xs font-mono font-medium text-slate-300">
                {showMean ? 'COMPUTED ENSEMBLE MEAN (23 MEMBERS)' : 'SAMPLE MEMBER CONVECTIVE DETAIL (5 KM)'}
              </div>

              <div className="relative rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <canvas
                  ref={mainCanvasRef}
                  width={240}
                  height={240}
                  className="w-56 h-56 block bg-[#0B1426]"
                />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-white">
                  {showMean ? 'Grid: Blurred Mean' : 'Grid: 5.0 km CorrDiff'}
                </div>
              </div>

              {/* Peak Value Comparison */}
              <div className="w-full space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs font-mono border-b border-white/10 pb-1.5">
                  <span className="text-slate-400">Peak Rainfall Signal:</span>
                  <span className={`font-bold ${showMean ? 'text-amber-400' : 'text-red-400'}`}>
                    {showMean ? '62 mm / 24h' : '294 mm / 24h'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Hazard Classification:</span>
                  <span className="font-semibold text-white">
                    {showMean ? 'Moderate Rain (Missed Alert!)' : 'Extreme Flash Flood / Inundation'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 italic">
                {showMean
                  ? '⚠️ Critical Warning: 79% of local peak intensity was erased by the arithmetic mean.'
                  : '✓ Pinpoint core intact: high-resolution diffusion preserves localized extreme tails.'}
              </div>
            </div>

            {/* Right Column: 23 Member Tiles */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>NEPS-G 23 Ensemble Members</span>
                <span>{showMean ? 'Synchronized to Ensemble Mean' : 'Individual 5 km Realizations'}</span>
              </div>

              {/* 23 Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 p-3 rounded-2xl bg-black/30 border border-white/5">
                {Array.from({ length: 23 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center space-y-1 p-1 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                    onClick={() => {
                      if (mainCanvasRef.current) {
                        drawWeatherTile(mainCanvasRef.current, i, showMean ? 'mean' : '5km', 240, 240);
                      }
                    }}
                  >
                    <canvas
                      ref={(el) => {
                        canvasRefs.current[i] = el;
                      }}
                      width={90}
                      height={90}
                      className="w-full aspect-square rounded block bg-[#0B1426] transition-transform group-hover:scale-105"
                    />
                    <span className="font-mono text-[10px] text-slate-400 group-hover:text-white">
                      M{String(i).padStart(2, '0')}
                    </span>
                  </div>
                ))}

                {/* Slot 24: Info chip */}
                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/[0.04] border border-dashed border-white/10 text-center">
                  <span className="font-mono text-[10px] text-[#F28C28] font-bold">23/23</span>
                  <span className="text-[9px] text-slate-400">Members</span>
                </div>
              </div>

              {/* Caption */}
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#F28C28] shrink-0" />
                <span>
                  <strong>Core takeaway:</strong> Averaging an ensemble blurs the extremes forecasters need. MEGHA-DRISHTI downscales each member individually, then computes the Extreme Forecast Index (EFI) to preserve true risk.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
