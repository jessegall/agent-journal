from dataclasses import dataclass


@dataclass(frozen=True)
class RateWindow:
    """One window of the user's plan allowance as the program reported it: how much of it is used, in percent, and when it starts again."""

    key: str
    label: str
    used: float
    resets_at: float
