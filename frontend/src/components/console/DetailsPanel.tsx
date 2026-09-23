import React, { useState } from 'react';
import { Activity, Layers, Compass, Award, Code, ChevronRight, ChevronLeft } from 'lucide-react';
import type { WeatherThreat, EnsembleMemberTrack } from '../../types/weather';
import { EvidenceTab } from './details/EvidenceTab';
import { MembersTab } from './details/MembersTab';
import { FootprintTab } from './details/FootprintTab';
import { VerificationTab } from './details/VerificationTab';
import { ApiTab } from './details/ApiTab';
import { useApp } from '../common/ThemeContext';

interface DetailsPanelProps {
  threat: WeatherThreat;
  members: EnsembleMemberTrack[];
  currentLeadTime: number;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({
  threat,
  members,
  currentLeadTime,
}) => {
  const { language, t } = useApp();
  const [activeTab, setActiveTab] = useState<'evidence' | 'members' | 'footprint' | 'verification' | 'api'>('evidence');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'evidence', label: t('evidence'), icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'members', label: t('members'), icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'footprint', label: t('footprint'), icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'verification', label: t('verification'), icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'api', label: t('api'), icon: <Code className="w-3.5 h-3.5" /> },
  ] as const;

  if (isCollapsed) {
    return (
      <div className="h-full bg-[#060B18] border-l border-white/10 flex flex-col items-center py-4 px-1 select-none z-20">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
          title="Expand Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="writing-vertical-rl text-xs font-mono text-slate-400 mt-6 tracking-widest uppercase">
          {language === 'hi' ? (threat.hindiName || threat.name) : threat.name}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-96 lg:w-[420px] h-full flex flex-col bg-[#060B18]/95 border-l border-white/10 select-none overflow-hidden shrink-0 z-20">
      
      {/* Top Threat Summary Header */}
      <div className="p-4 border-b border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#F28C28] uppercase font-bold tracking-wider">
            {t('dossierHeader')}
          </span>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Collapse panel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="font-heading font-bold text-white text-base leading-snug">
            {language === 'hi' ? (threat.hindiName || threat.name) : threat.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {threat.region}
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center justify-between bg-[#0B1426] p-1 rounded-xl border border-white/10 mt-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'evidence' && (
          <EvidenceTab
            threat={threat}
            currentLeadTime={currentLeadTime}
          />
        )}

        {activeTab === 'members' && (
          <MembersTab
            members={members}
            currentLeadTime={currentLeadTime}
          />
        )}

        {activeTab === 'footprint' && (
          <FootprintTab
            threat={threat}
            currentLeadTime={currentLeadTime}
          />
        )}

        {activeTab === 'verification' && (
          <VerificationTab
            threat={threat}
          />
        )}

        {activeTab === 'api' && (
          <ApiTab
            threat={threat}
            currentLeadTime={currentLeadTime}
          />
        )}
      </div>

    </aside>
  );
};
