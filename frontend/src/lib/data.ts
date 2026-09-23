import cyclesData from '../data/cycles.json';
import threatsData from '../data/threats.json';
import membersData from '../data/members.json';
import type { ForecastCycle, WeatherThreat, EnsembleMemberTrack, GuidancePayload } from '../types/weather';

/**
 * Unified Data Service for MEGHA-DRISHTI.
 * Currently backed by verified meteorological simulation JSON.
 * Can be replaced seamlessly by live FastAPI/PostGIS endpoints.
 */
class WeatherDataService {
  private cycles: ForecastCycle[] = cyclesData as ForecastCycle[];
  private threats: WeatherThreat[] = threatsData as WeatherThreat[];
  private members: EnsembleMemberTrack[] = membersData as EnsembleMemberTrack[];

  async getCycles(): Promise<ForecastCycle[]> {
    return this.cycles;
  }

  async getThreatsByCycle(cycleId: string): Promise<WeatherThreat[]> {
    return this.threats.filter((t) => t.cycleId === cycleId);
  }

  async getAllThreats(): Promise<WeatherThreat[]> {
    return this.threats;
  }

  async getThreatById(id: string): Promise<WeatherThreat | undefined> {
    return this.threats.find((t) => t.id === id);
  }

  async getEnsembleMembers(): Promise<EnsembleMemberTrack[]> {
    return this.members;
  }

  generateGuidancePayload(threat: WeatherThreat, leadTimeHours: number): GuidancePayload {
    const timePoint = threat.timeSeries.find((p) => p.leadTime === leadTimeHours) || threat.timeSeries[0];
    
    return {
      advisory_id: `MD-${threat.id.toUpperCase()}-${String(timePoint.leadTime).padStart(3, '0')}H`,
      issuing_body: "NCMRWF_INDIA",
      disclaimer: "Guidance for IMD forecasters — not a public warning",
      cycle: threat.cycleId,
      threat_id: threat.id,
      threat_type: threat.type,
      threat_name: threat.name,
      current_lead_time_hours: timePoint.leadTime,
      valid_utc: timePoint.validTime,
      confidence_metrics: {
        peak_efi: timePoint.efi,
        shift_of_tails: timePoint.sot,
        member_consensus_ratio: `${threat.memberAgreement}/${threat.totalMembers}`,
        fss_skill_score: timePoint.fssSkill,
      },
      footprint_geometry: timePoint.footprintPolygon,
      high_resolution_grid_km: 5.0,
      primary_impact_districts: timePoint.affectedDistricts,
      generated_at_utc: new Date().toISOString(),
    };
  }
}

export const weatherService = new WeatherDataService();
