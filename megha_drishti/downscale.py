from __future__ import annotations

import numpy as np
from scipy.ndimage import zoom


def interpolation_baseline(field: np.ndarray, scale_y: float, scale_x: float, order: int = 1) -> np.ndarray:
    """Transparent baseline downscaler using scipy.ndimage.zoom.

    order=1 -> bilinear-like interpolation for 2-D gridded fields.
    """
    if field.ndim != 2:
        raise ValueError("interpolation_baseline expects a 2-D field")
    return zoom(field, (scale_y, scale_x), order=order)


def coarse_consistency_error(
    high_res: np.ndarray,
    coarse: np.ndarray,
    factor_y: int,
    factor_x: int,
) -> float:
    """RMSE after block-averaging high-res output back to coarse resolution."""
    hy, hx = high_res.shape
    cy, cx = coarse.shape
    if hy != cy * factor_y or hx != cx * factor_x:
        raise ValueError("high_res shape must equal coarse shape times integer factors")

    aggregated = high_res.reshape(cy, factor_y, cx, factor_x).mean(axis=(1, 3))
    return float(np.sqrt(np.mean((aggregated - coarse) ** 2)))
