from dataclasses import dataclass

from engine.driver.foreign_run import ForeignRun
from engine.enums.foreign_outcome import ForeignOutcome


@dataclass(frozen=True)
class ManagedHookHistory:
    """The outcomes of a project hook's recent runs and its newest result."""

    runs: int
    refused: int
    rewritten: int
    timed_out: int
    failed: int
    last: ForeignRun | None
    last_at: str | None = None
    last_outcome: ForeignOutcome | None = None
