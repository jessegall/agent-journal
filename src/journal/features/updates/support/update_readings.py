from dataclasses import dataclass


@dataclass(frozen=True)
class UpdateReadings:
    """What the viewer shows of the updates: the version installed, the newer releases out, an update under way and the step it is on, or the last one's problem."""

    installed: str
    latest: str
    newer: bool
    branch: str
    versions: list[str]
    updating: str
    step: str
    problem: str
