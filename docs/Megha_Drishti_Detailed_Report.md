# MEGHA-DRISHTI
## Detailed Technical Report

**Smart India Hackathon 2026 · Problem Statement 26078 · Team CodeX_2026**

**Problem Statement:** AI-Driven Spatio-Temporal Tracking of Extreme Weather Anomalies in Medium-Range Forecasts

**Project status:** Research prototype for forecaster guidance. It is not an autonomous public-warning system.

> **Core idea.** Preserve every ensemble member through extreme detection, threat tracking and downscaling; aggregate only at the end into probabilistic, skill-aware guidance so local extremes are not hidden by early averaging.

This report documents the problem, scientific rationale, architecture, algorithms, data plan, prototype, verification framework, risks and deployment roadmap behind MEGHA-DRISHTI.

<!-- PAGEBREAK -->

# 1. Problem and operational context

Published work using NCMRWF's global ensemble prediction system (NEPS) describes a 23-member ensemble at about 12 km horizontal resolution extending to 10 days. NCMRWF technical documentation for the cited regional ensemble (NEPS-R) describes a 12-member, approximately 4 km system aimed at short-range probabilistic guidance.

MEGHA-DRISHTI targets the medium-range problem without claiming to replace either NCMRWF numerical prediction or IMD warning operations. The project is a post-processing and decision-support layer.

## Why the problem matters

At medium range, the atmosphere becomes less predictable at small spatial scales. A useful system must therefore communicate uncertainty instead of showing a single sharp location. The main failure modes MEGHA-DRISHTI addresses are:

- **Peak smearing:** spatially displaced intense ensemble members can become broader and weaker when averaged.
- **Coarse representation:** a 12 km grid cannot explicitly resolve every local feature important to high-impact weather.
- **Manual interpretation burden:** forecasters must inspect large volumes of member/lead-time guidance.
- **False precision:** visually sharp high-resolution maps can imply more location skill than the forecast actually possesses.

## End users

Primary users are NCMRWF model/forecast scientists and IMD operational forecasters. Disaster-management and agricultural users are downstream consumers through authorized forecast products; the prototype does not bypass official warning responsibility.

## Case-study anchor

Cyclone Amphan (May 2020) is used as a visible replay case because public satellite imagery is available from NASA Earth Observatory and public best-track position/intensity data is available through NOAA IBTrACS.

<!-- PAGEBREAK -->

# 2. End-to-end methodology

The system is designed so that a transparent baseline works before any complex AI model is introduced.

## Stage 1 - Ingest

Forecast files are opened without collapsing the ensemble-member dimension. The target internal schema is:

- forecast reference time
- lead time
- ensemble member
- latitude
- longitude
- meteorological variable

GRIB2/NetCDF ingestion uses cfgrib and xarray. Dask enables lazy parallel computation. Zarr is used for chunked intermediate storage.

## Stage 2 - Detect extreme signals

ECMWF's Extreme Forecast Index (EFI) compares an ensemble forecast distribution against a model-climate distribution for the same location, season and lead time. Shift of Tails (SOT) complements EFI by describing how extreme the ensemble tail could become.

> **Implementation honesty.** True EFI/SOT requires the corresponding model-climate distributions. If those are unavailable in the open prototype, the code uses a clearly named standardized-anomaly fallback rather than falsely claiming to compute operational EFI.

## Stage 3 - Extract and track threat objects

Thresholded anomaly fields become connected objects. Each object stores centroid, area, peak intensity, mean intensity, bounding geometry, ensemble member and valid time.

Objects are linked across lead times using a matching cost based on:

- centroid displacement,
- spatial overlap,
- intensity change,
- optional motion prediction.

The MVP uses a deliberately simple inspectable tracker; production experiments can use Hungarian assignment, Kalman motion prediction or learned graph matching.

## Stage 4 - Member-wise downscaling

The system downscales each member independently. Bilinear interpolation and statistical correction are mandatory baselines. A generative path can later use NVIDIA PhysicsNeMo CorrDiff if it improves held-out verification.

## Stage 5 - Probability footprint

Member scenarios are aggregated only after detection/tracking/downscaling. The result is a probability field plus a spatial uncertainty/skill scale.

## Stage 6 - Verify

When observations become available, verification updates the lead-time- and hazard-specific skill estimates used by the footprint engine.

<!-- PAGEBREAK -->

# 3. System architecture and data contract

## Named architecture

**Forecast input** → **cfgrib / xarray / Dask / Zarr** → **NumPy / SciPy / MetPy threat science** → **baseline or PyTorch / PhysicsNeMo downscaling** → **verification and skill footprint engine** → **PostgreSQL / PostGIS + Zarr** → **FastAPI guidance API** → **Next.js / MapLibre forecaster dashboard**

Every architecture box names a concrete technology and every derived product retains provenance.

## Canonical dimensions

The scientific data model keeps:

`forecast_reference_time × lead_time × member × latitude × longitude`

Variables such as precipitation, 10 m wind components and mean sea-level pressure are stored with units and accumulation metadata. Variables with incompatible semantics must not be silently mixed.

## Derived entities

