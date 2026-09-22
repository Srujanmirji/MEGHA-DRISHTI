# SIH 2026 Presentation Content

This markdown mirrors the current 6-slide submission deck so the technical content is version-controlled even when the binary PPTX is edited outside GitHub.

## Slide 1 — Title
- Smart India Hackathon 2026
- Problem Statement ID: 26078
- Problem Statement: AI-Driven Spatio-Temporal Tracking of Extreme Weather Anomalies in Medium-Range Forecasts
- Theme: Smart Automation
- Category: Software
- Team: CodeX_2026

## Slide 2 — MEGHA-DRISHTI overview
**MEGHA-DRISHTI: AI-driven tracking and peak-preserving downscaling of extreme weather in medium-range forecasts**

Current deck framing:
- medium-range global ensemble guidance is coarser than short-range regional ensemble guidance,
- local extremes can be blurred by coarse resolution and ensemble averaging,
- proposed system automatically detects threats in the ensemble, tracks them, and downscales members individually.

Pipeline blocks shown in deck:
1. Input ensemble
2. Extreme Forecast Index
3. Shift of Tails
4. Threat tracking
5. Per-member downscaling
6. Physics / consistency checks
7. Skill-aware alert footprints

Core innovation:
- peaks averaged away → member-wise downscaling
- manual chart scanning → automated threat tracks
- over-precise false alerts → skill-sized footprints

Case-study visual: Cyclone Amphan, May 2020. Use a real NASA Worldview / ISRO MOSDAC image and cite it visibly.

## Slide 3 — Technical approach
Implementation loop:
1. Ingest — GRIB2 → Zarr
2. Detect — EFI + SOT
3. Track — 10-day paths
4. Downscale — diffusion AI
5. Alert — skill-sized footprints
6. Verify — updates skill estimates

Architecture:
- Forecast ensemble → detect & track → diffusion downscaling → footprint engine → FastAPI/PostGIS → dashboard
- Named technologies: xarray, Dask, Zarr, NumPy/SciPy/MetPy, PyTorch/PhysicsNeMo, FastAPI, PostGIS, Next.js, MapLibre.

Important correction:
- Write **NVIDIA PhysicsNeMo / CorrDiff**, not “Physics DeMo / CarDiff”.

## Slide 4 — Feasibility and viability
Pilot scope:
- one region,
- three variables,
- Cyclone Amphan replay.

Technical basis:
- EFI/SOT are established ensemble-extreme diagnostics.
- CorrDiff is an open research framework for stochastic atmospheric downscaling.
- xarray/Dask/Zarr provide a practical data-engineering stack.

Key risks:
- ensemble archive access,
- short-lead → long-lead domain shift,
- diffusion may not beat simple baselines,
- intensity under-correction,
- false precision at long lead,
- model-version drift.

Mitigation:
- keep open fallback data,
- lead-time conditioning,
- statistical baseline in parallel,
- explicit peak/intensity metrics,
- verification-derived spatial footprint,
- input/version monitoring.

## Slide 5 — Impact and benefits
Core message: **honest alerts shrink only when demonstrated spatial skill rises**.

Do not equate output grid spacing with forecast skill. A day-8 product on a 5 km grid may still only be trustworthy on a much larger spatial scale.

Target users:
- IMD duty forecasters,
- NCMRWF scientists,
- disaster-management users via authorized forecast products,
- agricultural advisory workflows where appropriate.

Metrics to validate before impact claims:
- forecaster time saved,
- false-alarm / miss behavior,
- FSS by lead time,
- CRPS / reliability,
- peak error,
- track error,
- useful spatial scale.

## Slide 6 — Research and references
The live source index is maintained in `docs/SOURCES.md`.

Design findings that drive the project:
- preserve individual ensemble members before aggregation,
- use model-climate-aware extreme diagnostics where the required climatology exists,
- distinguish grid spacing from useful spatial skill,
- treat diffusion as an experimentally verified module, not guaranteed improvement,
- keep an open-data prototype path when restricted operational archives are unavailable.

## PPT citation rule
Every numerical or scientific claim on the final deck must:
1. cite a visible source on the slide,
2. match what that source actually says,
3. distinguish verified fact from project target/assumption.

See `docs/SOURCES.md` for verified links.
