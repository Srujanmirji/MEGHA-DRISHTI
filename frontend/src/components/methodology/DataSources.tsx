import React from 'react';
import { Database, Server, HardDrive, CheckCircle2 } from 'lucide-react';

export const DataSources: React.FC = () => {
  const sources = [
    {
      name: "NEPS-G (Global Ensemble)",
      institution: "NCMRWF / MoES",
      resolution: "12 km horizontal grid",
      horizon: "Days 0–10 (+240 hours)",
      members: "23 members (1 control + 22 perturbed)",
      role: "Primary operational ensemble input. Ingested as GRIB2 files twice daily (00 and 12 UTC cycles).",
      variables: "MSLP, U/V 850 & 200 hPa, 2m Temperature, 24h Accumulated Rainfall, CAPE"
    },
    {
      name: "NEPS-R (Regional Ensemble)",
      institution: "NCMRWF / MoES",
      resolution: "4 km convective-permitting grid",
      horizon: "Days 0–3 (+72 hours)",
      members: "12 members",
      role: "High-resolution ground truth training target for the NVIDIA PhysicsNeMo CorrDiff diffusion model.",
      variables: "Simulated Radar Reflectivity, Convective Updraft Velocities, Orographic Precipitation"
    },
    {
      name: "IMDAA (Atmospheric Reanalysis)",
      institution: "NCMRWF & IMD in collaboration with UK Met Office",
      resolution: "12 km reanalysis grid (1979–present)",
      horizon: "40+ Year Historical Climatology",
      members: "Deterministic Reanalysis",
      role: "Establishes the 20-year Model Climate (M-climate) quantiles required for EFI and Shift of Tails calculations.",
      variables: "Historical extreme percentiles (90th, 95th, 99th, 99.5th) per calendar pentad"
    },
    {
      name: "IPED (Daily Gridded Rainfall)",
      institution: "IMD & NCMRWF",
      resolution: "0.25° x 0.25° calibrated grid",
      horizon: "Daily gauge-blended analysis",
      members: "Merged gauge + satellite observations",
      role: "Independent verification target for tail Quantile-Quantile (Q-Q) plots and Fractions Skill Score (FSS) validation.",
      variables: "24-hour rainfall totals across 3,500+ automatic weather stations"
    }
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6">
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono">
          <Database className="w-3.5 h-3.5 text-[#F28C28]" />
          <span>DATA PROVENANCE &amp; NWP INTEGRATION</span>
        </div>
        <h3 className="font-heading font-bold text-white text-xl">
          Authoritative Operational Datasets
        </h3>
        <p className="text-xs text-slate-300">
          MEGHA-DRISHTI is built entirely on validated Indian meteorological datasets provided by NCMRWF and IMD under the Ministry of Earth Sciences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((s, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-heading font-bold text-white text-base">
                  {s.name}
                </h4>
                <span className="text-[11px] font-mono text-[#F28C28]">
                  {s.institution}
                </span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                {s.resolution}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {s.role}
            </p>

            <div className="pt-2 border-t border-white/5 space-y-1 font-mono text-[10px] text-slate-400">
              <div>
                <strong className="text-slate-300">Operational Horizon:</strong> {s.horizon}
              </div>
              <div>
                <strong className="text-slate-300">Ensemble Configuration:</strong> {s.members}
              </div>
              <div className="truncate">
                <strong className="text-slate-300">Key Variables:</strong> {s.variables}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