### ThreatObject
- object ID
- member
- valid time
- variable / hazard
- centroid
- area
- peak and mean intensity
- anomaly / tail score
- geometry

### ThreatTrack
- track ID
- member
- ordered objects
- genesis/end time
- maximum intensity
- displacement and motion metadata

### GuidanceFootprint
- forecast run
- valid time
- hazard
- probability
- useful/verified spatial scale
- polygon geometry
- processing provenance

## Provenance

Every output should identify source dataset, forecast cycle, model/configuration version, processing version, lead time, member set and verification status. This prevents a visually polished map from losing scientific traceability.

<!-- PAGEBREAK -->

# 4. Peak-preserving ensemble processing

"Peak-preserving" is an engineering discipline, not a claim of perfect forecast intensity.

Consider several ensemble members predicting similarly intense rainfall cores at slightly different locations. Each member may contain a severe local maximum, but the ensemble mean can become a lower, wider feature because the peaks do not align spatially.

MEGHA-DRISHTI therefore follows these rules:

1. Never average members before threat detection.
2. Record peak statistics and object geometry per member.
3. Track each member's threat evolution separately.
4. Downscale each member, not only the ensemble mean.
5. Aggregate member evidence into probabilities after the member-wise stages.
6. Compare all learned downscalers against simple baselines.
7. Report whether peak error improves; do not assume that it does.

## Cyclone-oriented diagnostics

Where observations support them, useful diagnostics include:

- minimum mean sea-level pressure,
- maximum near-surface wind,
- precipitation maxima,
- track-position error,
- radius-of-maximum-wind error,
- object centroid/area evolution.

The final set depends on the data actually available.

> **Key distinction.** A sharper image is not automatically a better forecast. Visual detail and verified skill are separate quantities.

<!-- PAGEBREAK -->

# 5. Baseline-first generative downscaling

NVIDIA PhysicsNeMo documents CorrDiff as a generative correction diffusion framework for kilometer-scale atmospheric downscaling and provides a path for training on custom datasets.

MEGHA-DRISHTI uses a baseline-first progression:

## B0 - Interpolation baseline
Bilinear/bicubic interpolation establishes the "no-learning" reference.

## B1 - Statistical correction
Bias correction or quantile mapping tests whether simple calibration is sufficient.

## M1 - Deterministic learned downscaling
A regression model tests whether learned local structure improves field and extreme metrics without stochastic sampling.

## M2 - CorrDiff-style stochastic downscaling
A diffusion model can generate fine-scale residual structure conditioned on coarse atmospheric fields. It is retained only if it improves relevant held-out metrics.

NVIDIA's custom-dataset documentation shows that training can be computationally demanding and data-hungry. The project therefore does **not** claim a generic fixed training cost. Compute requirements must be measured on the actual Indian-domain pilot.

## Consistency and plausibility guards

- non-negative precipitation,
- unit validation,
- u/v component and wind-speed consistency,
- plausible physical bounds,
- lead-time conditioning,
- aggregation of high-resolution output back toward the coarse input,
- spectral tests for unrealistic small-scale noise.

The target output grid can be approximately 5 km for the prototype, but this is only a grid spacing. The trustworthy spatial skill scale is determined independently through verification.

<!-- PAGEBREAK -->

# 6. Verification framework

The scientific question is not "does the output look sharper?" It is "does the workflow add useful information without creating false confidence?"

## Deterministic metrics
- RMSE
- MAE
- bias
- correlation
- peak-value error
- peak-location error

## Probabilistic metrics
- Continuous Ranked Probability Score (CRPS)
- Brier score for exceedance events
- reliability diagrams
- rank histograms
- spread-skill relationship

## Spatial and object metrics
- Fractions Skill Score (FSS) across neighborhood sizes
- object centroid displacement
- overlap / intersection metrics
- track-position error by lead time
- spectral power by spatial scale

FSS is especially important because it evaluates high-resolution forecasts in neighborhoods rather than requiring exact pixel-by-pixel alignment. It can help identify spatial scales at which a forecast becomes useful.

> **No leakage rule.** Cyclone Amphan can be the visible replay/demo event, but it must not be both the training example and the only evaluation proof. Quantitative claims require held-out events or time-blocked validation.

## Observation / reference data

Potential open verification sources include NASA GPM precipitation, NOAA IBTrACS tropical-cyclone position/intensity, ERA5 global reanalysis and IMDAA Indian regional reanalysis. Each product has different strengths and should only be used for variables/resolutions it actually supports.

<!-- PAGEBREAK -->

# 7. Runnable SIH prototype and API

The GitHub prototype is deliberately runnable without restricted NCMRWF archives. This avoids claiming an integration that the team has not yet been given permission or data to test.

## Current prototype

- synthetic moving extreme-event ensemble generator,
- transparent standardized anomaly score,
- connected-component threat extraction,
- greedy spatio-temporal object linking,
- ensemble exceedance probability,
- interpolation downscaling baseline,
- coarse-grid consistency error,
- probability-footprint generation,
- FastAPI service skeleton,
- unit tests.

## Production upgrades

**Ingest:** map organizer-provided NEPS GRIB conventions and variables.

