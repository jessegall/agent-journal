"""Which turn of the feature switches and the environment names this process is on: a thing cached under it is out of date when it moves."""

GENERATION = [0]


def generation() -> int:
    return GENERATION[0]


def turned() -> None:
    GENERATION[0] += 1
