# Source Library

This file is the evidence index for MEGHA-DRISHTI. Prefer primary/official sources for presentation claims. For each source, the "supports" field states exactly what we use it for.

## NCMRWF / Indian forecast systems

1. **Neal et al. (2022), Meteorological Applications — probabilistic medium-range forecasting over India**
   - URL: https://rmets.onlinelibrary.wiley.com/doi/10.1002/met.2083
   - Supports: operational NCMRWF NEPS configuration reported in the study: 23 members, about 12 km horizontal resolution, daily 00 UTC update, forecasts to 10 days.
   - Use: problem framing, input-system description.

2. **NCMRWF Technical Report NMRF/TR/03/2021 — NCUM-R / NEPS-R upgrade**
   - URL: https://www.ncmrwf.gov.in/NCUM-R_Tech_Report_12Mar21.pdf
   - Supports: NEPS-R has 12 members (1 control + 11 perturbed), 4 km horizontal resolution and 80 vertical levels in the reported configuration.
   - Use: feasibility argument for learning high-resolution regional structure.

3. **Rani et al. (2021), Journal of Climate — IMDAA**
   - URL: https://journals.ametsoc.org/view/journals/clim/34/12/JCLI-D-20-0412.1.xml
   - NCMRWF copy: https://www.ncmrwf.gov.in/publications/2021/44-2021.pdf
   - Supports: IMDAA is a ~12 km regional reanalysis over the Indian monsoon region, originally covering 1979–2018, based on 4D-Var and the UK Met Office Unified Model.
   - Use: public/open historical fallback and climatology source.

4. **IMD Climate Research & Services — IMDAA download page**
   - URL: https://rcc.imdpune.gov.in/download.php/sascof.php
   - Supports: official IMD description and data access route for IMDAA.
   - Use: prototype-data access note.

## Extreme-weather ensemble diagnostics

5. **ECMWF Forecast User Guide — EFI and SOT**
   - URL: https://confluence.ecmwf.int/spaces/FUG/pages/673551287/Section+8.1.9+Extreme+Forecast+Index+-+EFI%2C+and+Shift+of+Tails+-+SOT
   - Supports: EFI compares ensemble forecast distributions against model climate to highlight anomalous/extreme weather.
   - Use: anomaly detector.

6. **ECMWF Forecast User Guide — Shift of Tails**
   - URL: https://confluence.ecmwf.int/spaces/FUG/pages/673551310/Section+8.1.9.3+Calculating+the+Shift+of+Tails+-+SOT
   - Supports: SOT complements EFI by comparing distribution tails and conveys how extreme ensemble-tail outcomes may be.
   - Use: severity / tail diagnostic.

7. **ECMWF data catalogue — ensemble EFI/SOT products**
   - URL: https://www.ecmwf.int/en/forecasts/datasets/set-iii
   - Supports: EFI and SOT are operational/post-processed ensemble products available over multi-day ranges.
   - Use: existing-solutions comparison.

8. **ECMWF eLearning — EFI and SOT**
   - URL: https://learning.ecmwf.int/enrol/index.php?id=41
   - Supports: training reference for construction, use and limitations of EFI/SOT.
   - Use: team preparation / Q&A.

## Diffusion / AI downscaling

9. **NVIDIA PhysicsNeMo — CorrDiff documentation**
   - URL: https://docs.nvidia.com/physicsnemo/latest/physicsnemo/examples/weather/corrdiff/README.html
   - Source code: https://github.com/NVIDIA/physicsnemo/tree/main/examples/weather/corrdiff
   - Supports: generative correction diffusion for km-scale atmospheric downscaling; regression + diffusion design; custom-dataset workflow.
   - Important: CorrDiff-Mini is educational and NVIDIA explicitly warns it is not for real operational prediction.
   - Use: research prototype, not operational claim.

10. **Mardani et al. — CorrDiff / generative downscaling research**
    - Search/landing source: NVIDIA documentation references within the CorrDiff page above.
    - Supports: scientific basis for stochastic kilometer-scale atmospheric downscaling.
    - Use: methodology justification.
    - Note: cite the exact paper/DOI from the version used in the final report; do not cite a guessed year/title.