**Detection:** use full model-climate EFI/SOT when the required climatology is available.

**Tracking:** test Hungarian assignment, motion-aware matching and hazard-specific constraints.

**Downscaling:** train deterministic and CorrDiff candidates on authorized paired coarse/high-resolution data.

**Footprints:** derive uncertainty/footprint scale from lead-time-stratified verification rather than a manual fixed radius.

## Target API

- `GET /v1/runs`
- `GET /v1/threats`
- `GET /v1/tracks/{track_id}`
- `GET /v1/footprints`
- `GET /v1/provenance/{product_id}`

Every guidance response should include run/model metadata and caveats.

> **Demo contract.** Synthetic or open fallback data must always be labeled as such. NCMRWF operational data integration is only claimed after the team actually receives and tests it.

<!-- PAGEBREAK -->

# 8. Feasibility, risks and deployment roadmap

The project is feasible as a staged post-processing system because every complex stage has a simpler baseline and explicit fallback.

## Major risks

### Restricted ensemble archives - High
**Mitigation:** keep an open/synthetic end-to-end demo; implement NCMRWF adapters only after formal data access.

### Short-lead high-resolution data may not generalize to days 4-10 - High
**Mitigation:** lead-time conditioning, held-out validation by lead bin and comparison with non-ML baselines.

### Generative model can invent unrealistic fine-scale structure - High
**Mitigation:** coarse-grid consistency, physical bounds, spectra and observation-based verification.

### High-resolution map can create false precision - High
**Mitigation:** expose probabilities and FSS-derived useful scale; widen footprints as verified localization skill falls.

### Diffusion may not beat simple statistics - Medium
**Mitigation:** keep interpolation and statistical baselines in the official evaluation.

### Operational model versions change - Medium
**Mitigation:** version-pin data/processing metadata, monitor input drift, and retrain/recalibrate only after measured drift.

## Phased roadmap

**Phase 1 - SIH MVP:** open/synthetic pipeline and Amphan replay visualization.

**Phase 2 - Historical pilot:** multiple Indian events and held-out baseline verification.

**Phase 3 - Authorized NCMRWF integration:** real ensemble file handling validated with domain experts.

**Phase 4 - Generative downscaling:** domain-trained model retained only after it beats baselines on extremes and spatial skill.

**Phase 5 - Shadow operations:** automated cycle processing, provenance, forecaster dashboard and human-in-the-loop evaluation.

> **Governance:** NCMRWF/IMD remain authoritative. MEGHA-DRISHTI is evidence-linked forecaster guidance, not an autonomous alert issuer.

<!-- PAGEBREAK -->

# 9. Verified references and source links

1. Neal et al. (2022), *The application of predefined weather patterns over India within probabilistic medium-range forecasting tools for high-impact weather*.  
https://rmets.onlinelibrary.wiley.com/doi/10.1002/met.2083

2. NCMRWF, *Implementation of NCMRWF Regional Ensemble Prediction System (NEPS-R)* technical report.  
https://www.ncmrwf.gov.in/NCUM-R_Tech_Report_12Mar21.pdf

3. ECMWF Forecast User Guide, *Extreme Forecast Index - EFI, and Shift of Tails - SOT*.  
https://confluence.ecmwf.int/spaces/FUG/pages/673551287/Section+8.1.9+Extreme+Forecast+Index+-+EFI%2C+and+Shift+of+Tails+-+SOT

4. ECMWF Forecast User Guide, *Calculating the Shift of Tails - SOT*.  
https://confluence.ecmwf.int/spaces/FUG/pages/673551310/Section+8.1.9.3+Calculating+the+Shift+of+Tails+-+SOT

5. NVIDIA PhysicsNeMo, *CorrDiff: Generative Correction Diffusion Model for Kilometer-Scale Atmospheric Downscaling*.  
https://docs.nvidia.com/physicsnemo/latest/physicsnemo/examples/weather/corrdiff/README.html

6. Roberts & Lean (2008), *Scale-selective verification of rainfall accumulations from high-resolution forecasts of convective events*.  
https://doi.org/10.1175/2007MWR2123.1

7. Rani et al. (2021), *IMDAA: High-Resolution Satellite-Era Reanalysis for the Indian Monsoon Region*.  
https://doi.org/10.1175/JCLI-D-20-0412.1

8. Copernicus Climate Data Store, ERA5 hourly data on single levels.  
https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels

9. NASA Earth Observatory, *Tropical Cyclone Amphan*, 19 May 2020.  
https://science.nasa.gov/earth/earth-observatory/tropical-cyclone-amphan-146746/

10. NOAA NCEI, International Best Track Archive for Climate Stewardship (IBTrACS).  
https://www.ncei.noaa.gov/products/international-best-track-archive

11. NASA Global Precipitation Measurement Mission - data portal.  
https://gpm.nasa.gov/data

12. MEGHA-DRISHTI repository.  
https://github.com/Srujanmirji/MEGHA-DRISHTI

> **Evidence rule for SIH submission.** Every numerical or technical claim should be either directly supported by a source, measured by the prototype, or explicitly labeled as a proposed target/assumption. Do not silently convert design intent into verified fact.
