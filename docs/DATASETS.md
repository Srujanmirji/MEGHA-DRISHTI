# Datasets and Access Plan

## Target operational inputs

### NEPS-G

Published work using NCMRWF NEPS reports a 23-member global ensemble, about 12 km horizontal resolution and forecasts extending to 10 days.

**Access rule:** Do not claim the archive is public. If SIH provides NCMRWF access, write an adapter against the provided GRIB2/NetCDF files. Until then, the repository must remain runnable on open fallback data.

### NEPS-R

NCMRWF technical documentation describes a 4 km regional ensemble with 12 members in the cited configuration.

**Role in MEGHA-DRISHTI:** potential high-resolution training/target data if supplied by NCMRWF, not a dependency for the open demo.

## Open / accessible fallback

### IMDAA

- Regional Indian monsoon reanalysis.
- ~12 km.
- Original published production period: 1979–2018; later NCMRWF material notes extension to 2020.
- Official access references:
  - https://rds.ncmrwf.gov.in
  - https://rcc.imdpune.gov.in/download.php/sascof.php

Use for climatology, historical case studies and engineering the ingest pipeline.

### ERA5

- URL: https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels
- Use: global reanalysis fallback / climatological context.
- Confirm Copernicus licensing and credentials before automated download.

### GPM precipitation

- URL: https://gpm.nasa.gov/data
- Use: satellite precipitation verification.

### IBTrACS

- URL: https://www.ncei.noaa.gov/products/international-best-track-archive
- Use: observed tropical-cyclone track verification.

## Case study

### Cyclone Amphan (May 2020)

Use NASA Earth Observatory / Worldview imagery for visual context and IBTrACS/IMD track data for quantitative validation.

## Data policy

1. Keep large meteorological files out of Git.
2. Commit only tiny synthetic/sample fixtures.
3. Store downloaded data under `data/` and ignore by default.
4. Record source URL, retrieval time, license, spatial resolution, temporal resolution and variable units.
5. Never present synthetic demo values as observed or operational NCMRWF output.
