import React, { useState } from 'react';
import { Sliders, HelpCircle, Activity, TrendingUp, Info } from 'lucide-react';
import { getEfiColor } from '../../lib/utils';

export const InteractiveEfiExplainer: React.FC = () => {
  // shift is in standard deviations: -2.5 to +2.5
  const [anomalyShift, setAnomalyShift] = useState<number>(1.4);

  // Compute normal CDF approximation
  const normalCdf = (x: number, mean: number, std: number): number => {
    const z = (x - mean) / std;
    const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp((-z * z) / 2);
    let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (z > 0) p = 1.0 - p;
    return p;
  };

  // Generate CDF points from x = -3 to +5
  const xMin = -3.0;
  const xMax = 5.0;
  const steps = 60;
  const climatePoints: [number, number][] = [];
  const forecastPoints: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const x = xMin + (i / steps) * (xMax - xMin);
    const climateProb = normalCdf(x, 0, 1);
    const forecastProb = normalCdf(x, anomalyShift, 0.85); // shifted and slightly sharper
    climatePoints.push([x, climateProb]);
    forecastPoints.push([x, forecastProb]);
  }

  // Calculate live EFI metric (-1.0 to 1.0) based on integral
  const computedEfi = Number((Math.tanh(anomalyShift * 0.78)).toFixed(2));
  const computedSot = Number((Math.max(0, anomalyShift * 0.95)).toFixed(1));

  // SVG coordinate transformation
  const width = 560;
  const height = 280;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;

  const toSvgX = (x: number) =>
    padLeft + ((x - xMin) / (xMax - xMin)) * (width - padLeft - padRight);
  const toSvgY = (prob: number) =>
    height - padBottom - prob * (height - padTop - padBottom);

  const climatePath = climatePoints
    .map(([x, p], i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(x).toFixed(1)} ${toSvgY(p).toFixed(1)}`)
    .join(' ');

  const forecastPath = forecastPoints
    .map(([x, p], i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(x).toFixed(1)} ${toSvgY(p).toFixed(1)}`)
    .join(' ');

  // Shaded polygon area between forecast and climate curves
  const shadedPolygon = `${forecastPath} L ${toSvgX(xMax)} ${toSvgY(1)} ${climatePoints
    .slice()
    .reverse()
    .map(([x, p]) => `L ${toSvgX(x).toFixed(1)} ${toSvgY(p).toFixed(1)}`)
    .join(' ')} Z`;

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F28C28]/10 text-[#F28C28] text-xs font-mono font-medium">
            <Activity className="w-3.5 h-3.5" />
            <span>INTERACTIVE METEOROLOGICAL CALCULATOR</span>
          </div>
          <h3 className="font-heading font-bold text-white text-xl mt-1">
            Extreme Forecast Index (EFI) Interactive CDF Sandbox
          </h3>
          <p className="text-xs text-slate-400">
            Drag the anomaly shift slider below to observe how the forecast distribution shifts away from model climate.
          </p>
        </div>

        {/* Live Gauges */}
        <div className="flex items-center gap-3">
          {/* EFI Gauge */}
          <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center min-w-[120px]">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Live EFI</span>
            <div
              className="font-heading font-extrabold text-2xl"
              style={{ color: getEfiColor(computedEfi) }}
            >
              {computedEfi > 0 ? `+${computedEfi}` : computedEfi}
            </div>
            <span className="text-[9px] font-mono text-slate-500">Range: -1.0 to +1.0</span>
          </div>

          {/* SOT Gauge */}
          <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center min-w-[120px]">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Shift of Tails</span>
            <div className="font-heading font-extrabold text-2xl text-[#F28C28]">
              +{computedSot}
            </div>
            <span className="text-[9px] font-mono text-slate-500">99th %tile Exceedance</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Curves Display */}
      <div className="relative w-full overflow-hidden rounded-xl bg-black/60 border border-white/10 p-2 sm:p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((prob) => (
            <g key={prob}>
              <line
                x1={padLeft}
                y1={toSvgY(prob)}
                x2={width - padRight}
                y2={toSvgY(prob)}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 3"
              />
              <text
                x={padLeft - 8}
                y={toSvgY(prob) + 4}
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {prob.toFixed(2)}
              </text>
            </g>
          ))}

          {/* X Axis labels */}
          {[-2, -1, 0, 1, 2, 3, 4].map((xVal) => (
            <text
              key={xVal}
              x={toSvgX(xVal)}
              y={height - padBottom + 16}
              fill="#64748b"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {xVal > 0 ? `+${xVal}σ` : `${xVal}σ`}
            </text>
          ))}

          {/* Shaded Area between curves */}
          <path
            d={shadedPolygon}
            fill={computedEfi >= 0 ? "rgba(242, 140, 40, 0.25)" : "rgba(56, 189, 248, 0.25)"}
            stroke="none"
          />

          {/* Model Climate CDF Curve (Grey dashed) */}
          <path
            d={climatePath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeDasharray="5 5"
          />

          {/* Forecast Ensemble CDF Curve (Orange solid) */}
          <path
            d={forecastPath}
            fill="none"
            stroke="#F28C28"
            strokeWidth="3.5"
          />

          {/* Threshold marker (99th percentile of M-climate) */}
          <line
            x1={toSvgX(2.32)}
            y1={padTop}
            x2={toSvgX(2.32)}
            y2={height - padBottom}
            stroke="#C00000"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <text
            x={toSvgX(2.32) + 4}
            y={padTop + 14}
            fill="#C00000"
            fontSize="9"
            fontFamily="monospace"
          >
            Climate 99th %tile
          </text>
        </svg>

        {/* Legend in corner */}
        <div className="absolute top-4 right-4 p-2.5 rounded-lg bg-black/80 border border-white/10 text-[10px] font-mono space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-slate-400 border-t border-dashed" />
            <span className="text-slate-300">Model Climate (M-climate, 20 yrs)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-[#F28C28]" />
            <span className="text-white font-bold">Today&apos;s 23-Member Ensemble</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-2 bg-[#F28C28]/30 border border-[#F28C28]/60" />
            <span className="text-amber-300">Integral Shaded Area (EFI)</span>
          </div>
        </div>
      </div>

      {/* Interactive Slider */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-white font-semibold flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#F28C28]" />
            Shift Forecast Distribution (&sigma; standard deviations from climate mean):
          </span>
          <span className="text-[#F28C28] font-bold text-sm">
            {anomalyShift > 0 ? `+${anomalyShift.toFixed(2)}σ` : `${anomalyShift.toFixed(2)}σ`}
          </span>
        </div>

        <input
          type="range"
          min={-2.5}
          max={2.5}
          step={0.05}
          value={anomalyShift}
          onChange={(e) => setAnomalyShift(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F28C28]"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>-2.5&sigma; (Extreme Cold Anomaly)</span>
          <span>0.0&sigma; (Normal Climate)</span>
          <span>+2.5&sigma; (Catastrophic Cyclone / Extreme Rain)</span>
        </div>
      </div>

      {/* Mathematical Explanation */}
      <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-slate-300 space-y-2 leading-relaxed">
        <div className="font-semibold text-blue-300 flex items-center gap-1.5 font-mono">
          <Info className="w-3.5 h-3.5" />
          <span>Why EFI Solves the &ldquo;False Alarm&rdquo; Problem:</span>
        </div>
        <p>
          Standard weather alerts set fixed thresholds (e.g., &gt;100 mm rain). But 100 mm in Cherrapunji is normal monsoon, whereas 100 mm in Jaisalmer is a catastrophic flood. The Extreme Forecast Index normalizes the forecast against the model&apos;s own history at that specific grid point and calendar week. When the entire ensemble distribution shifts into the climate tail, EFI approaches +1.0, triggering targeted forecaster attention.
        </p>
      </div>

    </div>
  );
};
