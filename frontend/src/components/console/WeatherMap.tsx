import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layers, RotateCcw, Wind } from 'lucide-react';
import type { WeatherThreat, EnsembleMemberTrack } from '../../types/weather';
import { MapLegend } from './MapLegend';
import { LeadTimeSlider } from './LeadTimeSlider';
import { useApp } from '../common/ThemeContext';

interface WeatherMapProps {
  threat: WeatherThreat;
  members: EnsembleMemberTrack[];
  currentLeadTime: number; // continuous float (0 to 240)
  onChangeLeadTime: (hours: number) => void;
}

export const WeatherMap: React.FC<WeatherMapProps> = ({
  threat,
  members,
  currentLeadTime,
  onChangeLeadTime,
}) => {
  const { language, t } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const cycloneMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Layer toggles
  const [layers, setLayers] = useState({
    efiHeatmap: true,
    threatTrack: true,
    memberSpaghetti: true,
    probabilityShading: true,
    footprintPolygon: true,
  });

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Interpolated State for smooth morphing across 12-hour steps
  const interpolatedState = useMemo(() => {
    const t = Math.max(0, Math.min(240, currentLeadTime));
    const timeSeries = threat.timeSeries;

    let i0 = 0;
    for (let i = 0; i < timeSeries.length - 1; i++) {
      if (timeSeries[i + 1].leadTime >= t) {
        i0 = i;
        break;
      }
    }

    const p0 = timeSeries[i0];
    const p1 = timeSeries[Math.min(timeSeries.length - 1, i0 + 1)];
    const dt = p1.leadTime - p0.leadTime;
    const alpha = dt > 0 ? (t - p0.leadTime) / dt : 0;

    // Morph coordinates
    const lon = p0.coordinates[0] + (p1.coordinates[0] - p0.coordinates[0]) * alpha;
    const lat = p0.coordinates[1] + (p1.coordinates[1] - p0.coordinates[1]) * alpha;

    // Morph radius and metrics
    const radius = Math.round(p0.footprintRadiusKm + (p1.footprintRadiusKm - p0.footprintRadiusKm) * alpha);
    const efi = Number((p0.efi + (p1.efi - p0.efi) * alpha).toFixed(2));
    const sot = Number((p0.sot + (p1.sot - p0.sot) * alpha).toFixed(1));

    // Morph footprint polygon vertices
    const ring0 = p0.footprintPolygon.coordinates[0];
    const ring1 = p1.footprintPolygon.coordinates[0];
    const vertCount = Math.max(ring0.length, ring1.length);
    const morphedRing: number[][] = [];

    for (let v = 0; v < vertCount; v++) {
      const v0 = ring0[v % ring0.length];
      const v1 = ring1[v % ring1.length];
      const vx = v0[0] + (v1[0] - v0[0]) * alpha;
      const vy = v0[1] + (v1[1] - v0[1]) * alpha;
      morphedRing.push([Number(vx.toFixed(4)), Number(vy.toFixed(4))]);
    }
    if (morphedRing.length > 0) {
      morphedRing[morphedRing.length - 1] = [morphedRing[0][0], morphedRing[0][1]];
    }

    const morphedPolygon: GeoJSON.Polygon = {
      type: 'Polygon',
      coordinates: [morphedRing],
    };

    // Synthesize interpolated valid time string
    // Base cycle 2020-05-15 00:00 UTC + t hours
    const baseDate = new Date(Date.UTC(2020, 4, 15, 0, 0, 0));
    baseDate.setTime(baseDate.getTime() + t * 3600 * 1000);
    const validString = baseDate.toISOString().replace(':00.000Z', '').replace('T', ' ') + ' UTC';

    return {
      coordinates: [Number(lon.toFixed(4)), Number(lat.toFixed(4))] as [number, number],
      footprintRadiusKm: radius,
      footprintPolygon: morphedPolygon,
      efi: efi,
      sot: sot,
      validTime: validString,
      intensity: p0.intensity,
      fssSkill: p0.fssSkill + (p1.fssSkill - p0.fssSkill) * alpha,
      affectedDistricts: alpha < 0.5 ? p0.affectedDistricts : p1.affectedDistricts,
    };
  }, [threat, currentLeadTime]);

  // 1. Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            'esri-dark-base': {
              type: 'raster',
              tiles: [
                'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
              ],
              tileSize: 256,
              attribution: '&copy; Esri &copy; OpenStreetMap contributors',
            },
            'esri-dark-reference': {
              type: 'raster',
              tiles: [
                'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
              ],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: 'esri-dark-base-layer',
              type: 'raster',
              source: 'esri-dark-base',
              minzoom: 0,
              maxzoom: 16,
            },
            {
              id: 'esri-dark-reference-layer',
              type: 'raster',
              source: 'esri-dark-reference',
              minzoom: 0,
              maxzoom: 16,
            },
          ],
        },
        center: interpolatedState.coordinates,
        zoom: 4.8,
        minZoom: 3,
        maxZoom: 14,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

      map.on('load', () => {
        setMapLoaded(true);

        // Create Custom HTML Pulsing Cyclone Marker with Expanding Shockwave Rings
        const markerEl = document.createElement('div');
        markerEl.className = 'cyclone-marker-container';
        markerEl.innerHTML = `
          <div class="cyclone-pulse-ring-1"></div>
          <div class="cyclone-pulse-ring-2"></div>
          <div class="cyclone-core-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
              <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
              <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
            </svg>
          </div>
        `;

        const marker = new maplibregl.Marker({ element: markerEl, anchor: 'center' })
          .setLngLat(interpolatedState.coordinates)
          .addTo(map);

        cycloneMarkerRef.current = marker;
      });

      map.on('error', (e: any) => {
        console.warn('MapLibre error encountered; enabling robust radar fallback view:', e);
      });

      mapRef.current = map;

      return () => {
        if (cycloneMarkerRef.current) {
          cycloneMarkerRef.current.remove();
          cycloneMarkerRef.current = null;
        }
        map.remove();
        mapRef.current = null;
      };
    } catch (err) {
      console.warn('WebGL / MapLibre failed; utilizing fallback SVG radar map:', err);
      setUseFallback(true);
    }
  }, []);

  // Update Pulsing Marker Position
  useEffect(() => {
    if (cycloneMarkerRef.current) {
      cycloneMarkerRef.current.setLngLat(interpolatedState.coordinates);
    }
  }, [interpolatedState.coordinates]);

  // Center/Fly Map when threat ID changes
  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      mapRef.current.easeTo({
        center: interpolatedState.coordinates,
        duration: 900,
      });
    }
  }, [threat.id, mapLoaded]);

  // Update GeoJSON Layers with Morphed Polygon & Tracks
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // 1. Morphed Footprint Polygon (Smooth dynamic geometry)
    const footprintGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: layers.footprintPolygon
        ? [
            {
              type: 'Feature',
              properties: {
                efi: interpolatedState.efi,
                radius: interpolatedState.footprintRadiusKm,
              },
              geometry: interpolatedState.footprintPolygon,
            },
          ]
        : [],
    };

    const labelLayerId = map.getLayer('esri-dark-reference-layer') ? 'esri-dark-reference-layer' : undefined;

    if (map.getSource('footprint-source')) {
      (map.getSource('footprint-source') as maplibregl.GeoJSONSource).setData(footprintGeoJSON);
    } else {
      map.addSource('footprint-source', {
        type: 'geojson',
        data: footprintGeoJSON,
      });

      map.addLayer({
        id: 'footprint-fill',
        type: 'fill',
        source: 'footprint-source',
        paint: {
          'fill-color': '#C00000',
          'fill-opacity': 0.22,
        },
      }, labelLayerId);

      map.addLayer({
        id: 'footprint-line',
        type: 'line',
        source: 'footprint-source',
        paint: {
          'line-color': '#F28C28',
          'line-width': 2.5,
          'line-dasharray': [2, 2],
        },
      }, labelLayerId);
    }

    // 2. Consensus Threat Track Line
    const trackCoords = threat.timeSeries.map((pt) => pt.coordinates);
    const trackGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: layers.threatTrack
        ? [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: trackCoords,
              },
            },
          ]
        : [],
    };

    if (map.getSource('track-source')) {
      (map.getSource('track-source') as maplibregl.GeoJSONSource).setData(trackGeoJSON);
    } else {
      map.addSource('track-source', {
        type: 'geojson',
        data: trackGeoJSON,
      });

      map.addLayer({
        id: 'threat-track-line',
        type: 'line',
        source: 'track-source',
        paint: {
          'line-color': '#F28C28',
          'line-width': 3,
        },
      }, labelLayerId);
    }

    // 3. 23 Member Spaghetti Tracks
    const memberFeatures: GeoJSON.Feature[] =
      layers.memberSpaghetti && threat.type === 'cyclone'
        ? members.map((m) => ({
            type: 'Feature',
            properties: { memberId: m.memberId },
            geometry: {
              type: 'LineString',
              coordinates: m.points.map((p) => p.coordinates),
            },
          }))
        : [];

    const memberGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: memberFeatures,
    };

    if (map.getSource('members-source')) {
      (map.getSource('members-source') as maplibregl.GeoJSONSource).setData(memberGeoJSON);
    } else {
      map.addSource('members-source', {
        type: 'geojson',
        data: memberGeoJSON,
      });

      map.addLayer({
        id: 'members-lines',
        type: 'line',
        source: 'members-source',
        paint: {
          'line-color': '#38BDF8',
          'line-width': 1.2,
          'line-opacity': 0.45,
        },
      }, labelLayerId);
    }
  }, [threat, members, interpolatedState, layers, mapLoaded]);

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [82.5, 21.0],
        zoom: 4.8,
        duration: 1000,
      });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#060B18] overflow-hidden select-none">
      
      {/* Map Canvas / Fallback Container */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Resilient Radar Overlay Fallback */}
        {useFallback && (
          <div className="absolute inset-0 bg-[#060B18] flex items-center justify-center p-4">
            <svg viewBox="0 0 900 650" className="w-full h-full max-w-4xl">
              <rect width="900" height="650" fill="#060B18" />
              <path d="M 0 150 H 900 M 0 300 H 900 M 0 450 H 900 M 0 600 H 900" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <path d="M 150 0 V 650 M 300 0 V 650 M 450 0 V 650 M 600 0 V 650 M 750 0 V 650" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

              <path
                d="M 280 120 L 340 140 L 320 220 L 340 280 L 370 360 L 410 440 L 440 380 L 480 300 L 510 240 L 540 210 L 490 150 L 430 110 L 350 110 Z"
                fill="#0B1426"
                stroke="#1F3864"
                strokeWidth="2"
              />

              {/* Morphed Footprint Circle */}
              <circle
                cx={interpolatedState.coordinates[0] * 7 - 100}
                cy={650 - interpolatedState.coordinates[1] * 20}
                r={interpolatedState.footprintRadiusKm * 0.28}
                fill="rgba(192, 0, 0, 0.25)"
                stroke="#F28C28"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Pulsing Vortex */}
              <circle
                cx={interpolatedState.coordinates[0] * 7 - 100}
                cy={650 - interpolatedState.coordinates[1] * 20}
                r="14"
                fill="#F28C28"
                className="animate-ping"
              />
            </svg>
          </div>
        )}

        {/* Live Weather Threat Telemetry HUD (Top Left) */}
        <div className="absolute top-4 left-4 z-30 max-w-sm pointer-events-none">
          <div className="glass-panel p-3.5 bg-[#0B1426]/90 border border-white/10 space-y-2 pointer-events-auto shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#F28C28] uppercase font-bold tracking-wider">
                {t('vortexTelemetry')}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {t('ncmrwfAi')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <Wind className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-white text-xs sm:text-sm">
                  {language === 'hi' ? (threat.hindiName || threat.name) : threat.name}
                </h4>
                <div className="font-mono text-[11px] text-slate-300">
                  {interpolatedState.coordinates[1].toFixed(2)}°N, {interpolatedState.coordinates[0].toFixed(2)}°E
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 font-mono text-[11px]">
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">{t('intensity')}</span>
                <span className="text-white font-bold">{interpolatedState.intensity.split('(')[0]}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">{t('efiAnomaly')}</span>
                <span className="text-[#F28C28] font-bold">+{interpolatedState.efi}</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-white/5 pt-1">
              <span>{t('morphedRadius')}</span>
              <span className="text-amber-400 font-bold">{interpolatedState.footprintRadiusKm} km</span>
            </div>
          </div>
        </div>

        {/* Map Legend Overlay (Top Right) */}
        <div className="absolute top-4 right-14 z-30 hidden md:block">
          <MapLegend
            layers={layers}
            onToggleLayer={toggleLayer}
          />
        </div>

        {/* Map Controls: Reset to India */}
        <div className="absolute top-28 right-4 z-30 flex flex-col gap-1.5">
          <button
            onClick={handleResetView}
            title={t('resetPanIndia')}
            className="p-2 rounded-lg bg-[#0B1426] hover:bg-slate-800 text-slate-300 border border-white/10 shadow-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Scale Bar Indicator */}
        <div className="absolute bottom-28 left-4 z-20 hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0B1426]/80 text-[10px] font-mono text-slate-400 border border-white/10 backdrop-blur-sm pointer-events-none">
          <div className="w-16 h-1 bg-slate-400 relative">
            <div className="absolute -left-0.5 -top-1 w-0.5 h-3 bg-slate-400" />
            <div className="absolute -right-0.5 -top-1 w-0.5 h-3 bg-slate-400" />
          </div>
          <span>200 km</span>
        </div>

        {/* Bottom Lead-Time Slider Control Bar */}
        <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6 z-30">
          <LeadTimeSlider
            currentLeadTime={currentLeadTime}
            onChangeLeadTime={onChangeLeadTime}
            validTime={interpolatedState.validTime}
          />
        </div>

      </div>

    </div>
  );
};
