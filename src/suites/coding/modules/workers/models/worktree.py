from dataclasses import dataclass

from core.base.actor import Actor
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from suites.coding.modules.workers.models.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree_state import WorktreeState


@dataclass(frozen=True, kw_only=True)
class Worktree(Model):
    """The git worktree a worker writes in for its task: its folder and branch, cut from the environment's branch."""

    model_name = "worktree"
    cli_name = "worktree"
    lifecycle = WorktreeLifecycle

    agent_id: int
    environment_id: int
    task_id: int
    creator_id: int
    folder: str
    branch: str
    base_branch: str
    base_commit: str = ""
    state: WorktreeState = WorktreeState.NEW
    cut_at: Timestamp | None = None
    merged_at: Timestamp | None = None
    removed_at: Timestamp | None = None

    def cut(self, timestamp: Timestamp, actor: Actor, base_commit: str) -> "Worktree":
        return self.moved(WorktreeLifecycle.cut, base_commit=base_commit, cut_at=timestamp)

    def merge(self, timestamp: Timestamp, actor: Actor) -> "Worktree":
        return self.moved(WorktreeLifecycle.merge, merged_at=timestamp)

    def remove(self, timestamp: Timestamp, actor: Actor) -> "Worktree":
        return self.moved(WorktreeLifecycle.remove, removed_at=timestamp)
