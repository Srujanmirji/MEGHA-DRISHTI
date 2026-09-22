# Data

Large meteorological datasets are intentionally excluded from Git.

Recommended local structure:

```text
data/
├── raw/
├── interim/
├── processed/
└── sample/
```

Every downloaded dataset should have a sidecar provenance record containing source URL, retrieval date, license/access conditions, variable units, grid definition and time coverage.

Do not commit restricted NCMRWF data.
