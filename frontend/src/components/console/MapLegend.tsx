import React from 'react';
import { Eye, Layers, Compass } from 'lucide-react';
import { useApp } from '../common/ThemeContext';

interface MapLegendProps {
  layers: {
    efiHeatmap: boolean;
    threatTrack: boolean;
    memberSpaghetti: boolean;
    probabilityShading: boolean;
    footprintPolygon: boolean;
  };
  onToggleLayer: (key: keyof MapLegendProps['layers']) => void;
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({
  layers,
  onToggleLayer,
  className = '',
}) => {
  const { t } = useApp();

  return (
    <div className={`glass-panel p-3 text-xs space-y-3 select-none backdrop-blur-md bg-[#0B1426]/85 border-white/10 ${className}`}>
      
      {/* Legend Title */}
      <div className="flex items-center justify-between font-mono text-[11px] text-slate-300 pb-1 border-b border-white/10">
        <span className="flex items-center gap-1.5 font-bold">
          <Layers className="w-3.5 h-3.5 text-[#F28C28]" />
          {t('mapLayers')}
        </span>
      </div>

      {/* Layer Toggles */}
      <div className="space-y-1.5 font-mono text-[11px]">
        
        {/* Footprint Polygon */}
        <label className="flex items-center justify-between cursor-pointer hover:text-white text-slate-300">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded border border-red-500 bg-red-600/30 inline-block" />
            {t('alertFootprint')}
          </span>
          <input
            type="checkbox"
            checked={layers.footprintPolygon}
            onChange={() => onToggleLayer('footprintPolygon')}
            className="accent-[#F28C28] rounded cursor-pointer"
          />
        </label>

        {/* Threat Track */}
        <label className="flex items-center justify-between cursor-pointer hover:text-white text-slate-300">
          <span className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#F28C28] inline-block border-t border-dashed border-[#F28C28]" />
            {t('consensusTrack')}
          </span>
          <input
            type="checkbox"
            checked={layers.threatTrack}
            onChange={() => onToggleLayer('threatTrack')}
            className="accent-[#F28C28] rounded cursor-pointer"
          />
        </label>

        {/* 23 Member Spaghetti */}
        <label className="flex items-center justify-between cursor-pointer hover:text-white text-slate-300">
          <span className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-blue-400/60 inline-block" />
            {t('spaghettiTracks')}
          </span>
          <input
            type="checkbox"
            checked={layers.memberSpaghetti}
            onChange={() => onToggleLayer('memberSpaghetti')}
            className="accent-[#F28C28] rounded cursor-pointer"
          />
        </label>

        {/* EFI Anomaly Heatmap */}
        <label className="flex items-center justify-between cursor-pointer hover:text-white text-slate-300">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 via-amber-400 to-red-500 inline-block" />
            {t('efiHeatmap')}
          </span>
          <input
            type="checkbox"
            checked={layers.efiHeatmap}
            onChange={() => onToggleLayer('efiHeatmap')}
            className="accent-[#F28C28] rounded cursor-pointer"
          />
        </label>

        {/* Probability Shading */}
        <label className="flex items-center justify-between cursor-pointer hover:text-white text-slate-300">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-indigo-500/30 border border-indigo-400 inline-block" />
            {t('probEnvelope')}
          </span>
          <input
            type="checkbox"
            checked={layers.probabilityShading}
            onChange={() => onToggleLayer('probabilityShading')}
            className="accent-[#F28C28] rounded cursor-pointer"
          />
        </label>

      </div>

      {/* EFI Scale Bar */}
      <div className="pt-2 border-t border-white/10 space-y-1">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span>{t('efiScale')}</span>
          <span>0.5 &rarr; 1.0 (Peak)</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600" />
      </div>

    </div>
  );
};
