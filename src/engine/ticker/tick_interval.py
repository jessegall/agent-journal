from dataclasses import dataclass


@dataclass(frozen=True)
class TickInterval:
    """The time between the starts of two runs of a tick handler, in seconds."""

    seconds: float
