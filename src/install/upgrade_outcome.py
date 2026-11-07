from dataclasses import dataclass


@dataclass(frozen=True)
class UpgradeOutcome:
    """How an upgrade ended: the exit code, 0 when it ran or had nothing to do, and the lines it printed."""

    code: int
    text: str
