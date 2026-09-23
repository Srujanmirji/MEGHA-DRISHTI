import React, { useState } from 'react';
import { Database, Search, Cpu, Compass, Server, Monitor, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

interface NodeInfo {
  id: string;
  name: string;
  sub: string;
  tech: string;
  detail: string;
  spec: string;
}

export const ArchitectureFlow: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('diffusion');

  const nodes: NodeInfo[] = [
    {
      id: 'nepsg',
      name: 'NEPS-G Ensemble',
      sub: 'Raw Numerical NWP',
      tech: 'xarray · Dask · GRIB2 Decoders',
      detail: '23-member operational global ensemble forecast on 12 km grid ingested at 00 and 12 UTC cycles.',
      spec: '10-day horizon · 23 members · 12 km resolution'
    },
    {
      id: 'detect',
      name: 'Detect & Track',
      sub: 'Anomaly Mining',
      tech: 'SciPy · NumPy · 4D Spatiotemporal DBSCAN',
      detail: 'Compares ensemble distributions against 20-year M-climate reforecasts to isolate high-EFI hazard clusters.',
      spec: 'EFI & SOT calculation · 4D contiguous clustering'
    },
    {
      id: 'diffusion',
      name: 'Diffusion AI (CorrDiff)',
      sub: 'Generative Super-Res',
      tech: 'PyTorch · NVIDIA PhysicsNeMo · CUDA',
      detail: 'Conditional score-based diffusion model downscales all 23 members individually to 5 km while preserving physical energy spectra.',
      spec: 'Trained on 4 km NEPS-R · Preserves convective peaks'
    },
    {
      id: 'footprint',
      name: 'Footprint Engine',
      sub: 'Uncertainty Sizing',
      tech: 'Shapely · GeoPandas · FSS Calibration',
      detail: 'Calibrates spatial hazard polygons against verified Fractions Skill Scores by lead-time horizon.',
      spec: 'Dynamic radius scaling · Lead-time skill calibration'
    },
    {
      id: 'api',
      name: 'Guidance API',
      sub: 'Standardized Ingestion',
      tech: 'FastAPI · PostGIS · Pydantic · GeoJSON',
      detail: 'Publishes machine-readable advisories with confidence metrics and vector polygons for IMD workstations.',
      spec: '<120ms response time · Full GeoJSON polygon export'
    },
    {
      id: 'dashboard',
      name: 'Forecaster Console',
      sub: 'Mission Control UI',
      tech: 'React 18 · TypeScript · MapLibre GL · Three.js',
      detail: 'High-performance interactive 5 km dashboard with lead-time playback, spaghetti tracks, and verification diagnostics.',
      spec: '60 FPS WebGL · WCAG AA accessible · Full responsive'
    }
  ];

  const connectors = [
    'GRIB2 members',
    '4D threat boxes',
    '5 km members',
    'alert polygons',
    'JSON guidance'
  ];

  const currentNode = nodes.find((n) => n.id === activeNode) || nodes[2];

  return (
    <section className="w-full py-20 bg-[#060B18] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-medium">
            <Server className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>END-TO-END PIPELINE ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Integrated Scientific Workflow
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Data flows seamlessly from raw GRIB2 numerical model outputs to forecaster consoles via accelerated diffusion and skill-calibrated spatial geometry.
          </p>
        </div>

        {/* Animated Architecture Pipeline Diagram */}
        <div className="glass-panel p-6 sm:p-8 space-y-8">
          
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-white/10">
            <span>Hover or tap any pipeline node to inspect technical specifications:</span>
            <span className="hidden sm:inline text-[#F28C28]">
              Active: {currentNode.name}
            </span>
          </div>

          {/* Horizontal Nodes and Connectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative items-stretch">
            {nodes.map((node, idx) => {
              const isSelected = node.id === activeNode;
              return (
                <div key={node.id} className="relative flex flex-col justify-between">
                  <div
                    onMouseEnter={() => setActiveNode(node.id)}
                    onClick={() => setActiveNode(node.id)}
                    className={`h-full p-4 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-950/80 border-[#F28C28] shadow-glow-orange scale-102 z-10'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                        <span className="text-[#F28C28] font-bold">0{idx + 1}</span>
                        {idx === 2 ? (
                          <Cpu className="w-3.5 h-3.5 text-[#F28C28]" />
                        ) : idx === 5 ? (
                          <Monitor className="w-3.5 h-3.5 text-blue-400" />
                        ) : (
                          <Database className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                      <div className="font-heading font-bold text-sm text-white leading-tight">
                        {node.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        {node.sub}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-400 truncate">
                      {node.tech.split('·')[0]}
                    </div>
                  </div>

                  {/* Flow label between nodes (visible on md screens) */}
                  {idx < 5 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#060B18] border border-[#F28C28]/60 flex items-center justify-center shadow-sm">
                        <ArrowRight className="w-3 h-3 text-[#F28C28]" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Inter-Node Data Stream Flow Banner */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-wrap items-center justify-around text-xs font-mono text-slate-300 gap-3">
            {connectors.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F28C28] animate-ping" />
                <span className="text-[#F28C28] font-semibold">{c}</span>
                {i < connectors.length - 1 && <span className="text-slate-600 hidden sm:inline">&rarr;</span>}
              </div>
            ))}
          </div>

          {/* Node Detail Inspector Card */}
          <div className="p-6 rounded-2xl bg-blue-950/30 border border-blue-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F28C28]/20 border border-[#F28C28]/40 flex items-center justify-center text-[#F28C28]">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-lg">
                    {currentNode.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-400">
                    Technology Stack: <span className="text-blue-300">{currentNode.tech}</span>
                  </p>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#F28C28]">
                {currentNode.spec}
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {currentNode.detail}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
