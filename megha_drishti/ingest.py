from __future__ import annotations

from pathlib import Path
import xarray as xr


def open_forecast(path: str | Path, engine: str | None = None) -> xr.Dataset:
    """Open a forecast dataset without discarding ensemble/member dimensions.

    For GRIB2, callers can pass engine="cfgrib". NetCDF/Zarr can use the
    corresponding xarray backend.
    """
    path = Path(path)
    if path.suffix == ".zarr" or path.name.endswith(".zarr"):
        return xr.open_zarr(path)
    return xr.open_dataset(path, engine=engine)


def validate_core_dims(ds: xr.Dataset) -> None:
    """Validate that the dataset contains the dimensions the pipeline needs."""
    aliases = {
        "member": {"member", "number", "realization"},
        "lead_time": {"lead_time", "step", "forecast_period"},
        "lat": {"lat", "latitude"},
        "lon": {"lon", "longitude"},
    }
    dims = set(ds.dims)
    missing = [name for name, options in aliases.items() if not (dims & options)]
    if missing:
        raise ValueError(f"Missing required forecast dimensions: {missing}")
