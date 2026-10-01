from pantry.scale import scale


def test_doubles():
    assert scale(2, 4, 2) == 4


def test_halves():
    assert scale(2, 1, 2) == 1


def test_same():
    assert scale(3, 2, 2) == 3
