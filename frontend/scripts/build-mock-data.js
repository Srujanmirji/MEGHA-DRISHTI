import fs from 'fs';
import path from 'path';

function createCirclePolygon(centerLon, centerLat, radiusKm, numPoints = 24, elongation = 1.0, angleDeg = 0) {
  const coords = [];
  const radAngle = (angleDeg * Math.PI) / 180;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints;
    // apply elongation along storm track
    const dx = radiusKm * Math.cos(angle);
    const dy = radiusKm * elongation * Math.sin(angle);
    
    // rotate
    const rx = dx * Math.cos(radAngle) - dy * Math.sin(radAngle);
    const ry = dx * Math.sin(radAngle) + dy * Math.cos(radAngle);

    const latOffset = ry / 110.574;
    const lonOffset = rx / (111.320 * Math.cos((centerLat * Math.PI) / 180));
    coords.push([
      Number((centerLon + lonOffset).toFixed(4)),
      Number((centerLat + latOffset).toFixed(4))
    ]);
  }
  return {
    type: 'Polygon',
    coordinates: [coords]
  };
}

// Generate Cyclone Amphan time series (0h to 240h in 12h intervals)
// Track begins in south-central Bay of Bengal (~11.0°N, 86.5°E) at 0h
// Moves north-northeastwards towards Odisha/WB coast near Puri/Digha (~21.8°N, 88.2°E) by ~120h
// Then moves inland towards WB/Bangladesh
const leadTimes = [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 204, 216, 228, 240];

const cyclonePoints = [
  { t: 0,   lon: 86.4, lat: 10.8, wind: 65,  status: "Deep Depression", efi: 0.52, sot: 0.4, fss: 0.35, radius: 420 },
  { t: 12,  lon: 86.5, lat: 11.6, wind: 75,  status: "Cyclonic Storm", efi: 0.61, sot: 0.6, fss: 0.40, radius: 390 },
  { t: 24,  lon: 86.6, lat: 12.5, wind: 90,  status: "Severe Cyclonic Storm", efi: 0.68, sot: 0.8, fss: 0.45, radius: 360 },
  { t: 36,  lon: 86.5, lat: 13.4, wind: 115, status: "Very Severe Cyclonic Storm", efi: 0.74, sot: 1.1, fss: 0.52, radius: 320 },
  { t: 48,  lon: 86.4, lat: 14.7, wind: 145, status: "Extremely Severe Cyclonic Storm", efi: 0.82, sot: 1.4, fss: 0.59, radius: 280 },
  { t: 60,  lon: 86.3, lat: 16.0, wind: 195, status: "Super Cyclonic Storm", efi: 0.89, sot: 1.7, fss: 0.66, radius: 240 },
  { t: 72,  lon: 86.5, lat: 17.5, wind: 230, status: "Super Cyclonic Storm (Peak)", efi: 0.96, sot: 2.3, fss: 0.74, radius: 200 },
  { t: 84,  lon: 86.9, lat: 18.9, wind: 215, status: "Extremely Severe Cyclonic Storm", efi: 0.94, sot: 2.1, fss: 0.79, radius: 170 },
  { t: 96,  lon: 87.4, lat: 20.3, wind: 185, status: "Approaching Odisha Coast", efi: 0.92, sot: 1.9, fss: 0.84, radius: 130 },
  { t: 108, lon: 87.9, lat: 21.2, wind: 170, status: "Landfall Window: Digha / Sundarbans", efi: 0.90, sot: 1.8, fss: 0.89, radius: 95 },
  { t: 120, lon: 88.3, lat: 22.1, wind: 140, status: "Post-Landfall Kolkata Corridor", efi: 0.86, sot: 1.5, fss: 0.87, radius: 80 },
  { t: 132, lon: 88.8, lat: 23.2, wind: 95,  status: "Severe Cyclonic Storm Inland", efi: 0.79, sot: 1.2, fss: 0.82, radius: 100 },
  { t: 144, lon: 89.4, lat: 24.5, wind: 65,  status: "Cyclonic Depression", efi: 0.70, sot: 0.9, fss: 0.78, radius: 130 },
  { t: 156, lon: 90.1, lat: 25.8, wind: 45,  status: "Well-Marked Low (Assam)", efi: 0.62, sot: 0.6, fss: 0.71, radius: 160 },
  { t: 168, lon: 91.0, lat: 26.5, wind: 35,  status: "Remnant Low Pressure", efi: 0.54, sot: 0.4, fss: 0.65, radius: 200 },
  { t: 180, lon: 91.8, lat: 27.1, wind: 30,  status: "Dissipating", efi: 0.45, sot: 0.3, fss: 0.58, radius: 240 },
  { t: 192, lon: 92.4, lat: 27.5, wind: 25,  status: "Residual Moisture", efi: 0.38, sot: 0.2, fss: 0.52, radius: 280 },
  { t: 204, lon: 93.0, lat: 27.8, wind: 20,  status: "Orographically Dispersed", efi: 0.30, sot: 0.1, fss: 0.46, radius: 320 },
  { t: 216, lon: 93.5, lat: 28.0, wind: 15,  status: "Dissipated", efi: 0.22, sot: 0.0, fss: 0.40, radius: 360 },
  { t: 228, lon: 94.0, lat: 28.2, wind: 15,  status: "Dissipated", efi: 0.15, sot: 0.0, fss: 0.35, radius: 400 },
  { t: 240, lon: 94.5, lat: 28.3, wind: 10,  status: "No active vortex", efi: 0.10, sot: 0.0, fss: 0.30, radius: 450 }
];

