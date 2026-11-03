from dataclasses import dataclass

from core.base.driver.foreign_run import ForeignRun


@dataclass(frozen=True)
class ManagedHookHistory:
    """The outcomes of a project hook's recent runs and its newest result."""

    runs: int
    refused: int
    rewritten: int
    timed_out: int
    failed: int
    last: ForeignRun | None
