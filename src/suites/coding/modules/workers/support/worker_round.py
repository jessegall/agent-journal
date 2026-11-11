from dataclasses import dataclass

from engine.errors.refusal import Refusal
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.staging import Staging
from suites.coding.modules.workers.support.worker_test_group import WorkerTestGroup


@dataclass(frozen=True)
class WorkerRound:
    """What the journal holds about a worker's round, read once and handed to whatever decides from it."""

    worker_id: int
    worktree: Worktree | None
    started: tuple[Task, ...]
    ready: tuple[Task, ...]
    following: Task | None
    is_asking: bool
    conflict: AgentLine | None
    group: WorkerTestGroup | None
    staging: Staging | None

    def required_worktree(self) -> Worktree:
        if self.worktree is None:
            raise Refusal("this worker has no worktree", "journal worker-worktree list shows the worktrees")
        return self.worktree

    def required_staging(self) -> Staging:
        if self.staging is None:
            raise Refusal("this worker has no worktree", "journal worker-worktree list shows the worktrees")
        return self.staging

    def has_no_work(self) -> bool:
        return self.worktree is None and not self.started
