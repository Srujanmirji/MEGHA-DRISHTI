# Verification Plan

MEGHA-DRISHTI is useful only if it improves actionable guidance without manufacturing false precision.

## Baselines

Every learned method must be compared against:

1. Native coarse ensemble.
2. Bilinear/bicubic spatial interpolation.
3. Quantile-mapping or other simple statistical correction.
4. Where possible, a deterministic regression downscaler.

## Deterministic field metrics

- RMSE / MAE
- Bias
- Correlation
- Peak-value error
- Peak-location error
- Radius-of-maximum-wind error for cyclone cases where appropriate
- Spectral power by spatial scale

## Probabilistic metrics

- CRPS
- Brier score for exceedance events
- Reliability diagrams
- Rank histograms
- Spread-skill relationship

## Spatial-event metrics

- Fractions Skill Score (FSS) over a range of neighborhood sizes
- Object centroid displacement
- Intersection-over-union / overlap
- Track position error as a function of lead time

## Peak preservation

For each member and lead:

```text
peak_ratio = downscaled_peak / reference_peak
```

Also report coarse-grid consistency:

```text
aggregate(downscaled) ≈ coarse_input
```

A high-resolution output that creates visually sharp but unphysical peaks fails this check.

## Skill-aware footprint

The alert footprint must not imply a fixed 5 km localization when the forecast is only skillful at a broader spatial scale.

Procedure:

1. Compute FSS over neighborhoods (e.g. 5, 10, 20, 40, 80, 160 km).
2. Determine the smallest spatial scale meeting the team-selected useful-skill criterion.
3. Build / dilate guidance footprints to at least that uncertainty scale.
4. Recompute by lead-time bin.
5. Show the footprint scale transparently in the dashboard.

## Case-study split

Avoid training and evaluating on the same event. The Cyclone Amphan replay is a demonstration case; quantitative claims require held-out events or time-blocked validation.

## Reporting

Never report "100% accuracy." Publish:
- dataset period,
- sample/event count,
- lead-time range,
- baseline,
- metric definition,
- confidence interval where feasible,
- known failure cases.
