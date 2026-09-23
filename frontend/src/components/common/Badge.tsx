import React from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { useApp } from './ThemeContext';

export const DemoDataBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useApp();
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase bg-amber-500/10 text-amber-400 border border-amber-500/25 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      {t('demoBadge')}
    </span>
  );
};

export const ForecasterAdvisoryNotice: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useApp();
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-sans bg-blue-950/60 text-blue-200 border border-blue-500/30 backdrop-blur-sm ${className}`}>
      <ShieldAlert className="w-3.5 h-3.5 text-blue-400 shrink-0" />
      <span>{t('alertWatermark')}</span>
    </div>
  );
};

export const SeverityChip: React.FC<{ severity: string }> = ({ severity }) => {
  const { t } = useApp();
  let color = 'bg-blue-900/60 text-blue-300 border-blue-600/40';
  let transKey = 'advisory';

  if (severity === 'Extreme Warning') {
    color = 'bg-red-950/80 text-red-300 border-red-500/50 animate-pulse-slow';
    transKey = 'extremeWarning';
  } else if (severity === 'Warning') {
    color = 'bg-amber-950/70 text-amber-300 border-amber-500/50';
    transKey = 'warning';
  } else if (severity === 'Watch') {
    color = 'bg-orange-950/60 text-orange-300 border-orange-500/40';
    transKey = 'watch';
  }

  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold tracking-wide uppercase border ${color}`}>
      {t(transKey)}
    </span>
  );
};