const cycloneTimeSeries = cyclonePoints.map((p, idx) => {
  const d = new Date(Date.UTC(2020, 4, 15, p.t, 0, 0));
  const validStr = d.toISOString().replace('.000Z', '').replace('T', ' ') + ' UTC';
  const polygon = createCirclePolygon(p.lon, p.lat, p.radius, 32, 1.25, 45);
  
  let districts = ["Central Bay Offshore Shipping Zones"];
  if (p.t >= 72 && p.t <= 96) {
    districts = ["Puri", "Jagatsinghpur", "Kendrapara", "Bhadrak", "Balasore Coast"];
  } else if (p.t > 96 && p.t <= 132) {
    districts = ["Digha", "South 24 Parganas", "East Medinipur", "Kolkata Metro", "Howrah", "Sundarbans"];
  } else if (p.t > 132) {
    districts = ["Murshidabad", "Nadia", "North Bengal", "Meghalaya Hills"];
  }

  return {
    leadTime: p.t,
    validTime: validStr,
    coordinates: [Number(p.lon.toFixed(4)), Number(p.lat.toFixed(4))],
    intensity: `${p.wind} km/h (${p.status})`,
    numericMetric: p.wind,
    metricUnit: "km/h",
    efi: p.efi,
    sot: p.sot,
    exceedanceProb: Number(Math.min(0.99, p.efi * 1.05).toFixed(2)),
    footprintRadiusKm: p.radius,
    footprintPolygon: polygon,
    fssSkill: p.fss,
    affectedDistricts: districts,
    summary: `Vortex intensity ${p.wind} km/h. Footprint size ${p.radius} km calibrated from Fractions Skill Score (FSS=${p.fss}). ${p.status}.`
  };
});

// Threat 2: North-West India Extreme Heat Dome (Rajasthan)
const heatPoints = leadTimes.map((t) => {
  const d = new Date(Date.UTC(2020, 4, 15, t, 0, 0));
  const validStr = d.toISOString().replace('.000Z', '').replace('T', ' ') + ' UTC';
  // Slowly expanding anticyclonic heat ridge over Thar desert
  const centerLon = 72.8 + Math.sin(t / 40) * 0.4;
  const centerLat = 27.2 + Math.cos(t / 50) * 0.3;
  const peakTemp = 44.0 + (t >= 72 && t <= 168 ? 4.5 * Math.sin(((t - 72) / 96) * Math.PI) : 1.5);
  const efi = Number((0.72 + (peakTemp > 47 ? 0.23 : (peakTemp - 44) * 0.06)).toFixed(2));
  const sot = Number(((peakTemp - 43) * 0.4).toFixed(1));
  const radius = Math.round(280 - (t >= 96 && t <= 144 ? 80 : 0));
  
  return {
    leadTime: t,
    validTime: validStr,
    coordinates: [Number(centerLon.toFixed(4)), Number(centerLat.toFixed(4))],
    intensity: `${peakTemp.toFixed(1)}°C (Extreme Heat Dome)`,
    numericMetric: Number(peakTemp.toFixed(1)),
    metricUnit: "°C",
    efi: efi,
    sot: sot,
    exceedanceProb: Number(Math.min(0.96, efi * 1.02).toFixed(2)),
    footprintRadiusKm: radius,
    footprintPolygon: createCirclePolygon(centerLon, centerLat, radius, 28, 1.4, 20),
    fssSkill: 0.72,
    affectedDistricts: ["Jaisalmer", "Bikaner", "Churu", "Barmer", "Jodhpur", "Ganganagar", "Hisar"],
    summary: `Persistent 500hPa geopotential height ridge trapping extreme surface sensible heat. 99th percentile exceedance over Thar basin.`
  };
});

