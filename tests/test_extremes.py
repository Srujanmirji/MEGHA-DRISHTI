import numpy as np

from megha_drishti.extremes import exceedance_probability, extract_objects
from megha_drishti.downscale import interpolation_baseline


def test_exceedance_probability():
    members = np.array([
        [[0, 2], [3, 0]],
        [[1, 4], [5, 0]],
    ])
    p = exceedance_probability(members, threshold=1)
    assert np.allclose(p, [[0.0, 1.0], [1.0, 0.0]])


def test_extract_object():
    score = np.zeros((10, 10))
    score[2:5, 3:6] = 3.0
    objects = extract_objects(score, threshold=2.0, min_pixels=4)
    assert len(objects) == 1
    assert objects[0]["pixel_count"] == 9
    assert objects[0]["peak"] == 3.0


def test_interpolation_shape():
    field = np.arange(16, dtype=float).reshape(4, 4)
    out = interpolation_baseline(field, 2, 3)
    assert out.shape == (8, 12)
