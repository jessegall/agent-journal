from dataclasses import dataclass


@dataclass(frozen=True)
class RepeatedLines:
    """A window that sent many lines of one command in a short time, each for another id."""

    window: str
    line: str
    count: int
