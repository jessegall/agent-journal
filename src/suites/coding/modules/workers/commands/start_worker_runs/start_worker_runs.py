from dataclasses import dataclass

from engine.command.command import Command
from core.modules.plans.models.checkpoint_reach import CheckpointReach


@dataclass(frozen=True)
class StartWorkerRuns(Command[tuple[CheckpointReach, ...]]):
    """Starts a worker run for each checkpoint window a worker's commit completes. A worker's own commit reruns a
    checkpoint whose run failed on that same commit; the end of a failed run never starts another."""

    worktree_id: int
    commit_id: str
    reruns_failed: bool = False
