# MEGHA-DRISHTI — Research Notes (PS 26078)

**Smart India Hackathon 2026 · Problem Statement 26078 · Team CodeX_2026**

This document records the research behind MEGHA-DRISHTI: what exists today, where the gap is, what the literature says, and why the system is designed the way it is. Every factual claim links to a source in the [source library](#14-source-library). For the full method (formulas, data, API, verification plan), see the [Detailed Technical Report](../report/MEGHA-DRISHTI_Detailed_Report.pdf).

> **Evidence labels.** **Fact** = stated in a cited source. **Inference** = our conclusion from several facts. **Assumption** = must be validated in the pilot.

---

## 1. The problem, decoded

NCMRWF's global ensemble (NEPS-G) gives 23 possible futures out to 10 days at 12 km. The signals forecasters need — a cyclone intensifying, a heat dome building, a cold wave — sit in the tails of that distribution, in a few members, over small areas. Two things make them hard to use:

1. **Coarse resolution beyond day 3.** 12 km partially resolves localised extremes; NCMRWF's own verification of the 12 km NEPS notes it may still be too coarse for very localised events [2].
2. **Manual interpretation.** Finding where the ensemble signals an abnormal event, and following it through lead time, is done largely by inspecting charts.

The problem statement adds a third: standard deep-learning downscalers trained with mean-squared error regress to the mean and blur the extreme amplitudes forecasters need [8].

**Root problem (Inference).** For days 4–10, where no high-resolution ensemble exists, forecasters have no automated way to (a) find where the ensemble's tail has shifted and (b) express what that shift means at terrain-relevant scale — without either blurring the extremes away or claiming precision the atmosphere does not allow.

## 2. What India already runs, and the gap

| System | Description | Source |
|---|---|---|
| **NEPS-G** | Global ensemble, 12 km, 23 members (1 control + 22 perturbed), 10 days; operational at 12 km since June 2018 | [1] |
| **NEPS-R** | Regional ensemble, 4 km, 12 members, ~72–75 h, explicit convection | [1] |
| **NCUM-G / NCUM-R** | Deterministic global 12 km (10 days); regional 4 km (72 h) and 1.5 km (48 h) | [1] |
| **Bharat Forecast System (IITM)** | 6 km deterministic global model over 30°S–30°N, launched May 2025 | [6] |
| **IMDAA** | Regional reanalysis, 12 km hourly, 1979–2020, available on registration | [3], [4] |

| Lead time | High-res deterministic | High-res ensemble | Status |
|---|---|---|---|
| Days 0–3 | NCUM-R 4 km, BFS 6 km | NEPS-R 4 km | Covered |
| Days 4–7 | BFS 6 km | — | **Gap: probabilistic high-res** |
| Days 8–10 | — | — | **Gap** |

![Lead-time gap](../figures/lead_time_gap.png)

**Inference.** The defensible contribution is high-resolution *probabilistic* guidance for days 4–10. MoES has stated in Parliament that IITM and NCMRWF are working on AI in forecasting alongside ensemble systems and impact-based forecasting [5].

## 3. Global landscape and related work

| Work | What it does | Strength | Limitation for India | Lesson |
|---|---|---|---|---|
| **ECMWF EFI & SOT** [7] | Compares the ensemble CDF with the *model climate* CDF; SOT measures how far the tail extends | Operational standard for automated extreme flagging | Built for ECMWF's model | Use the definition as-is on NEPS-G |
| **GraphCast** (DeepMind) | GNN on an icosahedral multimesh | Fast global forecasts | Deterministic; blurs at long lead | An icosahedral GNN is a *forecasting* model, not a tracker |
| **GenCast** (DeepMind) [8] | Diffusion ensemble on a spherical mesh | Sharp members, realistic spectra; beats ENS on most targets | 0.25°; replaces rather than post-processes NEPS-G | Ensemble means blur by construction |
| **CorrDiff** (NVIDIA) [9] | Regression UNet + diffusion residual; 25 km → 2 km (Taiwan) | Preserves spectra and tails; open-source [10] | Typhoon structure only partly corrected | Reuse for Stage 2; report the cyclone limitation |
| **CorrDiff GEFS→HRRR** (NVIDIA) | Ensemble downscaling to 3 km | Ensemble-to-km precedent | US only | No Indian equivalent exists |
| **ECMWF AIFS** [11] | ML forecast with bounding layers for physical constraints | Practical physics constraint | Coarse | Adopt bounding layers (e.g., non-negative rain) |
| **IndiaWeatherBench** [12] | ML-ready benchmark built from IMDAA | Saves data-prep time | Reanalysis only | Use for fallback training |
| **IPED** [13] | Station-based 0.1° ensemble daily rainfall, 1991–2020 | Best observational rainfall grid for India | ~11 km, daily | Verification ground truth |

**Inference.** Every component exists separately. What does not exist is a pipeline that applies EFI/SOT to NEPS-G, downscales NEPS-G members using NEPS-R as the high-resolution target, and ties guidance precision to verified skill.

## 4. Pain points and evidence

| Pain point | Evidence | Opportunity |
|---|---|---|
| Manual extreme detection | PS 26078 statement | Deterministic EFI/SOT + object tracking |
| 12 km too coarse for local extremes | [2] | Downscaling |
| ML blurs peaks | MSE regression to the mean [8] | Diffusion, per member |
| Ensemble mean blurs peaks | [8] | Never downscale the mean |
| Cyclone intensity hard to downscale | [9] | Report structure errors explicitly |
| High-res ensemble stops at day 3 | [1] | Target days 4–10 |
| Small scales are unpredictable at long lead | [14], [15] | Skill-aware footprints |

## 5. Design refinements, with evidence

The problem statement proposes a specific architecture. MEGHA-DRISHTI keeps its goals and refines four points:

| Refinement | Reason | Source |
|---|---|---|
| EFI against a **NEPS-G model climate**, not a reanalysis (ERA5 or IMDAA) | EFI is defined against the model's own climate for the same location, season and lead time; a reanalysis mixes model bias into the anomaly | [7] |
| **Deterministic** detection and tracking | EFI and SOT are closed-form statistics; a neural network is not needed to compute them, and a deterministic method is fully explainable | [7] |
| Downscale **each member**, never the ensemble mean | The ensemble mean is blurred by construction | [8] |
| Footprint size set by **measured skill** (Fractions Skill Score), not a fixed 5 km | Intrinsic predictability is under a day for scales below ~100 km; Indian Ocean cyclone intrinsic predictability is limited to ~66 h | [14], [15], [16] |

**Where IMDAA fits.** IMDAA is used for climatological context, as fallback training data if NEPS archives are not available, and for benchmarking — not as the EFI reference climate.

## 6. Data availability findings

| Dataset | Status | Use |
|---|---|---|
| NEPS-G archive | **No public archive found** — requested from NCMRWF | Input; model climate |
| NEPS-R archive | **Not public** — requested from NCMRWF | Training target |
| IMDAA | Public on registration [4] | Context; fallback |
| IndiaWeatherBench | Open [12] | Fallback training |
| IPED, IMERG | Open [13] | Verification |
| ECMWF AIFS ENS | Open data, CC-BY 4.0 | Robustness tests; prototype |

**Fact.** No observational 5 km truth exists for India at scale; the finest station-based product is 0.1° [13]. The downscaling target is therefore model output (NEPS-R), the same approach CorrDiff used with a regional model [9].

**Assumption.** A model trained on NEPS-G ↔ NEPS-R pairs from days 0–3 transfers to days 4–10. This is the main scientific risk and is tested explicitly (lead-time conditioning, coarsen-consistency, per-lead reporting).

## 7. Technology choices

| Technology | Decision | Why |
|---|---|---|
| EFI/SOT + connected components + track linking | **Use** | Standard, explainable, fast |
| CorrDiff (PhysicsNeMo) | **Use** | Published, open, preserves tails |
| Quantile mapping + terrain regression | **Use as mandatory baseline** | Every ML claim must beat it |
| xarray / Dask / Zarr, MetPy | **Use** | Standard for 4D met data |
| Icosahedral GNN for tracking | **Reject** | A forecasting architecture; not needed to compute an index |
| LLMs, vector databases, blockchain | **Reject** | No problem here that they solve |

## 8. Compute

**Fact.** NVIDIA documents a CorrDiff-Mini training example at about 10 A100 GPU-hours and full continental-US CorrDiff training at about 5,000 A100 GPU-hours [10]. **Inference.** A single-region pilot is feasible on one rented GPU; all-India training belongs on MoES HPC.

## 9. Risks

| Risk | Level | Mitigation |
|---|---|---|
| NEPS archives not public | High | Formal request; IMDAA fallback, disclosed |
| Train days 0–3, apply days 4–10 | High | Lead-time conditioning; coarsen-consistency; per-lead reporting |
| Diffusion may not beat statistics | Medium | Baseline always runs; honest per-variable results |
| Cyclone intensity under-corrected | Medium | Known CorrDiff limit; report structure errors |
| Noisy tails in a short model climate | Medium | Seasonal and spatial pooling; quantify uncertainty |
| False precision at long lead | Medium | FSS-sized footprints |
| NEPS-G upgrades | Low | Version pinning; drift monitoring |

## 10. Validation plan (summary)

Power spectra and tail quantile–quantile plots (peak preservation), CRPS and Brier scores (probabilistic accuracy), reliability diagrams (calibration), Fractions Skill Score by scale and lead (spatial skill; drives footprints), coarsen-consistency error (physics), and hit rate / false-alarm ratio for anomaly objects. A full season is held out; results are reported against the baseline and by lead time. Case studies: Cyclone Fani (Odisha, 2019) and Cyclone Amphan (2020), subject to archive availability.

![Skill-aware footprints](../figures/skill_aware_footprints.png)

*Illustrative: alert zones drawn to explain the concept on real geography (Natural Earth). In the pilot, zones come from model output.*

## 11. Open research gap

**Inference.** No published work downscales NEPS-G members using NEPS-R as the high-resolution target, and no operational system ties alert spatial granularity to lead-time-dependent verified skill.

## 12. Limitations

The target is model output, not observations; day 4–10 skill is unknown until measured; the NEPS-G model climate is short; the pilot covers one region and a few variables; the system post-processes NEPS-G and does not replace numerical weather prediction.

## 13. Pilot region

![Pilot region](../figures/pilot_region_map.png)

## 14. Source library

1. NCMRWF — *Ensemble Prediction System for Tropical Cyclone prediction*, WMO training, New Delhi, 2022. https://severeweather.wmo.int/TCFW/NewDelhi_Training2022/2_EPS_for_TC_Prediction_AS.pdf
2. Verification of high resolution (12 km) Global Ensemble Prediction System, *Atmospheric Research*, 2019. https://www.sciencedirect.com/science/article/abs/pii/S0169809519305484
3. Rani et al., IMDAA, *Journal of Climate*, 2021. https://journals.ametsoc.org/view/journals/clim/34/12/JCLI-D-20-0412.1.xml
4. NCMRWF Reanalysis Data Service. https://www.ncmrwf.gov.in/data/
5. MoES, Rajya Sabha reply, February 2026. https://www.moes.gov.in/static/uploads/2026/02/c93fe1dfa6791c76462e5106561eaa1e.pdf
6. Bharat Forecast System launch coverage, May 2025. https://visionias.in/current-affairs/news-today/2025-05-27/environment/ministry-of-earth-science-launches-bharat-forecast-system-with-improved-6-km-grid-accuracy
7. ECMWF Forecast User Guide §8.1.9 — EFI and SOT. https://confluence.ecmwf.int/display/FUG/Section+8.1.9+Extreme+Forecast+Index+-+EFI,+and+Shift+of+Tails+-+SOT
8. Price et al., GenCast, *Nature*, 2025. https://arxiv.org/pdf/2312.15796
9. Mardani et al., CorrDiff, *Communications Earth & Environment*, 2025. https://www.nature.com/articles/s43247-025-02042-5
10. NVIDIA PhysicsNeMo — CorrDiff example. https://github.com/NVIDIA/physicsnemo/blob/main/examples/weather/corrdiff/README.md
11. ECMWF, An update to the AIFS, arXiv:2509.18994, 2025. https://arxiv.org/html/2509.18994v1
12. IndiaWeatherBench, arXiv:2509.00653, 2025. https://arxiv.org/pdf/2509.00653
13. IPED, *Scientific Data*, 2025. https://www.nature.com/articles/s41597-025-04474-2
14. Weng et al., *JGR Atmospheres*, 2026 (citing Ying & Zhang, 2017). https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2025JD045130
15. Taraphdar et al., *JGR Atmospheres*, 2014. https://adapt.psu.edu/ZHANG/papers/Taraphdaretal2014JGR.pdf
16. Roberts & Lean, Scale-selective verification of rainfall accumulations, *Monthly Weather Review*, 136, 2008.
17. Natural Earth — map data. https://www.naturalearthdata.com/
