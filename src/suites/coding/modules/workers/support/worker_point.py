from dataclasses import dataclass

from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.support.worker_round import WorkerRound


@dataclass(frozen=True)
class WorkerPoint:
    """A worker's point of its round with the line it hears there and the counts shown beside it."""

    round: WorkerRound
    step: WorkerStep
    line: str
    group: str | None
    open_task_count: int
    test_runs_available: int | None
