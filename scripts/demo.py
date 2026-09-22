from __future__ import annotations

import json
import numpy as np

from megha_drishti.pipeline import run_member_tracking


def synthetic_ensemble(members: int = 8, times: int = 6, ny: int = 64, nx: int = 96) -> np.ndarray:
    rng = np.random.default_rng(26078)
    yy, xx = np.mgrid[0:ny, 0:nx]
    data = rng.normal(0.0, 0.25, size=(members, times, ny, nx))

    for m in range(members):
        member_shift = rng.normal(0, 2, size=2)
        for t in range(times):
            cx = 20 + 8 * t + member_shift[0]
            cy = 42 - 4 * t + member_shift[1]
            sigma = 5.0 + 0.4 * t
            blob = 4.0 * np.exp(-((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * sigma**2))
            data[m, t] += blob
    return data


def main() -> None:
    scores = synthetic_ensemble()
    result = run_member_tracking(scores, threshold=2.0)

    summary = {
        "members": scores.shape[0],
        "lead_steps": scores.shape[1],
        "tracks_per_member": [len(t) for t in result["tracks"]],
        "max_probability": float(result["probability_by_time"].max()),
        "note": "Synthetic demo values; not operational weather data.",
    }
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
