import React from 'react';
import { InteractiveEfiExplainer } from '../components/methodology/InteractiveEfiExplainer';
import { DataSources } from '../components/methodology/DataSources';
import { OperationalLimitations } from '../components/methodology/OperationalLimitations';
import { ReferencesList } from '../components/methodology/ReferencesList';
import { FileText, Cpu, ArrowRight } from 'lucide-react';

interface MethodologyPageProps {
  onNavigate: (route: string) => void;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-screen bg-[#060B18] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-medium">
            <FileText className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>SCIENTIFIC ARCHITECTURE &amp; STATISTICAL FORMULATION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Scientific Methodology &amp; Mathematical Rigor
          </h1>

          <p className="text-base text-slate-300 leading-relaxed font-sans">
            How MEGHA-DRISHTI combines 20-year M-climate climatology, conditional generative diffusion (CorrDiff), and spatial Fractions Skill Score (FSS) calibration to sharpen extreme weather forecasting without false precision.
          </p>
        </div>

        {/* 1. Interactive EFI Sandbox */}
        <InteractiveEfiExplainer />

        {/* 2. Core 3 Stages Detailed Scientific Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Stage 1 */}
          <div className="glass-panel p-6 space-y-3">
            <span className="font-mono text-xs text-[#F28C28] font-bold">STAGE 01</span>
            <h3 className="font-heading font-bold text-white text-lg">
              Spatiotemporal Anomaly Clustering
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every 12h forecast field is projected onto local cumulative distribution functions derived from 20 years of IMDAA reanalysis. Grid points with an integrated EFI &gt; 0.70 are grouped into 4D spacetime bounding volumes using a density-based spatial clustering algorithm (DBSCAN), separating true synoptic signals from isolated model artifacts.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="glass-panel p-6 space-y-3">
            <span className="font-mono text-xs text-[#F28C28] font-bold">STAGE 02</span>
            <h3 className="font-heading font-bold text-white text-lg">
              Individual Member Diffusion (CorrDiff)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Rather than computing the ensemble mean, MEGHA-DRISHTI feeds all 23 members through a residual score-based generative diffusion network. Trained on 4 km NEPS-R regional simulations, the model learns the physical multiscale cascade of turbulent kinetic energy ($k^{-5/3}$), restoring localized convective eyewalls and cloudburst cells at ~5 km grid spacing.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="glass-panel p-6 space-y-3">
            <span className="font-mono text-xs text-[#F28C28] font-bold">STAGE 03</span>
            <h3 className="font-heading font-bold text-white text-lg">
              Skill-Calibrated Footprint Sizing
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To protect forecasters from misleading hyper-precision at Day 8, the alert polygon radius R(t) is formulated as a function of the operational Fractions Skill Score R(t) = R₀ / &radic;(FSS(t)). As lead time diminishes and predictability skill sharpens, the uncertainty envelope contracts smoothly into a pinpoint coastal landfall zone.
            </p>
          </div>

        </div>

        {/* 3. Authoritative Data Sources */}
        <DataSources />

        {/* 4. Assumptions and Limitations */}
        <OperationalLimitations />

        {/* 5. Peer-Reviewed Academic Literature */}
        <ReferencesList />

        {/* Bottom CTA to Forecaster Console */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-950 via-[#0B1426] to-slate-950 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glow-blue">
          <div>
            <h3 className="font-heading font-bold text-white text-xl">
              Inspect Live Operational Realizations
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Experience the 5 km downscaled members, lead-time scrubber, and API payloads in the mission control console.
            </p>
          </div>

          <button
            onClick={() => {
              onNavigate('/console');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0070C0] to-[#F28C28] text-white font-semibold text-xs shadow-glow-orange hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Launch Forecaster Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
