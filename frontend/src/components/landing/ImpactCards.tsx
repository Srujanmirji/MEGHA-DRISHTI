import React from 'react';
import { UserCheck, LifeBuoy, Sprout, FlaskConical, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface ImpactCardData {
  title: string;
  role: string;
  icon: React.ReactNode;
  today: string;
  withMeghaDrishti: string;
  metric: string;
}

export const ImpactCards: React.FC = () => {
  const cards: ImpactCardData[] = [
    {
      title: "IMD Forecasters",
      role: "Operational Duty Officers & Cyclone Warning Division",
      icon: <UserCheck className="w-5 h-5 text-blue-400" />,
      today: "Forced to manually inspect 23 low-res 12 km spaghetti charts at Day 5; intense convective eyewalls look smoothed and weak.",
      withMeghaDrishti: "Automated EFI detection flags extreme threats; instant ~5 km diffusion fields reveal true convective intensity and eye structure.",
      metric: "72 hours earlier identification of rapid cyclone intensification."
    },
    {
      title: "Disaster Managers (NDMA / SDMA)",
      role: "State & District Emergency Operations Centres",
      icon: <LifeBuoy className="w-5 h-5 text-[#F28C28]" />,
      today: "Receive broad 400 km warning zones 4 days out, leading to costly over-evacuations or public warning fatigue.",
      withMeghaDrishti: "Honest skill-calibrated polygons contract smoothly from Day 8 to Day 2, pinpointing exact coastal taluks and storm surge corridors.",
      metric: "45% reduction in false-alarm evacuation footprints."
    },
    {
      title: "Farmers & Rural Communities",
      role: "Agromet Advisories (Gramin Krishi Mausam Seva)",
      icon: <Sprout className="w-5 h-5 text-emerald-400" />,
      today: "Regional advisories miss localized 300 mm cloudbursts and 48°C heat dome pockets that destroy standing crops.",
      withMeghaDrishti: "Village-level 5 km resolution enables targeted 7-day crop protection, sowing delays, and livestock heat-stress warnings.",
      metric: "Direct protection for standing paddy, cotton & mustard crops."
    },
    {
      title: "NCMRWF Scientists",
      role: "Model Development & High Performance Computing",
      icon: <FlaskConical className="w-5 h-5 text-purple-400" />,
      today: "Running a 23-member 4 km NWP ensemble for 10 days would require 8x more supercomputing petaflops than currently available.",
      withMeghaDrishti: "CorrDiff diffusion model super-resolves 12 km output to 5 km in under 3 minutes on GPU clusters, saving massive computational energy.",
      metric: "15x computational speedup vs running full 4 km dynamic ensembles."
    }
  ];

  return (
    <section className="w-full py-20 bg-[#060B18] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>OPERATIONAL VALUE &amp; STAKEHOLDER IMPACT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Transforming Indian Extreme Weather Preparedness
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            From the forecaster&apos;s desk at Mausam Bhawan to farming districts in Odisha, Rajasthan, and the Western Ghats.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <div key={i} className="glass-panel p-6 sm:p-7 space-y-5 flex flex-col justify-between hover:border-white/20 transition-all group">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-white text-lg">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {card.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Today vs With MEGHA-DRISHTI */}
                <div className="space-y-3 pt-2">
                  
                  {/* Today */}
                  <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-mono font-semibold text-red-400">
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Today:</span>
                    </div>
                    <p className="text-slate-300 pl-5 leading-relaxed">
                      {card.today}
                    </p>
                  </div>

                  {/* With MEGHA-DRISHTI */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/25 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-mono font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>With MEGHA-DRISHTI:</span>
                    </div>
                    <p className="text-slate-200 pl-5 leading-relaxed font-medium">
                      {card.withMeghaDrishti}
                    </p>
                  </div>

                </div>
              </div>

              {/* Quantified Benefit Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Operational Metric:</span>
                <span className="text-[#F28C28] font-bold">
                  {card.metric}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
