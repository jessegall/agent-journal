from dataclasses import dataclass


@dataclass(frozen=True)
class CheckRunRecord:
    """One run of a check: when it ran, whether it passed and what it printed."""

    run_at: str
    passed: bool
    output: str
