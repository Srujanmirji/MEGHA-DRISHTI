import React, { useState } from 'react';
import { Copy, Check, Code, ExternalLink, Download } from 'lucide-react';
import type { WeatherThreat } from '../../../types/weather';
import { weatherService } from '../../../lib/data';
import { useApp } from '../../common/ThemeContext';

interface ApiTabProps {
  threat: WeatherThreat;
  currentLeadTime: number;
}

export const ApiTab: React.FC<ApiTabProps> = ({
  threat,
  currentLeadTime,
}) => {
  const { t } = useApp();
  const [copied, setCopied] = useState(false);

  const payload = weatherService.generateGuidancePayload(threat, currentLeadTime);
  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `megha_drishti_${threat.id}_${currentLeadTime}h.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 text-slate-200">
      
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-heading font-bold text-white text-sm flex items-center gap-1.5">
            <Code className="w-4 h-4 text-[#F28C28]" />
            {t('apiTitle')}
          </h4>
          <p className="text-[11px] text-slate-400 font-mono">
            Endpoint: GET /api/v1/guidance/advisories/{threat.id}?lead_time={currentLeadTime}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            title={t('download')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t('copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t('copyJson')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Block Container */}
      <div className="relative rounded-xl overflow-hidden bg-black/70 border border-white/10 shadow-inner">
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0B1426] border-b border-white/10 text-[10px] font-mono text-slate-400">
          <span>application/geo+json</span>
          <span className="text-emerald-400">HTTP 200 OK &bull; 842 bytes</span>
        </div>

        <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[460px] leading-relaxed select-text">
          <code>{jsonString}</code>
        </pre>
      </div>

      <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>{t('wmoWis')}</span>
        <span className="text-[#F28C28]">{t('fastApiReady')}</span>
      </div>

    </div>
  );
};
