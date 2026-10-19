from dataclasses import dataclass


@dataclass(frozen=True)
class FinishedRun:
    """How a check's command ended: whether it passed, and all it printed."""

    passed: bool
    output: str
    fault: str = ""
    """Why the command could not run at all; empty when it ran, passing or failing."""
