from dataclasses import dataclass


@dataclass(frozen=True)
class StateRecord:
    """One agent state a hook's board worked out: its name, its tier, whether it was open, closed or its opener
    failed, and how long the opener took."""

    name: str
    tier: str
    outcome: str
    milliseconds: int
