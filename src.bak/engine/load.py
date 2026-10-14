import os

QUIET = 0.25


def factor() -> float:
    """How many times longer the machine is taking than a quiet one, from its load against its cores."""
    return max(1.0, os.getloadavg()[0] / (os.cpu_count() or 1))


def scaled(seconds: float) -> float:
    """The time a quiet machine needs, stretched by how busy the machine is now."""
    return seconds * factor()


def quiet() -> bool:
    """Whether the machine is calm enough for a time it measures to mean anything: its load at most a quarter of its cores. Half was too lax to judge by - the boot guard measured the same code at 5.1 seconds and at 94.7 on one evening, and refused a push on 15.9 against a 15-second limit at load 4.26 of 10, which it called quiet."""
    return os.getloadavg()[0] / (os.cpu_count() or 1) <= QUIET
