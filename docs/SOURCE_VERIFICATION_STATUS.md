# Source Verification Status for Current Deck

This file separates already-verified references from claims that still need primary-source checking before final SIH submission.

## Verified / usable now

- NCMRWF NEPS 23-member, ~12 km, 10-day configuration as reported by Neal et al. (2022):
  https://rmets.onlinelibrary.wiley.com/doi/10.1002/met.2083

- NCMRWF NEPS-R 12 members, 4 km in the cited technical-report configuration:
  https://www.ncmrwf.gov.in/NCUM-R_Tech_Report_12Mar21.pdf

- IMDAA 12 km regional reanalysis, originally 1979–2018:
  https://journals.ametsoc.org/view/journals/clim/34/12/JCLI-D-20-0412.1.xml
  https://www.ncmrwf.gov.in/publications/2021/44-2021.pdf

- ECMWF EFI/SOT:
  https://confluence.ecmwf.int/spaces/FUG/pages/673551287/Section+8.1.9+Extreme+Forecast+Index+-+EFI%2C+and+Shift+of+Tails+-+SOT

- ECMWF SOT detail:
  https://confluence.ecmwf.int/spaces/FUG/pages/673551310/Section+8.1.9.3+Calculating+the+Shift+of+Tails+-+SOT

- NVIDIA PhysicsNeMo CorrDiff:
  https://docs.nvidia.com/physicsnemo/latest/physicsnemo/examples/weather/corrdiff/README.html
  https://github.com/NVIDIA/physicsnemo/tree/main/examples/weather/corrdiff

- Cyclone Amphan NASA imagery/context:
  https://science.nasa.gov/earth/earth-observatory/tropical-cyclone-amphan-146746/
  https://science.nasa.gov/earth/earth-observatory/amphan-batters-india-bangladesh-146749/

- Fractions Skill Score:
  https://doi.org/10.1175/2007MWR2123.1

## Claims to re-check before final deck

The uploaded presentation currently mentions references/claims such as:
- “Weng et al., JGR Atmospheres 2026” with a precise predictability-scale statement,
- “MoES Rajya Sabha reply, Feb 2026,”
- “Atmospheric Research 2019” for NEPS verification,
- “arXiv 2509.18994” for physical constraints in AIFS,
- “IndiaWeatherBench arXiv 2509.00653,”
- “IPED 0.1° rainfall ensemble, Scientific Data 2025,”
- exact statement that NEPS-R “stops at ~75 h,”
- exact statement that scales below 100 km are predictable for less than one day.

These should not remain in the final deck merely because they are written in the current PPT. Verify the exact publication and the exact claim first. If the source does not directly support the wording, rewrite or remove the claim.

## Naming corrections

Use:
- **NVIDIA PhysicsNeMo**
- **CorrDiff**

Avoid the typos:
- “Physics DeMo”
- “CarDiff”
