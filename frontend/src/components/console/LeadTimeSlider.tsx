import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Clock, FastForward, Keyboard } from 'lucide-react';
import { formatLeadTime } from '../../lib/utils';
import { useApp } from '../common/ThemeContext';

interface LeadTimeSliderProps {
  currentLeadTime: number; // continuous 0 to 240
  onChangeLeadTime: (hours: number) => void;
  validTime: string;
  className?: string;
}

export const LeadTimeSlider: React.FC<LeadTimeSliderProps> = ({
  currentLeadTime,
  onChangeLeadTime,
  validTime,
  className = '',
}) => {
  const { language, t } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<1 | 2>(1);

  const leadTimeRef = useRef(currentLeadTime);
  leadTimeRef.current = currentLeadTime;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const playSpeedRef = useRef(playSpeed);
  playSpeedRef.current = playSpeed;

  const onChangeLeadTimeRef = useRef(onChangeLeadTime);
  onChangeLeadTimeRef.current = onChangeLeadTime;

  // Step backwards to previous 12h keyframe
  const handleStepBack = useCallback(() => {
    const prev = Math.max(0, Math.floor((leadTimeRef.current - 0.1) / 12) * 12);
    onChangeLeadTimeRef.current(prev);
  }, []);

  // Step forward to next 12h keyframe
  const handleStepForward = useCallback(() => {
    const next = Math.min(240, Math.ceil((leadTimeRef.current + 0.1) / 12) * 12);
    onChangeLeadTimeRef.current(next);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Global Keyboard Listener for ArrowLeft, ArrowRight, and Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleStepBack();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleTogglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStepBack, handleStepForward, handleTogglePlay]);

  // Smooth requestAnimationFrame playback loop
  useEffect(() => {
    if (!isPlaying) return;

    let lastTimestamp: number | null = null;
    let animId: number;

    const loop = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaSec = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // Rate: At 1x speed, advances 12 forecast hours every 1.2 seconds (10 h/s).
      // At 2x speed, advances 24 forecast hours every 1.2 seconds (20 h/s).
      const hoursPerSec = playSpeedRef.current === 1 ? 10 : 22;
      let nextLeadTime = leadTimeRef.current + hoursPerSec * deltaSec;

      if (nextLeadTime >= 240) {
        nextLeadTime = 0; // Seamless loop
      }

      onChangeLeadTimeRef.current(Number(nextLeadTime.toFixed(2)));
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className={`glass-panel p-4 bg-[#0B1426]/90 border border-white/10 select-none backdrop-blur-xl ${className}`}>
      
      {/* Top row: Current Lead Time Display + Valid Timestamp + Player Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        
        {/* Large Prominent Lead-Time Info */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#F28C28]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                {formatLeadTime(Math.round(currentLeadTime))}
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#F28C28]/20 text-[#F28C28] border border-[#F28C28]/30 font-bold">
                {t('forecastHorizon')}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              {t('validTime')} <span className="text-slate-200 font-semibold">{validTime}</span>
            </div>
          </div>
        </div>

        {/* Media Player Controls */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={() => onChangeLeadTime(0)}
            title="Reset to 0h"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Back (-12h) */}
          <button
            onClick={handleStepBack}
            disabled={currentLeadTime <= 0}
            title="Step Back -12h (or press ← Arrow)"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0070C0] to-[#F28C28] text-white font-semibold text-xs shadow-glow-orange hover:brightness-110 active:scale-95 transition-all"
            title="Toggle Play / Pause (or press Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>{t('pause')}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{t('playSmooth')}</span>
              </>
            )}
          </button>

          {/* Step Forward (+12h) */}
          <button
            onClick={handleStepForward}
            disabled={currentLeadTime >= 240}
            title="Step Forward +12h (or press → Arrow)"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Speed Toggle (1x / 2x) */}
          <button
            onClick={() => setPlaySpeed(playSpeed === 1 ? 2 : 1)}
            title="Toggle playback speed"
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 border border-white/10 transition-colors"
          >
            {playSpeed}x
          </button>
        </div>

      </div>

      {/* Slider Scrubber Track (Smooth Continuous Dragging) */}
      <div className="pt-3 space-y-2">
        <input
          type="range"
          min={0}
          max={240}
          step={0.5}
          value={currentLeadTime}
          onChange={(e) => onChangeLeadTime(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F28C28]"
        />

        {/* Day Tick Labels and Keyboard Hints */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-1">
          <div className="flex gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
              <span
                key={d}
                onClick={() => onChangeLeadTime(d * 24)}
                className={`cursor-pointer hover:text-white transition-colors ${
                  Math.round(currentLeadTime / 24) === d ? 'text-[#F28C28] font-bold' : ''
                }`}
              >
                D{d}
              </span>
            ))}
          </div>

          {/* Keyboard shortcut legend */}
          <div className="hidden sm:flex items-center gap-1.5 text-slate-500 font-mono text-[9px]">
            <Keyboard className="w-3 h-3 text-[#F28C28]" />
            {language === 'hi' ? (
              <span>कदम बढ़ाने के लिए <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-300">←</kbd> <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-300">→</kbd> दबाएं, चलाने के लिए <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-300">Space</kbd></span>
            ) : (
              <span>Use <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-300">←</kbd> <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-300">→</kbd> to step, <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-300">Space</kbd> to play</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
