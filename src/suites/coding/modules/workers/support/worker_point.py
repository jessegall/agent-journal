from dataclasses import dataclass

from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.support.worker_round import WorkerRound


@dataclass(frozen=True)
class WorkerPoint:
    """A worker's point of its round with the line it hears there, the counts shown beside it and the key of
    its commit window, by which the merger counts what it sends and is asked."""

    round: WorkerRound
    step: WorkerStep
    line: str
    window_key: str | None
    open_task_count: int
    test_runs_available: int | None

    def counted_window_key(self) -> str:
        worktree_id = None if self.round.worktree is None else self.round.worktree.id
        return f"worktree:{worktree_id}:{self.window_key}"
