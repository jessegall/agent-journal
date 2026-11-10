from dataclasses import dataclass


@dataclass(frozen=True)
class HelperOutcome:
    """What a helper's run printed: its report, the session it ran, and its error when it ended in one."""

    report: str
    session: str
    error: str | None = None
