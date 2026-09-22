from __future__ import annotations

import numpy as np
from scipy.ndimage import binary_dilation


def probability_footprint(member_masks: np.ndarray) -> np.ndarray:
    """Convert [member, y, x] boolean masks to exceedance probability."""
    if member_masks.ndim != 3:
        raise ValueError("member_masks must have shape [member, y, x]")
    return np.mean(member_masks.astype(float), axis=0)


def dilate_to_skill_scale(mask: np.ndarray, radius_pixels: int) -> np.ndarray:
    """Simple uncertainty-footprint expansion.

    The radius must come from verification/skill analysis in a real system.
    """
    if radius_pixels <= 0:
        return mask.astype(bool)
    y, x = np.ogrid[-radius_pixels: radius_pixels + 1, -radius_pixels: radius_pixels + 1]
    structure = x * x + y * y <= radius_pixels * radius_pixels
    return binary_dilation(mask.astype(bool), structure=structure)