// Threat 3: Indo-Gangetic Plains Cold Wave
const coldPoints = leadTimes.map((t) => {
  const d = new Date(Date.UTC(2020, 4, 15, t, 0, 0));
  const validStr = d.toISOString().replace('.000Z', '').replace('T', ' ') + ' UTC';
  const centerLon = 77.5 + Math.sin(t / 60) * 0.5;
  const centerLat = 28.6 + Math.cos(t / 60) * 0.3;
  const minTemp = 5.2 - (t >= 48 && t <= 120 ? 2.8 : 0.8);
  const efi = -Number((0.75 + (t >= 48 && t <= 120 ? 0.18 : 0.05)).toFixed(2));
  const sot = Number((-1.4).toFixed(1));
  const radius = 310;
  
  return {
    leadTime: t,
    validTime: validStr,
    coordinates: [Number(centerLon.toFixed(4)), Number(centerLat.toFixed(4))],
    intensity: `${minTemp.toFixed(1)}°C (Severe Cold Day / Dense Fog)`,
    numericMetric: Number(minTemp.toFixed(1)),
    metricUnit: "°C",
    efi: efi,
    sot: sot,
    exceedanceProb: 0.89,
    footprintRadiusKm: radius,
    footprintPolygon: createCirclePolygon(centerLon, centerLat, radius, 28, 2.1, -15),
    fssSkill: 0.68,
    affectedDistricts: ["Amritsar", "Ludhiana", "Karnal", "Delhi-NCR", "Meerut", "Bareilly", "Kanpur"],
    summary: `Boundary layer temperature inversion with northwesterly cold advection. EFI 2m temperature below 1st percentile of M-climate.`
  };
});

// Threat 4: Western Ghats Extreme Precipitation Event
const rainPoints = leadTimes.map((t) => {
  const d = new Date(Date.UTC(2020, 4, 15, t, 0, 0));
  const validStr = d.toISOString().replace('.000Z', '').replace('T', ' ') + ' UTC';
  const centerLon = 73.8;
  const centerLat = 15.5 + Math.sin(t / 50) * 0.8;
  const peakRain = 180 + (t >= 48 && t <= 132 ? 180 * Math.sin(((t - 48) / 84) * Math.PI) : 40);
  const efi = Number((0.78 + (peakRain > 250 ? 0.16 : 0.05)).toFixed(2));
  const sot = Number(((peakRain / 100) * 0.7).toFixed(1));
  const radius = Math.round(190 - (t >= 72 && t <= 120 ? 55 : 0));
  
  return {
    leadTime: t,
    validTime: validStr,
    coordinates: [Number(centerLon.toFixed(4)), Number(centerLat.toFixed(4))],
    intensity: `${Math.round(peakRain)} mm/24h (Extremely Heavy Rainfall)`,
    numericMetric: Math.round(peakRain),
    metricUnit: "mm/24h",
    efi: efi,
    sot: sot,
    exceedanceProb: 0.94,
    footprintRadiusKm: radius,
    footprintPolygon: createCirclePolygon(centerLon, centerLat, radius, 28, 2.5, 75),
    fssSkill: 0.76,
    affectedDistricts: ["Ratnagiri", "Sindhudurg", "North Goa", "South Goa", "Uttara Kannada", "Udupi", "Shivamogga"],
    summary: `Intense low-level westerly jet impingement causing extreme orographic precipitation. CorrDiff downscaled members preserve 350+ mm peaks.`
  };
});

