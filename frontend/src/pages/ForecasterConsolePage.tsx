import React, { useEffect, useState } from 'react';
import { ForecasterTopBar } from '../components/console/ForecasterTopBar';
import { ThreatBoard } from '../components/console/ThreatBoard';
import { WeatherMap } from '../components/console/WeatherMap';
import { DetailsPanel } from '../components/console/DetailsPanel';
import { weatherService } from '../lib/data';
import type { ForecastCycle, WeatherThreat, EnsembleMemberTrack } from '../types/weather';
import { Map, List, FileText } from 'lucide-react';

interface ForecasterConsolePageProps {
  onNavigate: (route: string) => void;
}

export const ForecasterConsolePage: React.FC<ForecasterConsolePageProps> = ({
  onNavigate,
}) => {
  const [cycles, setCycles] = useState<ForecastCycle[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState<string>('cycle-2020051500');
  const [threats, setThreats] = useState<WeatherThreat[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<WeatherThreat | null>(null);
  const [members, setMembers] = useState<EnsembleMemberTrack[]>([]);
  const [currentLeadTime, setCurrentLeadTime] = useState<number>(72); // Default to +72h (Day 3.0)

  // Mobile view mode
  const [mobileView, setMobileView] = useState<'map' | 'threats' | 'details'>('map');

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const allCycles = await weatherService.getCycles();
      setCycles(allCycles);

      const allThreats = await weatherService.getAllThreats();
      setThreats(allThreats);
      if (allThreats.length > 0) {
        setSelectedThreat(allThreats[0]);
      }

      const allMembers = await weatherService.getEnsembleMembers();
      setMembers(allMembers);
    }
    loadData();
  }, []);

  // Update threats when cycle changes
  const handleSelectCycle = async (cycleId: string) => {
    setSelectedCycleId(cycleId);
    const cycleThreats = await weatherService.getThreatsByCycle(cycleId);
    if (cycleThreats.length > 0) {
      setThreats(cycleThreats);
      setSelectedThreat(cycleThreats[0]);
      setCurrentLeadTime(72);
    }
  };

  const handleSelectThreat = (threat: WeatherThreat) => {
    setSelectedThreat(threat);
    // Switch to map view on mobile upon selection
    setMobileView('map');
  };

  if (!selectedThreat) {
    return (
      <div className="w-full h-screen bg-[#060B18] flex items-center justify-center text-white font-mono text-sm">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
        INITIALIZING MISSION CONTROL ENGINE...
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-[#060B18] overflow-hidden">
      
      {/* Top Bar */}
      <ForecasterTopBar
        cycles={cycles}
        selectedCycleId={selectedCycleId}
        onSelectCycle={handleSelectCycle}
        onNavigateHome={() => onNavigate('/')}
        onNavigateMethod={() => onNavigate('/method')}
      />

      {/* Main 3-Column Workstation Layout */}
      <div className="flex-1 w-full flex overflow-hidden relative">
        
        {/* Left Sidebar: Threat Board (Visible always on md+, conditional on mobile) */}
        <div className={`${mobileView === 'threats' ? 'flex w-full absolute inset-0 z-30' : 'hidden md:flex'}`}>
          <ThreatBoard
            threats={threats}
            selectedThreatId={selectedThreat.id}
            onSelectThreat={handleSelectThreat}
          />
        </div>

        {/* Center: Map Area */}
        <main className={`flex-1 h-full relative ${mobileView === 'map' ? 'flex' : 'hidden md:flex'}`}>
          <WeatherMap
            threat={selectedThreat}
            members={members}
            currentLeadTime={currentLeadTime}
            onChangeLeadTime={setCurrentLeadTime}
          />
        </main>

        {/* Right Panel: Forecaster Intelligence Dossier */}
        <div className={`${mobileView === 'details' ? 'flex w-full absolute inset-0 z-30' : 'hidden lg:flex'}`}>
          <DetailsPanel
            threat={selectedThreat}
            members={members}
            currentLeadTime={currentLeadTime}
          />
        </div>

      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on small viewports) */}
      <div className="md:hidden h-12 bg-[#0B1426] border-t border-white/10 flex items-center justify-around text-xs font-mono z-40">
        <button
          onClick={() => setMobileView('threats')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
            mobileView === 'threats' ? 'bg-[#F28C28] text-white font-bold' : 'text-slate-400'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>Threats ({threats.length})</span>
        </button>

        <button
          onClick={() => setMobileView('map')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
            mobileView === 'map' ? 'bg-[#0070C0] text-white font-bold' : 'text-slate-400'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Weather Map</span>
        </button>

        <button
          onClick={() => setMobileView('details')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
            mobileView === 'details' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Dossier</span>
        </button>
      </div>

    </div>
  );
};
