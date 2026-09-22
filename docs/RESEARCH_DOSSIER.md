# MEGHA-DRISHTI — 38-Section Research Dossier

## 1. Executive Summary
MEGHA-DRISHTI is a post-processing and decision-support framework for medium-range extreme-weather ensemble forecasts over India. Its central idea is to preserve member-level extremes instead of collapsing the forecast too early into an ensemble mean. The pipeline detects anomalous fields, identifies coherent threat objects, tracks them through forecast lead time, downscales member-wise fields, checks consistency, and converts the result into skill-aware probabilistic footprints.

The intended users are professional forecasters and researchers. The prototype is not a public-warning issuer.

## 2. SIH Problem Statement
Problem Statement 26078 asks for AI-driven spatio-temporal tracking of extreme weather anomalies in medium-range forecasts. The system therefore has to address both **where an anomalous feature is** and **how it evolves over time**, while remaining compatible with ensemble uncertainty.

## 3. Root Problem
The root problem is not simply "low resolution." It is that medium-range forecast uncertainty and spatial displacement can cause localized extremes to be blurred when fields are averaged or viewed only on coarse grids. A useful solution must preserve the distribution of plausible outcomes rather than sharpening only the ensemble mean.

## 4. NCMRWF Context
NCMRWF operates numerical weather prediction systems for India under the Ministry of Earth Sciences. Published studies describe the NEPS global ensemble as a 23-member, ~12 km system with a 10-day horizon. A regional ensemble at ~4 km provides higher-resolution guidance over a shorter window. These systems motivate a bridge between medium-range probabilistic information and higher-resolution hazard guidance.

## 5. End Users
Primary users:
- NCMRWF model/forecast scientists,
- IMD operational forecasters,
- researchers evaluating high-impact weather.

Secondary users:
- disaster-management analysts who consume products produced by authorized forecasters.

The prototype should expose uncertainty, provenance and lead time rather than hiding them.

## 6. Operational Forecast Cycle
The proposed system runs after each forecast cycle:
1. ingest member fields,
2. standardize metadata,
3. compute anomaly/tail diagnostics,
4. extract threat objects,
5. link objects across lead times,
6. downscale selected fields,
7. apply consistency checks,
8. aggregate member-level probabilities,
9. verify against observations once valid time passes.

## 7. Numerical Weather Prediction Basics
NWP forecasts evolve atmospheric state variables through numerical approximations to governing physical equations. Resolution determines the smallest scales directly represented by the model, but higher grid resolution does not automatically imply better forecast skill. Parametrization, initial conditions, boundary conditions and chaotic error growth all matter.

## 8. Ensemble Prediction
An ensemble contains multiple plausible forecasts generated through perturbations and/or model uncertainty. The ensemble is valuable because it approximates forecast uncertainty. MEGHA-DRISHTI therefore treats the member dimension as first-class data rather than discarding it early.

## 9. NEPS-G
Published literature reports NEPS with:
- 23 members,
- ~12 km horizontal resolution,
- daily operational cycles in the referenced configuration,
- forecast horizon to 10 days.

The exact current configuration must be verified against the NCMRWF data supplied for SIH before operational claims are made.

## 10. NEPS-R
NCMRWF technical documentation describes a regional ensemble with:
- 12 members,
- 4 km horizontal resolution,
- 80 vertical levels in the cited configuration.

MEGHA-DRISHTI treats NEPS-R primarily as a potential high-resolution target/training source where the organizer provides access.

## 11. Why Medium Range Matters
At days 4–10, emergency planners and forecasters gain valuable preparation time, but forecast spread generally grows. Products should therefore become more uncertainty-aware as lead time increases instead of presenting a single sharp deterministic location.

## 12. Extreme-Weather Forecasting
Extreme events are difficult because they often depend on tail behavior:
- heavy rainfall,
- intense wind,
- heat/cold extremes,
- cyclone intensity,
- mesoscale organization.

A metric optimized for average error can improve while still degrading the extremes users care about.

## 13. Cyclone-Relevant Variables
For a tropical-cyclone use case, candidate fields include:
- mean sea-level pressure,
- 10 m wind components / speed,
- precipitation,
- vorticity,
- geopotential / steering-flow features,
- humidity and temperature diagnostics.