const threats = [
  {
    id: "threat-bob-amphan",
    cycleId: "cycle-2020051500",
    name: "Bay of Bengal Super Cyclone (Amphan)",
    hindiName: "बंगाल की खाड़ी महाचक्रवात (अम्फान)",
    type: "cyclone",
    severity: "Extreme Warning",
    region: "Bay of Bengal → Odisha / West Bengal Coast",
    leadTimeWindow: "Days 3–6 (+72h to +144h)",
    peakEfi: 0.96,
    sot: 2.3,
    memberAgreement: 21,
    totalMembers: 23,
    initialCoordinates: [86.4, 10.8],
    timeSeries: cycloneTimeSeries,
    verification: {
      powerSpectrumLabel: "CorrDiff diffusion maintains kinetic energy spectrum slope k^(-5/3) to 5 km grid cutoff without damping",
      tailQqDescription: "Extreme tail quantiles aligned with IPED gauge observations (slope = 0.98, R² = 0.94)",
      reliabilityScore: 0.91
    }
  },
  {
    id: "threat-thar-heat",
    cycleId: "cycle-2020051500",
    name: "Thar Basin Extreme Heat Dome",
    hindiName: "थार बेसिन चरम ग्रीष्म गुंबद (हीट वेव)",
    type: "heat",
    severity: "Warning",
    region: "Western Rajasthan & Punjab Border",
    leadTimeWindow: "Days 4–7 (+96h to +168h)",
    peakEfi: 0.94,
    sot: 1.8,
    memberAgreement: 20,
    totalMembers: 23,
    initialCoordinates: [72.8, 27.2],
    timeSeries: heatPoints,
    verification: {
      powerSpectrumLabel: "Boundary layer thermal plume variance preserved across downscaled 5 km tiles",
      tailQqDescription: "99th percentile maximum temperatures matched within 0.6°C of IMD automatic weather stations",
      reliabilityScore: 0.88
    }
  },
  {
    id: "threat-igp-cold",
    cycleId: "cycle-2023120200",
    name: "Indo-Gangetic Severe Cold Wave & Dense Fog",
    hindiName: "गंगा के मैदानी क्षेत्र में भीषण शीत लहर व कोहरा",
    type: "cold",
    severity: "Watch",
    region: "Punjab, Haryana, Delhi-NCR & Western UP",
    leadTimeWindow: "Days 2–5 (+48h to +120h)",
    peakEfi: -0.89,
    sot: -1.4,
    memberAgreement: 18,
    totalMembers: 23,
    initialCoordinates: [77.5, 28.6],
    timeSeries: coldPoints,
    verification: {
      powerSpectrumLabel: "Low-level fog boundary gradients resolved with sharp thermodynamic gradient detection",
      tailQqDescription: "Nighttime radiative minimum temperatures match calibrated IMDAA reanalysis",
      reliabilityScore: 0.84
    }
  },
  {
    id: "threat-ghats-rain",
    cycleId: "cycle-2024052400",
    name: "Western Ghats Orographic Flash Rain Event",
    hindiName: "पश्चिमी घाट अतिवृष्टि एवं बादल फटने का जोखिम",
    type: "rain",
    severity: "Extreme Warning",
    region: "Konkan, Goa & Coastal Karnataka",
    leadTimeWindow: "Days 3–5 (+72h to +120h)",
    peakEfi: 0.92,
    sot: 2.1,
    memberAgreement: 19,
    totalMembers: 23,
    initialCoordinates: [73.8, 15.5],
    timeSeries: rainPoints,
    verification: {
      powerSpectrumLabel: "Precipitation spectral density exhibits realistic convective cell structure down to 5 km",
      tailQqDescription: "High-intensity rainfall peaks > 300 mm/day verified against radar reflectivity estimates",
      reliabilityScore: 0.89
    }
  }
];

// Generate 23 member trajectories for the cyclone
const coastalDistricts = [
  "Puri, Odisha",
  "Jagatsinghpur (Paradip), Odisha",
  "Kendrapara, Odisha",
  "Bhadrak, Odisha",
  "Balasore, Odisha",
  "Digha, West Bengal",
  "Sundarbans / Kakdwip, WB",
  "Sagar Island, WB"
];

const memberTracks = [];
for (let m = 0; m < 23; m++) {
  const isCtrl = m === 0;
  // Perturbation factors
  const lonBias = isCtrl ? 0 : (Math.sin(m * 1.7) * 0.9 + Math.cos(m * 2.3) * 0.4);
  const latBias = isCtrl ? 0 : (Math.cos(m * 1.9) * 0.6);
  const speedMult = isCtrl ? 1.0 : (0.94 + ((m % 7) * 0.02));
  
  const points = cyclonePoints.map((basePt) => {
    const spreadFactor = Math.pow(basePt.t / 120, 1.4); // spread expands over lead time
    const ptLon = Number((basePt.lon + lonBias * spreadFactor * 0.55).toFixed(4));
    const ptLat = Number((basePt.lat + latBias * spreadFactor * 0.45).toFixed(4));
    const intensity = Math.round(basePt.wind * (isCtrl ? 1.0 : (0.88 + ((m * 13) % 25) * 0.01)));
    
    return {
      leadTime: basePt.t,
      coordinates: [ptLon, ptLat],
      intensity: intensity
    };
  });

  const landfallDistrict = coastalDistricts[m % coastalDistricts.length];

  memberTracks.push({
    memberId: m,
    name: isCtrl ? "Control Member (00)" : `Perturbed Member ${String(m).padStart(2, '0')}`,
    isControl: isCtrl,
    points: points,
    landfallPoint: points[10].coordinates, // ~108-120h
    landfallDistrict: landfallDistrict,
    landfallTime: "+108h (2020-05-19 12 UTC)"
  });
}

// Write out JSON files
fs.writeFileSync(path.resolve('src/data/threats.json'), JSON.stringify(threats, null, 2));
fs.writeFileSync(path.resolve('src/data/members.json'), JSON.stringify(memberTracks, null, 2));

console.log("Successfully generated threats.json and members.json with realistic meteorological distributions!");
