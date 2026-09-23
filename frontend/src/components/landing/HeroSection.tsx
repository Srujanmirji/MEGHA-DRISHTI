import React, { Suspense } from 'react';
import { ArrowRight, Compass, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
import { DemoDataBadge } from '../common/Badge';

const EarthGlobeLazy = React.lazy(() =>
  import('../three/EarthGlobe').then((m) => ({ default: m.EarthGlobe }))
);

interface HeroSectionProps {
  onOpenConsole: () => void;
  onExploreHowItWorks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenConsole,
  onExploreHowItWorks,
}) => {
  return (
    <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#060B18]">
      {/* 3D Earth Globe Canvas Background/Right */}
      <div className="absolute inset-0 z-0 opacity-80 md:opacity-95">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#060B18]">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-3" />
              <p className="text-xs font-mono text-slate-400 tracking-wider">
                INITIALIZING 3D SPHERICAL MODEL...
              </p>
            </div>
          }
        >
          <EarthGlobeLazy />
        </Suspense>
      </div>

      {/* Radial vignette overlay for readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#060B18] via-[#060B18]/75 to-transparent pointer-events-none md:w-3/4" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#060B18] via-transparent to-[#060B18]/40 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="max-w-2xl space-y-6">
          
          {/* Top Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>AI ENSEMBLE DOWNSCALING &bull; 5 KM RESOLUTION</span>
            </div>
            <DemoDataBadge />
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight text-white leading-[1.1]">
            See the storm{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-[#F28C28] bg-clip-text text-transparent">
              before it sharpens.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            MEGHA-DRISHTI finds extreme weather in India&apos;s 10-day ensemble forecast, tracks it, and sharpens every forecast to ~5 km — without averaging away the peaks.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onOpenConsole}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0070C0] to-[#F28C28] text-white text-sm font-semibold shadow-glow-orange hover:shadow-glow-orange hover:brightness-110 active:scale-95 transition-all group"
            >
              <span>Open Forecaster Console</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onExploreHowItWorks}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-sm font-medium backdrop-blur-md transition-all active:scale-95"
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>How it works</span>
            </button>
          </div>

          {/* Hackathon attribution line */}
          <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#F28C28]" />
            <span>SIH 2026 &bull; PS 26078 &bull; NCMRWF / MoES &bull; Team CodeX_2026</span>
          </div>

          {/* Live System Capabilities Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="font-mono text-xl font-bold text-white">0–10d</div>
              <div className="text-[11px] text-slate-400">Forecast Horizon</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="font-mono text-xl font-bold text-[#F28C28]">~5 km</div>
              <div className="text-[11px] text-slate-400">Diffusion Grid</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="font-mono text-xl font-bold text-blue-400">23</div>
              <div className="text-[11px] text-slate-400">Ensemble Members</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="font-mono text-xl font-bold text-green-400">FSS</div>
              <div className="text-[11px] text-slate-400">Skill-Calibrated Alerts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <button
        onClick={onExploreHowItWorks}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-full text-slate-400 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll down to explore"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </section>
  );
};
