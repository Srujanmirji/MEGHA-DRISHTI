from __future__ import annotations

from dataclasses import dataclass
from math import hypot


@dataclass
class TrackPoint:
    time_index: int
    centroid_x: float
    centroid_y: float
    peak: float
    object_id: int | None = None


def _distance(a: dict, b: dict) -> float:
    return hypot(a["centroid_x"] - b["centroid_x"], a["centroid_y"] - b["centroid_y"])


def link_objects(
    objects_by_time: list[list[dict]],
    max_distance_pixels: float = 12.0,
) -> list[list[TrackPoint]]:
    """Greedy baseline object tracker.

    Production work can replace this with Hungarian assignment / Kalman or
    graph matching. The MVP keeps the logic inspectable for SIH judging.
    """
    tracks: list[list[TrackPoint]] = []

    for t, objects in enumerate(objects_by_time):
        unmatched = set(range(len(objects)))

        for track in tracks:
            if not track or track[-1].time_index != t - 1:
                continue

            last = track[-1]
            candidates = []
            for idx in unmatched:
                obj = objects[idx]
                d = hypot(obj["centroid_x"] - last.centroid_x, obj["centroid_y"] - last.centroid_y)
                if d <= max_distance_pixels:
                    candidates.append((d, idx))

            if candidates:
                _, idx = min(candidates)
                obj = objects[idx]
                track.append(
                    TrackPoint(
                        time_index=t,
                        centroid_x=obj["centroid_x"],
                        centroid_y=obj["centroid_y"],
                        peak=obj["peak"],
                        object_id=obj.get("label"),
                    )
                )
                unmatched.remove(idx)

        for idx in unmatched:
            obj = objects[idx]
            tracks.append(
                [
                    TrackPoint(
                        time_index=t,
                        centroid_x=obj["centroid_x"],
                        centroid_y=obj["centroid_y"],
                        peak=obj["peak"],
                        object_id=obj.get("label"),
                    )
                ]
            )

    return tracks
