export type HazardType = 'cyclone' | 'heat' | 'cold' | 'rain';

export type SeverityLevel = 'Advisory' | 'Watch' | 'Warning' | 'Extreme Warning';

export interface ForecastCycle {
  id: string;
  name: string;
  timestamp: string;
  description: string;
  activeThreatCount: number;
}

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: number[][][]; // [ [ [lon, lat], [lon, lat], ... ] ]
}

export interface ThreatTimePoint {
  leadTime: number; // in hours (0, 12, 24 ... 240)
  validTime: string; // e.g. "2020-05-18 00 UTC"
  coordinates: [number, number]; // [lon, lat]
  intensity: string;
  numericMetric: number; // e.g. wind km/h or temp °C or rain mm
  metricUnit: string;
  efi: number; // Extreme Forecast Index (-1.0 to 1.0)
  sot: number; // Shift of Tails
  exceedanceProb: number; // 0.0 to 1.0
  footprintRadiusKm: number;
  footprintPolygon: GeoPolygon;
  fssSkill: number; // Fractions Skill Score (0 to 1)
  affectedDistricts: string[];
  summary: string;
}

export interface WeatherThreat {
  id: string;
  cycleId: string;
  name: string;
  hindiName: string;
  type: HazardType;
  severity: SeverityLevel;
  region: string;
  leadTimeWindow: string; // e.g. "Days 4–7 (+96h to +168h)"
  peakEfi: number;
  sot: number;
  memberAgreement: number; // e.g. 19
  totalMembers: number; // 23
  initialCoordinates: [number, number]; // [lon, lat]
  timeSeries: ThreatTimePoint[];
  verification: {
    powerSpectrumLabel: string;
    tailQqDescription: string;
    reliabilityScore: number;
  };
}

export interface EnsembleMemberTrack {
  memberId: number;
  name: string;
  isControl: boolean;
  points: {
    leadTime: number;
    coordinates: [number, number]; // [lon, lat]
    intensity: number;
  }[];
  landfallPoint?: [number, number];
  landfallDistrict?: string;
  landfallTime?: string;
}

export interface GuidancePayload {
  advisory_id: string;
  issuing_body: "NCMRWF_INDIA";
  disclaimer: "Guidance for IMD forecasters — not a public warning";
  cycle: string;
  threat_id: string;
  threat_type: string;
  threat_name: string;
  current_lead_time_hours: number;
  valid_utc: string;
  confidence_metrics: {
    peak_efi: number;
    shift_of_tails: number;
    member_consensus_ratio: string;
    fss_skill_score: number;
  };
  footprint_geometry: GeoPolygon;
  high_resolution_grid_km: 5.0;
  primary_impact_districts: string[];
  generated_at_utc: string;
}
