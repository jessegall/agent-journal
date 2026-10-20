from dataclasses import dataclass


@dataclass(frozen=True)
class WorkersStanding:
    """The workers feature's reading: the workers out and those whose report is not acted on."""

    out: tuple[int, ...]
    reports_waiting: tuple[int, ...]
