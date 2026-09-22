# SIH Judge Q&A

## What problem are you solving in one sentence?

Medium-range ensemble forecasts contain valuable extreme-event signals, but spatial displacement, coarse resolution and ensemble averaging can hide local peaks; MEGHA-DRISHTI detects and tracks those signals member-by-member and converts them into uncertainty-aware high-resolution forecaster guidance.

## Why not just use the ensemble mean?

Because displaced intense features can cancel/smooth when averaged. We retain every member through the hazard pipeline and aggregate probabilities only after member-wise detection, tracking and downscaling.

## Why EFI and SOT?

EFI is an established ECMWF approach for measuring how unusual an ensemble forecast distribution is relative to model climate. SOT complements it by examining the forecast distribution tail. We use the ideas as transparent anomaly/tail diagnostics rather than inventing an unexplained "AI severity score."

## Are you replacing NCMRWF or IMD forecasting systems?

No. The project is post-processing / decision-support guidance. NCMRWF produces numerical guidance; IMD owns public warning responsibilities. The prototype is not a public alert issuer.

## Why diffusion?

Stochastic diffusion can represent unresolved spatial variability rather than producing only a smooth conditional mean. But diffusion is not assumed to win: interpolation/statistical baselines run in parallel and verification decides.

## Is CorrDiff plug-and-play for India?

No. NVIDIA provides the framework and examples; an Indian-domain model requires appropriate paired coarse/high-resolution training data, normalization and validation.

## Where does the 5 km claim come from?

It is a target output grid for the prototype, not a claim of 5 km forecast skill. The dashboard separates grid spacing from demonstrated skill scale.

## What happens if NEPS archives are unavailable?

The open prototype runs on synthetic/open data. The production adapter is isolated so NCMRWF files can be substituted when access is formally provided. We do not fake restricted integrations.

## How do you prevent false precision at day 7–10?

Through probabilistic products, lead-time-stratified verification and FSS-derived spatial footprints rather than fixed pins.

## How do you prove improvement?

Against native-resolution and simple downscaling baselines using CRPS/Brier/reliability, FSS, peak-value error, peak-location error and track error.

## What is the minimum demo?

A historical Bay of Bengal case with:
1. ensemble-like input,
2. anomaly detection,
3. member threat objects,
4. track linking,
5. baseline downscaling,
6. probability footprint,
7. dashboard/API output.

The diffusion module can be swapped in when training data and compute are available.

## Biggest technical risks?

- access to NCMRWF ensemble archives,
- domain shift from short-lead high-resolution training to longer lead times,
- diffusion-generated artifacts,
- intensity under-correction,
- false spatial precision,
- model upgrades/input drift.

Each risk has an explicit baseline or monitoring fallback.
