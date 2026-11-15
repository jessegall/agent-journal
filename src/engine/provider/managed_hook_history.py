from dataclasses import dataclass

from engine.driver.project_hook_run import ProjectHookRun
from engine.driver.enums.project_hook_outcome import ProjectHookOutcome


@dataclass(frozen=True)
class ManagedHookHistory:
    """The outcomes of a project hook's recent runs and its newest result."""

    runs: int
    refused: int
    rewritten: int
    timed_out: int
    failed: int
    last: ProjectHookRun | None
    last_at: str | None = None
    last_outcome: ProjectHookOutcome | None = None
