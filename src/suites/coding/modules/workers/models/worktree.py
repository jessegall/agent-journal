from dataclasses import dataclass

from core.base.actor import Actor
from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.removable import Removable
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState


@dataclass(frozen=True, kw_only=True)
class Worktree(Removable, EnvironmentScoped, Model):
    """The git worktree a worker writes in for its task: its folder and branch, cut from the environment's
    branch."""

    model_name = "worker_worktree"
    shared_rows = True
    cli_name = "worker-worktree"
    lifecycle = WorktreeLifecycle

    session_agent_id: int
    environment_id: int = 0
    task_id: int
    creator_id: int
    folder: str
    branch: str
    base_branch: str
    base_commit: str = ""
    state: WorktreeState = WorktreeState.NEW
    cut_at: Timestamp | None = None
    logs_read_at: Timestamp | None = None
    tests_passed_at: Timestamp | None = None
    merged_at: Timestamp | None = None
    removed_at: Timestamp | None = None
    commit_before_merge: str = ""
    commit_after_merge: str = ""
    merged_task_ids: str = ""
    new_agent_reason: str = ""

    def cut(self, timestamp: Timestamp, actor: Actor, base_commit: str) -> "Worktree":
        return self.moved(WorktreeLifecycle.cut, base_commit=base_commit, cut_at=timestamp)

    def merge(self, timestamp: Timestamp, actor: Actor) -> "Worktree":
        return self.moved(WorktreeLifecycle.merge, merged_at=timestamp)

    def remove(self, timestamp: Timestamp, actor: Actor) -> "Worktree":
        return self.moved(WorktreeLifecycle.remove, removed_at=timestamp)

    def has_cut_task(self, task_id: int) -> bool:
        return self.task_id == task_id and self.state is WorktreeState.CUT
