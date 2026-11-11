from collections.abc import Sequence
from dataclasses import dataclass

from engine.actor.actor import Actor
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.removable import Removable
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState

RELEASED_STATES = (WorktreeState.REMOVED, WorktreeState.ABANDONED)


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
    merge_ready_at: Timestamp | None = None
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
    commit_count: int = 0
    commit_task_ids: str = ""
    commit_short_id: str = ""
    route_reason: str = ""
    starts_program: bool = True

    def cut(self, timestamp: Timestamp, actor: Actor, base_commit: str, task_count: int = 1) -> "Worktree":
        return self.moved(WorktreeLifecycle.cut, base_commit=base_commit, cut_at=timestamp, task_count=task_count)

    def change_libraries(self, dropped_at: Timestamp | None) -> "Worktree":
        move = WorktreeLifecycle.change_delivered_libraries if self.state is WorktreeState.DELIVERED else WorktreeLifecycle.change_cut_libraries
        return self.moved(move, libraries_dropped_at=dropped_at)

    def taken_over(self, worker_id: int) -> "Worktree":
        move = WorktreeLifecycle.take_over_delivered if self.state is WorktreeState.DELIVERED else WorktreeLifecycle.take_over_cut
        return self.moved(move, session_agent_id=worker_id)

    def is_newly_released(self, previous: "Worktree") -> bool:
        return self.state in RELEASED_STATES and previous.state is not self.state

    def merge(self, timestamp: Timestamp, actor: Actor) -> "Worktree":
        return self.moved(WorktreeLifecycle.merge, merged_at=timestamp)

    def remove(self, timestamp: Timestamp, actor: Actor) -> "Worktree":
        return self.moved(WorktreeLifecycle.remove, removed_at=timestamp)

    def committed(self, base_commit: str, task_ids: Sequence[int], short_id: str) -> "Worktree":
        return self.moved(WorktreeLifecycle.advance, base_commit=base_commit, commit_task_ids=",".join(str(task_id) for task_id in task_ids), commit_short_id=short_id)

    def commit_tasks(self) -> tuple[int, ...]:
        return tuple(int(task_id) for task_id in self.commit_task_ids.split(",") if task_id)

    def merged_tasks(self) -> tuple[int, ...]:
        return tuple(int(task_id) for task_id in self.merged_task_ids.split(",") if task_id)

    @property
    def is_merge_ready(self) -> bool:
        return self.state is WorktreeState.DELIVERED and self.merge_ready_at is not None and self.returned_at is None

    def has_cut_task(self, task_id: int) -> bool:
        return self.task_id == task_id and self.state is WorktreeState.CUT
