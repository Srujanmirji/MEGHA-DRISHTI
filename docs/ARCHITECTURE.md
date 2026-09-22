# System Architecture

## Operational concept

```text
NCMRWF / fallback forecast files
GRIB2 / NetCDF
       │
       ▼
[Ingest]
cfgrib + xarray + Dask
       │
       ├── raw member fields
       ▼
[Normalize / Regrid]
xarray + xESMF (optional)
       │
       ▼
[Extreme Detector]
EFI-like anomaly score + tail score
NumPy / SciPy
       │
       ▼
[Object Extractor]
connected components + morphology
SciPy ndimage
       │
       ▼
[4-D Track Builder]
centroid / overlap / intensity-cost matching
SciPy
       │
       ├── member tracks
       ▼
[Downscaler]
Baseline: interpolation / quantile mapping
Research: PyTorch + PhysicsNeMo CorrDiff
       │
       ▼
[Consistency Checks]
physical bounds + coarse-grid conservation check
       │
       ▼
[Skill-aware Footprint Engine]
probability field + verification-derived spatial scale
       │
       ▼
[Guidance Store]
PostgreSQL + PostGIS / Zarr
       │
       ▼
[FastAPI]
JSON / GeoJSON guidance
       │
       ▼
[Forecaster Dashboard]
Next.js + MapLibre
```

## Why member-wise processing?

Ensemble averaging can smooth spatially displaced intense features. MEGHA-DRISHTI therefore preserves each member through detection, tracking and downscaling, then aggregates member-level evidence into probabilities.

The product is not a deterministic 5 km forecast. It is a high-resolution representation of ensemble-conditioned scenarios plus uncertainty.

## Data model

Primary dimensions:

```text
forecast_reference_time
lead_time
member
latitude
longitude
variable
```

Derived entities:

```text
ThreatObject:
  id
  member
  valid_time
  variable
  centroid_lat
  centroid_lon
  area_km2
  peak
  mean
  anomaly_score
  tail_score
  geometry

ThreatTrack:
  track_id
  member
  objects[]
  genesis_time
  end_time
  max_intensity
  displacement

GuidanceFootprint:
  valid_time
  hazard
  probability
  skill_scale_km
  geometry
  provenance
```

## API sketch

- `GET /health`
- `GET /v1/runs`
- `GET /v1/threats?run=...&hazard=...`
- `GET /v1/tracks/{track_id}`
- `GET /v1/footprints?valid_time=...`
- `GET /v1/provenance/{product_id}`

Every guidance response should include model/run metadata, data-source provenance, processing version and caveats.
