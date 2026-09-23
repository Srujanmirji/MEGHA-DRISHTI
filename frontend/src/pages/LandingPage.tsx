import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { GapTimelineSection } from '../components/landing/GapTimelineSection';
import { PeakAveragingDemo } from '../components/landing/PeakAveragingDemo';
import { ThreeStagesSection } from '../components/landing/ThreeStagesSection';
import { ArchitectureFlow } from '../components/landing/ArchitectureFlow';
import { ImpactCards } from '../components/landing/ImpactCards';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const handleScrollToHowItWorks = () => {
    const el = document.getElementById('the-gap');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#060B18] text-slate-100 flex flex-col">
      <HeroSection
        onOpenConsole={() => onNavigate('/console')}
        onExploreHowItWorks={handleScrollToHowItWorks}
      />
      
      <GapTimelineSection />

      <PeakAveragingDemo />

      <ThreeStagesSection />

      <ArchitectureFlow />

      <ImpactCards />
    </div>
  );
};
