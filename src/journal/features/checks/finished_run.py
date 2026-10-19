from dataclasses import dataclass


@dataclass(frozen=True)
class FinishedRun:
    """How a check's command ended: whether it passed, and all it printed."""

    passed: bool
    output: str