The SIH prototype can remain limited to three variables while preserving an extensible schema.

## 14. Extreme Rainfall
Rainfall is intermittent, highly skewed and spatially displaced. Pixelwise RMSE alone penalizes near-miss high-resolution forecasts heavily and can reward overly smooth predictions. Spatial verification such as FSS is therefore important.

## 15. Ensemble-Mean Peak Smearing
Suppose several members place a 100 mm rainfall core at slightly different locations. Their mean can become a broader, lower-intensity feature even if many members independently predict a severe localized event. The mean is useful, but not sufficient for preserving member-level extremes.

## 16. Resolution Gap
A coarse grid cannot explicitly resolve every local structure that exists in a convective-scale analysis. Downscaling tries to infer plausible sub-grid structure conditioned on large-scale state, but it cannot create guaranteed deterministic truth.

## 17. Forecast Uncertainty
Uncertainty comes from:
- initial conditions,
- model physics,
- unresolved scales,
- stochastic perturbations,
- lead-time growth,
- observation error.

The product should communicate probability and skill scale, not only a high-resolution raster.

## 18. Lead-Time Degradation
A key design requirement is lead-time-conditioned verification. A field that is useful at 48 h may be poorly localized at 168 h. Skill-aware footprints should therefore widen when spatial predictability decreases.

## 19. Existing NCMRWF/IMD Workflow
The project should integrate as post-processing guidance rather than replace authoritative forecast operations. The dashboard is a forecaster aid; public warnings remain the responsibility of authorized agencies.

## 20. Existing Global Ensemble Methods
Operational centers already use ensemble probabilities, clustering, EFI-like diagnostics, spaghetti/track plots and model-climate comparisons. MEGHA-DRISHTI is differentiated by combining anomaly detection, member-wise object tracking, stochastic downscaling and verification-derived spatial footprints in one pipeline.

## 21. ECMWF EFI
The Extreme Forecast Index compares the ensemble forecast distribution with a model-climate distribution at the same location/season/lead time. It is useful because "30% chance above threshold" is not equally unusual everywhere.

## 22. Shift of Tails
SOT complements EFI by examining how far the ensemble tail extends relative to model climate. This is useful when the key question is not only "is this unusual?" but "how extreme could the tail be?"

## 23. AI Global Weather Models
GraphCast, AIFS, Pangu-Weather and related systems demonstrate the value of machine-learning weather prediction. But a global AI forecast model and a regional probabilistic post-processing/downscaling system solve different problems. MEGHA-DRISHTI does not position itself as a replacement for global NWP.

## 24. Probabilistic AI Forecasting
Generative/probabilistic weather models such as GenCast show that representing a forecast distribution is important. This aligns with preserving ensemble diversity rather than forcing all uncertainty into one deterministic field.

## 25. Statistical Downscaling Baselines
Before diffusion, establish simple baselines:
- bilinear interpolation,
- bicubic interpolation,
- bias correction,
- quantile mapping,
- regression.

A complex model should only be kept if it improves relevant metrics.

## 26. Deep-Learning Downscaling
Super-resolution networks can learn mappings from coarse fields to high-resolution targets. Deterministic regression often produces conditional means and can smooth extremes; probabilistic approaches aim to represent multiple plausible fine-scale outcomes.

## 27. Diffusion Downscaling
CorrDiff is a generative correction diffusion approach for km-scale atmospheric downscaling available in NVIDIA PhysicsNeMo. Its framework uses a deterministic/regression component plus diffusion-based stochastic correction.

For MEGHA-DRISHTI:
- it is a research path,
- it must be retrained/adapted on the target domain,
- its output must be validated,
- CorrDiff-Mini is educational and must not be represented as operational.

## 28. Object-Based Extreme Detection
After computing anomaly/tail fields, thresholded areas can be converted into connected components. For each object:
- centroid,
- area,
- peak,
- mean intensity,
- bounding geometry,
- variable,
- member,
- valid time
are stored.

