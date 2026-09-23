import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
export type Language = 'en' | 'hi';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    systemName: "MEGHA-DRISHTI",
    hindiSub: "मेघ-दृष्टि",
    tagline: "AI Extreme Weather Forecasting System",
    openConsole: "Open Forecaster Console",
    howItWorks: "How it works",
    methodology: "Methodology",
    demoBadge: "DEMO DATA — illustrative",
    alertWatermark: "Guidance for IMD forecasters — not a public warning",
    selectCycle: "NEPS-G Cycle:",
    threatBoard: "Threat Board",
    active: "Active",
    allHazards: "All",
    cyclone: "Cyclone",
    heat: "Heat",
    cold: "Cold",
    rain: "Rain",
    leadTime: "Lead Time",
    validTime: "Valid:",
    memberConsensus: "Member Agreement",
    confidence: "Confidence",
    footprint: "Footprint",
    evidence: "Evidence",
    members: "23 Members",
    verification: "Verification",
    api: "JSON API",
    play: "Play",
    pause: "Pause",
    days: "Days",
    missionControlSub: "FORECASTER MISSION CONTROL • 5 KM",
    searchPlaceholder: "Filter by district, state, or name...",
    noThreats: "No active threats matching current filters.",
    mclimateFooter: "NCMRWF M-Climate EFI v2.4",
    twentyThreeMembers: "23 Members",
    window: "Window",
    agreement: "Agreement",
    peakEfi: "Peak EFI Anomaly",
    tenDayTrend: "10-Day EFI Trend",
    peak: "Peak",
    vortexTelemetry: "VORTEX TELEMETRY",
    ncmrwfAi: "NCMRWF 5 KM AI",
    intensity: "Intensity",
    efiAnomaly: "EFI Anomaly",
    morphedRadius: "Footprint Radius (Morphed):",
    mapLayers: "MAP LAYERS",
    alertFootprint: "Alert Footprint",
    consensusTrack: "Consensus Track",
    spaghettiTracks: "23 Member Spaghetti",
    efiHeatmap: "EFI Anomaly Heatmap",
    probEnvelope: "Probability Envelope",
    efiScale: "EFI Scale:",
    forecastHorizon: "FORECAST HORIZON",
    playSmooth: "Play Smooth Run",
    keyboardHint: "Use ← / → to step, Space to play",
    dossierHeader: "FORECASTER INTELLIGENCE DOSSIER",
    extremeIndex: "EXTREME INDEX (EFI)",
    shiftOfTails: "SHIFT OF TAILS (SOT)",
    memberConsensusLabel: "Ensemble Member Consensus:",
    exceedanceProbLabel: "Exceedance Probability (99th %tile):",
    efiTrendAcross: "EFI Trend Across 10-Day Run",
    climatologicalFoundation: "Climatological Foundation",
    climatologicalDesc: "EFI compares the 23 NEPS-G members against the 20-year reforecast distribution (IMDAA reanalysis). An EFI above 0.8 indicates a rare event requiring immediate forecaster vigilance.",
    downscaledMembers: "23 Downscaled Ensemble Members",
    viewing5km: "Viewing 5km resolution fields",
    viewing12km: "Viewing 12km resolution fields",
    viewingMean: "Viewing Ensemble Mean",
    mean: "Mean",
    fiveKmAi: "5 km AI",
    twelveKm: "12 km",
    realizations: "23 Realizations",
    clickTip: "💡 Tip: Click any member thumbnail to open the interactive 12 km vs 5 km before/after inspection slider.",
    memberInspection: "MEMBER DETAIL INSPECTION",
    twelveVsFive: "12 km Coarse vs. ~5 km Diffusion Field",
    predictedLandfall: "Predicted Landfall:",
    landfallTime: "Landfall Time:",
    closeInspector: "Close Inspector",
    footprintEngineStatus: "FOOTPRINT ENGINE STATUS",
    fssCalibrated: "FSS Calibrated",
    impactCorridor: "Impact Corridor",
    sizeBasis: "Size Basis:",
    sizeBasisDesc: "Sized from Fractions Skill Score (FSS) at this lead time. Alert zone contracts realistically as predictability skill sharpens toward landfall.",
    effectiveRadius: "Effective Radius",
    fssSkillScore: "FSS Skill Score",
    spatialSkill: "Spatial Skill vs Lead Time (FSS)",
    affectedDistricts: "Primary Impact Administrative Districts:",
    operationalSafeguard: "Operational Safeguard:",
    operationalSafeguardDesc: "This footprint is intended solely as high-resolution guidance for IMD forecasters to aid evacuation planning, not as an automated public alert.",
    verificationBenchmark: "MODEL VERIFICATION BENCHMARK",
    illustrativeBadge: "Illustrative until pilot results",
    verificationSub: "Evaluated against IMDAA 12 km reanalysis, IMD automatic weather stations, and IPED high-resolution daily gridded precipitation.",
    powerSpectrumTitle: "1. Kinetic Energy Power Spectrum",
    tailQqTitle: "2. Tail Quantile-Quantile (Q-Q) Plot",
    reliabilityDiagramTitle: "3. Reliability Diagram (Calibration Curve)",
    brierSkillScore: "Brier Skill Score:",
    wellCalibrated: "Well-calibrated probability tails",
    apiTitle: "Machine-Readable Guidance API",
    copyJson: "Copy JSON",
    copied: "Copied!",
    download: "Download",
    wmoWis: "IMD WMO WIS 2.0 Compliant Schema",
    fastApiReady: "FastAPI + PostGIS Ready",
    resetPanIndia: "Reset Map to Pan-India",
    extremeWarning: "Extreme Warning",
    warning: "Warning",
    watch: "Watch",
    advisory: "Advisory",
  },
  hi: {
    systemName: "मेघ-दृष्टि",
    hindiSub: "MEGHA-DRISHTI",
    tagline: "एआई चरम मौसम पूर्वानुमान प्रणाली",
    openConsole: "फोरकास्टर कंसोल खोलें",
    howItWorks: "यह कैसे काम करता है",
    methodology: "कार्यप्रणाली",
    demoBadge: "डेमो डेटा — केवल सांकेतिक",
    alertWatermark: "आईएमडी मौसम विज्ञानियों के लिए मार्गदर्शन — सार्वजनिक चेतावनी नहीं",
    selectCycle: "एनईपीएस-जी चक्र:",
    threatBoard: "खतरा बोर्ड",
    active: "सक्रिय",
    allHazards: "सभी",
    cyclone: "चक्रवात",
    heat: "ग्रीष्म",
    cold: "शीत",
    rain: "अतिवृष्टि",
    leadTime: "अग्रिम समय",
    validTime: "वैध समय:",
    memberConsensus: "सदस्य सहमति",
    confidence: "सटीकता विश्वास",
    footprint: "प्रभाव क्षेत्र",
    evidence: "वैज्ञानिक साक्ष्य",
    members: "२३ सदस्य",
    verification: "सत्यापन",
    api: "एपीआई पेलोड",
    play: "चलाएं",
    pause: "रोकें",
    days: "दिन",
    missionControlSub: "फोरकास्टर मिशन कंट्रोल • ५ किमी",
    searchPlaceholder: "जिला, राज्य अथवा नाम से खोजें...",
    noThreats: "वर्तमान फ़िल्टर के अनुसार कोई सक्रिय खतरा नहीं मिला।",
    mclimateFooter: "एनसीएमआरडब्ल्यूएफ एम-क्लाइमेट ईएफआई v2.4",
    twentyThreeMembers: "२३ सदस्य",
    window: "अग्रिम अवधि",
    agreement: "सहमति",
    peakEfi: "अधिकतम ईएफआई विसंगति",
    tenDayTrend: "१०-दिवसीय ईएफआई रुझान",
    peak: "अधिकतम",
    vortexTelemetry: "भंवर टेलीमेट्री",
    ncmrwfAi: "एनसीएमआरडब्ल्यूएफ ५ किमी एआई",
    intensity: "तीव्रता",
    efiAnomaly: "ईएफआई विसंगति",
    morphedRadius: "प्रभाव क्षेत्र त्रिज्या (परिवर्तित):",
    mapLayers: "मानचित्र परतें",
    alertFootprint: "चेतावनी प्रभाव क्षेत्र",
    consensusTrack: "सहमति चक्रवात मार्ग",
    spaghettiTracks: "२३ सदस्य स्पेगेटी मार्ग",
    efiHeatmap: "ईएफआई विसंगति हीटमैप",
    probEnvelope: "संभाव्यता आवरण",
    efiScale: "ईएफआई पैमाना:",
    forecastHorizon: "पूर्वानुमान सीमा",
    playSmooth: "सुचारू रूप से चलाएं",
    keyboardHint: "कदम बढ़ाने के लिए ← / → दबाएं, चलाने के लिए Space",
    dossierHeader: "फोरकास्टर इंटेलिजेंस डोजियर",
    extremeIndex: "चरम सूचकांक (ईएफआई)",
    shiftOfTails: "वितरण छोर विस्थापन (एसओटी)",
    memberConsensusLabel: "एन्सेम्बल सदस्य सहमति:",
    exceedanceProbLabel: "९९वें प्रतिशतक पार करने की संभावना:",
    efiTrendAcross: "१०-दिवसीय पूर्वानुमान में ईएफआई रुझान",
    climatologicalFoundation: "जलवायु-वैज्ञानिक आधार",
    climatologicalDesc: "ईएफआई २३ एनईपीएस-जी सदस्यों की तुलना २०-वर्षीय पुनरनुमान वितरण (आईएमडीएए पुनर्विश्लेषण) से करता है। ०.८ से अधिक ईएफआई एक दुर्लभ घटना दर्शाता है जिसके लिए तत्काल सतर्कता आवश्यक है।",
    downscaledMembers: "२३ डाउनस्केल्ड एन्सेम्बल सदस्य",
    viewing5km: "५ किमी रिज़ॉल्यूशन दृश्य",
    viewing12km: "१२ किमी रिज़ॉल्यूशन दृश्य",
    viewingMean: "एन्सेम्बल औसत दृश्य",
    mean: "औसत",
    fiveKmAi: "५ किमी एआई",
    twelveKm: "१२ किमी",
    realizations: "२३ संभावित स्थितियां",
    clickTip: "💡 सुझाव: १२ किमी बनाम ५ किमी विस्तृत तुलना स्लाइडर खोलने के लिए किसी भी सदस्य थंबनेल पर क्लिक करें।",
    memberInspection: "सदस्य विस्तृत निरीक्षण",
    twelveVsFive: "१२ किमी स्थूल बनाम ~५ किमी डिफ्यूजन क्षेत्र",
    predictedLandfall: "अनुमानित भू-प्रवेश (लैंडफॉल):",
    landfallTime: "भू-प्रवेश समय:",
    closeInspector: "निरीक्षण बंद करें",
    footprintEngineStatus: "फुटप्रिंट इंजन स्थिति",
    fssCalibrated: "एफएसएस कैलिब्रेटेड",
    impactCorridor: "प्रभाव गलियारा",
    sizeBasis: "आकार निर्धारण आधार:",
    sizeBasisDesc: "इस अग्रिम समय पर फ्रैक्शंस स्किल स्कोर (एफएसएस) से आकार निर्धारित। तट की ओर सटीकता बढ़ने पर चेतावनी क्षेत्र स्वाभाविक रूप से सिकुड़ता है।",
    effectiveRadius: "प्रभावी त्रिज्या",
    fssSkillScore: "एफएसएस सटीकता स्कोर",
    spatialSkill: "अग्रिम समय अनुसार स्थानिक सटीकता (एफएसएस)",
    affectedDistricts: "प्राथमिक रूप से प्रभावित प्रशासनिक जिले:",
    operationalSafeguard: "परिचालन सुरक्षा नियम:",
    operationalSafeguardDesc: "यह प्रभाव क्षेत्र केवल आईएमडी मौसम विज्ञानियों के लिए निकासी योजना में सहायता हेतु उच्च-रिज़ॉल्यूशन मार्गदर्शन है, कोई सार्वजनिक चेतावनी नहीं।",
    verificationBenchmark: "मॉडल सत्यापन मानक",
    illustrativeBadge: "पायलट परिणामों तक सांकेतिक",
    verificationSub: "आईएमडीएए १२ किमी पुनर्विश्लेषण, आईएमडी स्वचालित मौसम स्टेशनों, और आईपीईडी दैनिक वर्षा ग्रिड के विरुद्ध मूल्यांकित।",
    powerSpectrumTitle: "१. गतिज ऊर्जा पावर स्पेक्ट्रम",
    tailQqTitle: "२. टेल क्वांटाइल-क्वांटाइल (Q-Q) आलेख",
    reliabilityDiagramTitle: "३. विश्वसनीयता आरेख (अंशांकन वक्र)",
    brierSkillScore: "ब्रायर स्किल स्कोर:",
    wellCalibrated: "सुव्यवस्थित संभाव्यता वितरण छोर",
    apiTitle: "मशीन-पठनीय मार्गदर्शन एपीआई",
    copyJson: "जेएसओएन कॉपी करें",
    copied: "कॉपी हो गया!",
    download: "डाउनलोड",
    wmoWis: "आईएमडी डब्लूएमओ विस २.० अनुरूप स्कीमा",
    fastApiReady: "फास्टएपीआई + पोस्टजीआईएस तैयार",
    resetPanIndia: "मानचित्र को पुनः अखिल भारतीय दृश्य पर लाएं",
    extremeWarning: "अत्यधिक चेतावनी",
    warning: "चेतावनी",
    watch: "निगरानी",
    advisory: "परामर्श",
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, toggleLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
