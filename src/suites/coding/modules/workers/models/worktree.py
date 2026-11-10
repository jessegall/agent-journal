from dataclasses import dataclass

from engine.actor.actor import Actor
from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.removable import Removable
from core.base.model.model import Model
from engine.time.timestamp import Timestamp
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
    delivered_at: Timestamp | None = None
    logs_read_at: Timestamp | None = None
    logs_output_id: int | None = None
    tests_passed_at: Timestamp | None = None
    returned_at: Timestamp | None = None
    pass_reason: str = ""
    merged_at: Timestamp | None = None
    removed_at: Timestamp | None = None
    commit_before_merge: str = ""
    commit_after_merge: str = ""
    merged_task_ids: str = ""
    new_agent_reason: str = ""
    library_links: str = "[]"
    library_copies: str = "[]"
    libraries_dropped_at: Timestamp | None = None
    task_count: int = 1
    route_reason: str = ""
    starts_program: bool = True

    def cut(self, timestamp: Timestamp, actor: Actor, base_commit: str, task_count: int = 1) -> "Worktree":
        return self.moved(WorktreeLifecycle.cut, base_commit=base_commit, cut_at=timestamp, task_count=task_count)

    def change_libraries(self, dropped_at: Timestamp | None) -> "Worktree":
        move = WorktreeLifecycle.change_delivered_libraries if self.state is WorktreeState.DELIVERED else WorktreeLifecycle.change_cut_libraries
        return self.moved(move, libraries_dropped_at=dropped_at)

    def merge(self, timestamp: Timestamp, actor: Actor) -> "Worktree":
        return self.moved(WorktreeLifecycle.merge, merged_at=timestamp)

    def remove(self, timestamp: Timestamp, actor: Actor) -> "Worktree":
        return self.moved(WorktreeLifecycle.remove, removed_at=timestamp)

    def has_cut_task(self, task_id: int) -> bool:
        return self.task_id == task_id and self.state is WorktreeState.CUT
