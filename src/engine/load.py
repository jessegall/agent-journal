import os

QUIET = 1.5


def factor() -> float:
    """How many times longer the machine is taking than a quiet one, from its load against its cores."""
    return max(1.0, os.getloadavg()[0] / (os.cpu_count() or 1))


def scaled(seconds: float) -> float:
    """The time a quiet machine needs, stretched by how busy the machine is now."""
    return seconds * factor()


def quiet() -> bool:
    """Whether the machine is calm enough for a time it measures to mean anything."""
    return factor() <= QUIET
