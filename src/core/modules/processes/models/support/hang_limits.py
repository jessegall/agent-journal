from dataclasses import dataclass


@dataclass(frozen=True)
class HangLimits:
    """The seconds a run may print nothing: before it is stopped when it is idle, and before its agent is asked
    to look when it is a busy test run."""

    hang: int
    look: int
