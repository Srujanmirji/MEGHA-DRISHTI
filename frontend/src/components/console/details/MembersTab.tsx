import React, { useEffect, useRef, useState } from 'react';
import { Layers, Maximize2, X, Sliders, Eye } from 'lucide-react';
import type { EnsembleMemberTrack } from '../../../types/weather';
import { drawWeatherTile, drawSplitComparison } from '../../../lib/canvas-generator';
import { useApp } from '../../common/ThemeContext';

interface MembersTabProps {
  members: EnsembleMemberTrack[];
  currentLeadTime: number;
}

export const MembersTab: React.FC<MembersTabProps> = ({
  members,
  currentLeadTime,
}) => {
  const { t } = useApp();
  const [resolutionMode, setResolutionMode] = useState<'5km' | '12km'>('5km');
  const [showMean, setShowMean] = useState(false);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [modalSplitRatio, setModalSplitRatio] = useState(0.5);

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);

  // Redraw all 23 member thumbnails whenever resolutionMode or showMean changes
  useEffect(() => {
    canvasRefs.current.forEach((canvas, idx) => {
      if (!canvas) return;
      const mode = showMean ? 'mean' : resolutionMode;
      drawWeatherTile(canvas, idx, mode, 70, 70);
    });
  }, [resolutionMode, showMean]);

  // Redraw modal split comparison whenever selectedMember or modalSplitRatio changes
  useEffect(() => {
    if (selectedMember !== null && modalCanvasRef.current) {
      drawSplitComparison(modalCanvasRef.current, modalSplitRatio, 460, 280);
    }
  }, [selectedMember, modalSplitRatio]);

  return (
    <div className="space-y-5 text-slate-200">
      
      {/* Toggles Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-white/10">
        <div>
          <h4 className="font-heading font-bold text-white text-sm">
            {t('downscaledMembers')}
          </h4>
          <p className="text-[11px] text-slate-400 font-mono">
            {showMean ? t('viewingMean') : (resolutionMode === '5km' ? t('viewing5km') : t('viewing12km'))}
          </p>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          {/* 12km vs 5km */}
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => {
                setShowMean(false);
                setResolutionMode('12km');
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                resolutionMode === '12km' && !showMean
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('twelveKm')}
            </button>
            <button
              onClick={() => {
                setShowMean(false);
                setResolutionMode('5km');
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                resolutionMode === '5km' && !showMean
                  ? 'bg-[#F28C28] text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('fiveKmAi')}
            </button>
          </div>

          {/* Show mean toggle */}
          <button
            onClick={() => setShowMean(!showMean)}
            className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
              showMean
                ? 'bg-amber-600/40 border-amber-500 text-amber-300 font-bold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>{t('mean')}</span>
          </button>
        </div>
      </div>

      {/* 5x5 Grid of 23 Thumbnails */}
      <div className="grid grid-cols-5 gap-2 p-3 rounded-2xl bg-black/40 border border-white/10">
        {Array.from({ length: 23 }).map((_, idx) => {
          const isCtrl = idx === 0;
          return (
            <div
              key={idx}
              onClick={() => setSelectedMember(idx)}
              className="flex flex-col items-center p-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#F28C28]/60 hover:bg-[#101C36] cursor-pointer transition-all group"
            >
              <canvas
                ref={(el) => {
                  canvasRefs.current[idx] = el;
                }}
                width={70}
                height={70}
                className="w-full aspect-square rounded-lg block bg-[#0B1426] transition-transform group-hover:scale-105"
              />
              <div className="w-full flex items-center justify-between text-[9px] font-mono mt-1 text-slate-400 group-hover:text-white px-0.5">
                <span>M{String(idx).padStart(2, '0')}</span>
                {isCtrl && <span className="text-[#F28C28] font-bold">CTRL</span>}
              </div>
            </div>
          );
        })}

        {/* 24th/25th placeholders */}
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center font-mono text-[10px] text-slate-500">
          <span>{t('realizations')}</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center font-mono text-[10px] text-[#F28C28]">
          <span>CorrDiff 5km</span>
        </div>
      </div>

      <div className="text-[11px] font-mono text-slate-400 italic">
        {t('clickTip')}
      </div>

      {/* Enlargement Modal with Before/After Slider */}
      {selectedMember !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0B1426] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="font-mono text-xs text-[#F28C28] font-bold">
                MEMBER {String(selectedMember).padStart(2, '0')} {t('memberInspection')}
              </span>
              <h3 className="font-heading font-bold text-white text-lg">
                {t('twelveVsFive')}
              </h3>
            </div>

            {/* Split canvas */}
            <div
              className="relative w-full rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black cursor-ew-resize select-none"
              onPointerDown={() => (isDraggingRef.current = true)}
              onPointerUp={() => (isDraggingRef.current = false)}
              onPointerLeave={() => (isDraggingRef.current = false)}
              onPointerMove={(e) => {
                if (!isDraggingRef.current) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                setModalSplitRatio(x / rect.width);
              }}
            >
              <canvas
                ref={modalCanvasRef}
                width={460}
                height={280}
                className="w-full h-auto block"
              />

              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-300 pointer-events-none">
                12 km NEPS-G
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#F28C28] text-[10px] font-mono font-bold text-white pointer-events-none">
                ~5 km CorrDiff AI
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-xl bg-black/40 border border-white/5">
              <div>
                <span className="text-slate-500 block text-[10px]">{t('predictedLandfall')}</span>
                <span className="text-white font-semibold">
                  {members[selectedMember]?.landfallDistrict || 'Odisha Coast'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">{t('landfallTime')}</span>
                <span className="text-slate-300">
                  {members[selectedMember]?.landfallTime || '+108h'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
              >
                {t('closeInspector')}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
