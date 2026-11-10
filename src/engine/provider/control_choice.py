from dataclasses import dataclass


@dataclass(frozen=True)
class ControlChoice:
    """One choice in the agent bar, and the line its program takes for it."""

    value: str
    label: str
    line: str
