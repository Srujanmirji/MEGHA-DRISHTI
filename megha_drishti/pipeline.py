from __future__ import annotations

import numpy as np

from .extremes import extract_objects
from .tracking import link_objects
from .footprints import probability_footprint


def run_member_tracking(
    member_time_scores: np.ndarray,
    threshold: float = 2.0,
    min_pixels: int = 4,
    max_distance_pixels: float = 12.0,
) -> dict:
    """Run object extraction + tracking for [member, time, y, x] scores."""
    if member_time_scores.ndim != 4:
        raise ValueError("Expected [member, time, y, x]")

    all_tracks = []
    masks = member_time_scores >= threshold

    for m in range(member_time_scores.shape[0]):
        objects_by_time = [
            extract_objects(member_time_scores[m, t], threshold, min_pixels)
            for t in range(member_time_scores.shape[1])
        ]
        tracks = link_objects(objects_by_time, max_distance_pixels=max_distance_pixels)
        all_tracks.append(tracks)

    return {
        "tracks": all_tracks,
        "probability_by_time": np.stack(
            [probability_footprint(masks[:, t]) for t in range(masks.shape[1])],
            axis=0,
        ),
    }
