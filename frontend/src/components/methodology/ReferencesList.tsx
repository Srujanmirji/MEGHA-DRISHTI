import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

export const ReferencesList: React.FC = () => {
  const references = [
    {
      authors: "Lalaurette, F.",
      year: "2003",
      title: "Early detection of abnormal weather conditions using a probabilistic extreme forecast index.",
      journal: "Quarterly Journal of the Royal Meteorological Society, 129(594), 3041–3057.",
      doi: "10.1256/qj.02.138",
      link: "https://doi.org/10.1256/qj.02.138"
    },
    {
      authors: "Petroliagis, T. I., & Pinson, P.",
      year: "2014",
      title: "Early model based guidance for extreme weather events: Application of ECMWF's extreme forecast index for storm surges.",
      journal: "Natural Hazards and Earth System Sciences, 14(8), 2211–2222.",
      doi: "10.5194/nhess-14-2211-2014",
      link: "https://doi.org/10.5194/nhess-14-2211-2014"
    },
    {
      authors: "Mardani, M., et al. (NVIDIA PhysicsNeMo Team)",
      year: "2023",
      title: "Residual Diffusion Modeling for Km-scale Atmospheric Downscaling (CorrDiff).",
      journal: "arXiv preprint arXiv:2309.15214; NVIDIA Earth-2 Technical Paper.",
      doi: "arXiv:2309.15214",
      link: "https://arxiv.org/abs/2309.15214"
    },
    {
      authors: "Roberts, N. M., & Lean, H. W.",
      year: "2008",
      title: "Scale-selective verification of rainfall accumulations from high-resolution forecasts of convective events.",
      journal: "Monthly Weather Review, 136(1), 78–97.",
      doi: "10.1175/2007MWR2123.1",
      link: "https://doi.org/10.1175/2007MWR2123.1"
    },
    {
      authors: "Ashrit, R., et al. (NCMRWF Team)",
      year: "2020",
      title: "NCMRWF Regional Ensemble Prediction System (NEPS-R): System Architecture and Evaluation.",
      journal: "NCMRWF Technical Report No. NMRF/TR/02/2020, Ministry of Earth Sciences, India.",
      doi: "NCMRWF/TR/2020",
      link: "https://www.ncmrwf.gov.in"
    }
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6">
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5 text-[#F28C28]" />
          <span>ACADEMIC FOUNDATION &amp; PEER-REVIEWED LITERATURE</span>
        </div>
        <h3 className="font-heading font-bold text-white text-xl">
          Scientific References
        </h3>
        <p className="text-xs text-slate-300">
          Theoretical equations and diffusion models implemented in MEGHA-DRISHTI derive from the following publications.
        </p>
      </div>

      <div className="space-y-3">
        {references.map((ref, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1 max-w-3xl">
              <div className="font-semibold text-white">
                {ref.authors} ({ref.year}). {ref.title}
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                {ref.journal}
              </div>
            </div>

            <a
              href={ref.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#F28C28] border border-[#F28C28]/30 font-mono text-[11px] shrink-0 transition-colors"
            >
              <span>{ref.doi}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