## Verification

11. **Roberts & Lean (2008) — Fractions Skill Score (FSS)**
    - DOI: https://doi.org/10.1175/2007MWR2123.1
    - Supports: neighborhood-based verification for high-resolution precipitation forecasts.
    - Use: determine spatial scales on which a forecast has useful skill and avoid false precision.

12. **METplus / Model Evaluation Tools**
    - URL: https://metplus.readthedocs.io/
    - Supports: operationally oriented forecast verification tooling and standard metrics.
    - Use: reproducible verification implementation.

13. **xskillscore**
    - URL: https://xskillscore.readthedocs.io/
    - Supports: xarray-compatible verification metrics.
    - Use: CRPS / probabilistic verification pipeline.

## Data engineering

14. **xarray**
    - URL: https://docs.xarray.dev/
    - Supports: labeled N-dimensional arrays suited to meteorological grids.

15. **Dask**
    - URL: https://docs.dask.org/
    - Supports: chunked/lazy parallel computation for larger-than-memory arrays.

16. **Zarr**
    - URL: https://zarr.readthedocs.io/
    - Supports: chunked cloud-friendly N-dimensional storage.

17. **cfgrib**
    - URL: https://github.com/ecmwf/cfgrib
    - Supports: reading GRIB with xarray.

18. **MetPy**
    - URL: https://unidata.github.io/MetPy/latest/
    - Supports: meteorological calculations and units-aware diagnostics.

19. **SciPy ndimage**
    - URL: https://docs.scipy.org/doc/scipy/reference/ndimage.html
    - Supports: connected-component labeling and numerical image operations for object extraction.

## API / geospatial dashboard

20. **FastAPI**
    - URL: https://fastapi.tiangolo.com/
    - Use: guidance API.

21. **PostGIS**
    - URL: https://postgis.net/documentation/
    - Use: storing threat tracks and polygons.

22. **MapLibre GL JS**
    - URL: https://maplibre.org/maplibre-gl-js/docs/
    - Use: interactive geospatial dashboard.

23. **Next.js**
    - URL: https://nextjs.org/docs
    - Use: frontend application shell.

## Cyclone Amphan case-study imagery

24. **NASA Earth Observatory — Tropical Cyclone Amphan, 19 May 2020**
    - URL: https://science.nasa.gov/earth/earth-observatory/tropical-cyclone-amphan-146746/
    - Supports: satellite image and documented storm context before landfall.

25. **NASA Earth Observatory — Amphan landfall, 20 May 2020**
    - URL: https://science.nasa.gov/earth/earth-observatory/amphan-batters-india-bangladesh-146749/
    - Supports: documented May 20 landfall and satellite observation.

26. **NASA Worldview**
    - URL: https://worldview.earthdata.nasa.gov/
    - Use: real satellite imagery for the presentation.

27. **ISRO MOSDAC**
    - URL: https://www.mosdac.gov.in/
    - Use: Indian satellite / meteorological data discovery where applicable.

## Additional benchmark / comparison systems

28. **ECMWF AIFS**
    - URL: https://www.ecmwf.int/en/forecasts/dataset/aifs-machine-learning-data
    - Use: Phase-2 comparison input where licensing/access allows.

29. **Google DeepMind GraphCast**
    - URL: https://www.science.org/doi/10.1126/science.adi2336
    - Use: existing AI global-weather baseline/context, not as a direct replacement for probabilistic downscaling.

30. **Google DeepMind GenCast**
    - URL: https://www.nature.com/articles/s41586-024-08252-9
    - Use: probabilistic AI weather context.

## Citation discipline

- Do not write "there is no existing solution."
- Distinguish **existing operational methods** (e.g. EFI/SOT), **published research methods** (e.g. CorrDiff), and **our proposed integration**.
- Do not claim NCMRWF archive/API availability unless the team has actually accessed it.
- Do not claim 5 km output improves forecast skill until verified against observations.
- Every numerical claim in the PPT should point to one of the sources above or be explicitly marked as a prototype assumption.
