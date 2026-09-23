import React from 'react';
import { AlertTriangle, Clock, Cpu, EyeOff, ShieldCheck } from 'lucide-react';

export const OperationalLimitations: React.FC = () => {
  const limitations = [
    {
      title: "Model Boundary Condition Dependency",
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      desc: "Because CorrDiff is a conditional diffusion model conditioned on coarse 12 km NEPS-G fields, severe systemic track errors in NEPS-G at Day 9 cannot be completely corrected if all 23 members miss the synoptic steering trough."
    },
    {
      title: "Convective Initiation Latency",
      icon: <Cpu className="w-4 h-4 text-blue-400" />,
      desc: "Isolated dry microbursts and sub-hourly cloudbursts occurring on scales smaller than 2 km remain challenging without dense Doppler Weather Radar (DWR) data assimilation."
    },
    {
      title: "Orographic Drag Representation",
      icon: <EyeOff className="w-4 h-4 text-[#F28C28]" />,
      desc: "Steep topography in the Western Ghats and Himalayan foothills produces localized rainshadow effects where high-wavenumber diffusion must be heavily regularized to prevent over-prediction."
    },
    {
      title: "Strict Forecaster Protocol",
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      desc: "MEGHA-DRISHTI outputs are strictly decision-support guidance for IMD / NCMRWF forecasters and do not replace statutory national bulletins or official disaster declarations."
    }
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6">
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>SCIENTIFIC INTEGRITY &amp; OPERATIONAL BOUNDARIES</span>
        </div>
        <h3 className="font-heading font-bold text-white text-xl">
          System Assumptions &amp; Limitations
        </h3>
        <p className="text-xs text-slate-300">
          In adherence to strict scientific ethics, we explicitly document operational constraints and known model boundaries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {limitations.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-white font-heading font-semibold text-sm">
              {item.icon}
              <span>{item.title}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
