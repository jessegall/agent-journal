from dataclasses import dataclass


@dataclass(frozen=True)
class CheckResult:
    """Whether a check's command passed, and what it printed."""

    passed: bool
    output: str
