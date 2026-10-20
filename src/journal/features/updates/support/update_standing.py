from dataclasses import dataclass


@dataclass(frozen=True)
class UpdateStanding:
    """What the viewer shows of the updates: the version installed, the newer releases out, and an install under way or its problem."""

    installed: str
    latest: str
    newer: bool
    versions: list[str]
    updating: str
    problem: str
