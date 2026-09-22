from __future__ import annotations

import numpy as np
from scipy import ndimage


def z_anomaly(field: np.ndarray, climatology_mean: np.ndarray, climatology_std: np.ndarray) -> np.ndarray:
    """Simple transparent anomaly score used by the open prototype.

    This is NOT ECMWF EFI. Operational EFI requires forecast and model-climate
    distributions. We keep this fallback explicit so the demo does not pretend
    to implement unavailable model-climate products.
    """
    denom = np.maximum(np.asarray(climatology_std, dtype=float), 1e-6)
    return (np.asarray(field, dtype=float) - climatology_mean) / denom


def exceedance_probability(members: np.ndarray, threshold: float, axis: int = 0) -> np.ndarray:
    """Fraction of ensemble members exceeding a threshold."""
    members = np.asarray(members)
    return np.mean(members > threshold, axis=axis)


def extract_objects(score: np.ndarray, threshold: float, min_pixels: int = 4) -> list[dict]:
    """Extract connected extreme objects from a 2-D score field."""
    mask = np.asarray(score) >= threshold
    labels, count = ndimage.label(mask)
    objects: list[dict] = []

    for label_id in range(1, count + 1):
        yy, xx = np.where(labels == label_id)
        if len(xx) < min_pixels:
            continue
        values = score[yy, xx]
        objects.append(
            {
                "label": int(label_id),
                "pixel_count": int(len(xx)),
                "centroid_y": float(np.mean(yy)),
                "centroid_x": float(np.mean(xx)),
                "peak": float(np.max(values)),
                "mean": float(np.mean(values)),
                "bbox": [int(xx.min()), int(yy.min()), int(xx.max()), int(yy.max())],
            }
        )
    return objects
