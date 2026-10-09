import os


def scaled(seconds: float) -> float:
    """The time a quiet machine needs, stretched by how many times the machine's load exceeds its cores."""
    return seconds * max(1.0, os.getloadavg()[0] / (os.cpu_count() or 1))
