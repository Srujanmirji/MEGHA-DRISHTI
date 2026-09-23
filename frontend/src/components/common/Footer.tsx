import React, { useState } from 'react';
import { ShieldAlert, Code2, FileText, ExternalLink, Award, CheckCircle2, X } from 'lucide-react';
import { DemoDataBadge } from './Badge';

export const Footer: React.FC<{ onRouteChange: (route: string) => void }> = ({ onRouteChange }) => {
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <footer className="w-full bg-[#060B18] border-t border-white/10 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Brand & Project Info */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-white text-lg tracking-tight">
              MEGHA-DRISHTI
            </span>
            <span className="font-devanagari text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
              मेघ-दृष्टि
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F28C28]/20 text-[#F28C28] border border-[#F28C28]/30">
              SIH 2026
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            Physics-guided generative diffusion AI for finding, tracking, and sharpening extreme weather threats in India's 10-day ensemble forecast (NEPS-G) to ~5 km spatial resolution.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 items-center text-[11px] font-mono text-slate-400">
            <span className="px-2 py-1 rounded bg-white/5 border border-white/5">Problem Statement: PS 26078</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/5">Team: CodeX_2026 (ID: 159951)</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/5">NCMRWF &bull; MoES</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs uppercase tracking-wider text-slate-200">
            System Modules
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => { onRouteChange('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors"
              >
                Overview & Storytelling
              </button>
            </li>
            <li>
              <button 
                onClick={() => { onRouteChange('/console'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-[#F28C28] hover:text-white font-medium transition-colors flex items-center gap-1"
              >
                Forecaster Console (Live 5km) &rarr;
              </button>
            </li>
            <li>
              <button 
                onClick={() => { onRouteChange('/method'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors"
              >
                Interactive EFI & Methodology
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowReportModal(true)}
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3 h-3 text-blue-400" />
                Technical Whitepaper (Summary)
              </button>
            </li>
          </ul>
        </div>

        {/* Operational & Legal Notice */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs uppercase tracking-wider text-slate-200">
            Operational Protocol
          </h4>
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-[11px] text-blue-200 leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-blue-400 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Forecaster Guidance Only
            </div>
            Outputs provide probabilistic AI guidance directly to IMD/NCMRWF meteorologists. It is not an automated public warning or cyclone bulletin.
          </div>
          <DemoDataBadge />
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          &copy; 2026 MEGHA-DRISHTI &bull; Smart India Hackathon &bull; Team CodeX_2026
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowReportModal(true)}
            className="hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5 text-[#F28C28]" />
            SIH 2026 PS 26078
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            <Code2 className="w-3.5 h-3.5 text-[#F28C28]" />
            GitHub
          </a>
        </div>
      </div>

      {/* Technical Whitepaper Summary Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0B1426] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-[#F28C28]">
              <FileText className="w-4 h-4" />
              <span>SIH 2026 TECHNICAL DOSSIER &bull; PS 26078</span>
            </div>

            <h3 className="text-xl font-heading font-bold text-white">
              MEGHA-DRISHTI: Physics-Guided High-Resolution Weather Diffusion System
            </h3>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>System Summary:</strong> Current Indian numerical weather prediction operates with a critical gap in days 4–10: the regional 4 km high-resolution ensemble (NEPS-R) runs only up to Day 3, leaving days 4–10 solely dependent on the coarse 12 km global ensemble (NEPS-G). MEGHA-DRISHTI bridges this gap through a 3-stage pipeline.
              </p>

              <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1 font-mono text-[11px]">
                <div className="text-blue-400 font-semibold">Pipeline Architecture:</div>
                <div>1. Detect & Track: 4D Spatiotemporal clustering on M-Climate EFI anomalies.</div>
                <div>2. Downscale Every Member: NVIDIA PhysicsNeMo CorrDiff diffusion model downscaling each of the 23 members from 12 km to 5 km without ensemble mean blurring.</div>
                <div>3. Honest Alerts: Fractions Skill Score (FSS) calibrated threat footprints that dynamically expand with lead time uncertainty.</div>
              </div>

              <div className="p-3 rounded-lg bg-[#F28C28]/10 border border-[#F28C28]/25 text-[#F28C28]">
                <strong>Submitted By:</strong> Team CodeX_2026 (Team ID: 159951) for the Ministry of Earth Sciences (MoES) and NCMRWF.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0070C0] text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