## 29. Proposed MEGHA-DRISHTI Method
The complete method is:
1. member-preserving ingest,
2. anomaly/tail scoring,
3. object extraction,
4. spatio-temporal linking,
5. member-wise downscaling,
6. physical/coarse-grid checks,
7. probability aggregation,
8. skill-aware footprint construction,
9. API/dashboard delivery,
10. continuous verification.

## 30. Peak-Preserving Ensemble Processing
The term "peak-preserving" means:
- never average members before detecting severe signals,
- track peak statistics per member,
- compare downscaled peaks with target/reference distributions,
- enforce or test coarse-grid consistency,
- report whether the method improves peak error rather than asserting it.

## 31. Threat Tracking Algorithm
A prototype track linker can define a matching cost between object A(t) and B(t+1):

```text
cost =
  w_d * normalized_centroid_distance
+ w_o * (1 - spatial_overlap)
+ w_i * normalized_intensity_change
```

Matches above a maximum distance or below an overlap/intensity plausibility threshold are rejected. More advanced versions can use Hungarian assignment, Kalman prediction, optical flow or learned graph matching.

## 32. Physics-Aware / Consistency Checks
"Physics-aware" should be concrete:
- unit validation,
- nonnegative precipitation,
- wind-speed consistency from u/v components,
- bounded humidity where relevant,
- MSLP plausibility ranges,
- spatial aggregation of high-res output approximately reproduces coarse input,
- spectral checks for unrealistic small-scale noise.

These checks are guards, not a proof of physical correctness.

## 33. System Architecture
Data layer:
- GRIB2/NetCDF,
- cfgrib,
- xarray,
- Dask,
- Zarr.

Science layer:
- NumPy,
- SciPy,
- MetPy,
- optional xESMF,
- PyTorch / PhysicsNeMo for diffusion experiments.

Service layer:
- FastAPI,
- PostgreSQL/PostGIS,
- GeoJSON.

Frontend:
- Next.js,
- MapLibre.

## 34. Data Pipeline
Canonical internal schema:

```text
dims = [forecast_reference_time, lead_time, member, lat, lon]
variables = [precip, u10, v10, mslp, ...]
```

Pipeline stages should be deterministic, versioned and resumable:
```text
raw → standardized → derived → objects → tracks → downscaled → footprints → verified
```

## 35. Prototype
The open-source prototype in this repository deliberately uses synthetic data by default. That makes it runnable without pretending that restricted operational archives are available.

MVP:
- generate synthetic moving extreme,
- detect anomalies,
- label objects,
- track centroids,
- perform interpolation baseline,
- generate ensemble exceedance probability,
- serve results via FastAPI.

Diffusion is a replaceable module, not required for the first working demo.

## 36. Verification
Required metrics:
- CRPS,
- Brier score,
- reliability,
- RMSE/MAE/bias,
- peak error,
- track-position error,
- FSS,
- spectral power,
- spread-skill.

Metrics must be stratified by lead time and event intensity.

## 37. Limitations, Risks and Roadmap
Major risks:
- restricted NCMRWF archive access,
- domain shift between short-lead high-resolution training data and longer-lead forecasts,
- hallucinated fine-scale structure from generative models,
- cyclone intensity errors,
- overconfident visualization,
- model/version drift.

Roadmap:
- Phase 1: synthetic/open-data end-to-end MVP,
- Phase 2: historical Indian events + baseline verification,
- Phase 3: authorized NCMRWF integration,
- Phase 4: retrained generative downscaling,
- Phase 5: shadow-mode operational evaluation.

## 38. References and Evidence Matrix
The complete URL/evidence matrix is maintained in [SOURCES.md](SOURCES.md).

Key references:
- NCMRWF NEPS context: Neal et al. (2022)
- NCMRWF regional ensemble: NMRF/TR/03/2021
- IMDAA: Rani et al. (2021)
- EFI/SOT: ECMWF Forecast User Guide
- Diffusion downscaling: NVIDIA PhysicsNeMo CorrDiff
- Spatial verification: Roberts & Lean (2008)
- Amphan imagery/context: NASA Earth Observatory

### Final research discipline
Every presentation claim must be one of:
1. directly supported by a cited source,
2. measured by our prototype,
3. explicitly labeled as a design proposal/assumption.

Never silently convert a proposal into an established fact.
