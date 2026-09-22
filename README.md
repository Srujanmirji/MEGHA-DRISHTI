# MEGHA-DRISHTI

**SIH 2026 · Problem Statement 26078 · CodeX_2026**

**AI-driven spatio-temporal tracking and peak-preserving downscaling of extreme weather in medium-range forecasts.**

MEGHA-DRISHTI is a research + prototype project for NCMRWF/IMD forecaster guidance. The system is designed to identify anomalous weather signals in medium-range ensemble forecasts, track them through time, preserve member-wise extremes, and produce high-resolution probabilistic guidance without collapsing uncertainty into a single ensemble mean.

> Status: research prototype. Not an operational public-warning system.

## Core idea

NCMRWF's global ensemble prediction system (NEPS-G) provides medium-range probabilistic forecasts at about 12 km horizontal resolution out to 10 days. A regional convective-scale ensemble (NEPS-R) provides much finer guidance, but over a much shorter horizon. MEGHA-DRISHTI explores a post-processing bridge for the medium-range window:

```text
NEPS-G ensemble
   ↓
EFI / SOT anomaly detection
   ↓
4-D object tracking
   ↓
member-wise peak-preserving downscaling
   ↓
physics / consistency checks
   ↓
skill-aware probabilistic footprints
   ↓
FastAPI guidance service
   ↓
forecaster dashboard
```

## Prototype scope

The SIH pilot is deliberately narrow:

- Region: Bay of Bengal / east coast of India
- Case study: Cyclone Amphan replay
- Variables: precipitation, 10 m wind, mean sea-level pressure
- Input: public/open fallback data for the runnable demo; NEPS-G/NEPS-R integration only where access is available
- Output: research guidance for forecasters, not public alerts

## Repository map

```text
MEGHA-DRISHTI/
├── README.md
├── docs/
│   ├── RESEARCH_DOSSIER.md
│   ├── SOURCES.md
│   ├── ARCHITECTURE.md
│   ├── DATASETS.md
│   ├── VALIDATION.md
│   └── SIH_QA.md
├── backend/
│   ├── app/
│   └── requirements.txt
├── megha_drishti/
│   ├── ingest.py
│   ├── extremes.py
│   ├── tracking.py
│   ├── downscale.py
│   ├── footprints.py
│   └── pipeline.py
├── scripts/
│   └── demo.py
└── tests/
    └── test_extremes.py
```

## Technology stack

- **4-D data:** xarray, Dask, Zarr
- **Meteorology / numerics:** NumPy, SciPy, MetPy
- **Downscaling research path:** PyTorch + NVIDIA PhysicsNeMo regional diffusion recipes
- **API:** FastAPI
- **Geospatial store (operational path):** PostgreSQL + PostGIS
- **Frontend target:** Next.js + MapLibre GL

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

python scripts/demo.py
uvicorn backend.app.main:app --reload
```

The demo uses synthetic ensemble data so the repository runs without restricted NCMRWF archives.

## Important scientific distinction

The prototype does **not** claim that a downscaled field is a new deterministic truth. The system keeps ensemble members separate, measures anomaly / tail behavior, tracks coherent objects through time, and only then produces probabilistic guidance. Spatial alert footprints should widen or narrow according to demonstrated verification skill rather than being drawn as fixed high-resolution pins.

## Research package

See:

- [38-section research dossier](docs/RESEARCH_DOSSIER.md)
- [verified source library](docs/SOURCES.md)
- [architecture](docs/ARCHITECTURE.md)
- [datasets and access notes](docs/DATASETS.md)
- [verification plan](docs/VALIDATION.md)
- [judge / Q&A preparation](docs/SIH_QA.md)

## SIH presentation

The current SIH deck is maintained separately from the executable prototype. The repository documentation is written so every technical claim in the deck can be traced to a source or marked clearly as a proposed design choice.

## License

Research / hackathon prototype. Add the final team-selected open-source license before public reuse or deployment.
