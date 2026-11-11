from dataclasses import dataclass

from engine.command.command import Command
from core.modules.plans.models.checkpoint_reach import CheckpointReach


@dataclass(frozen=True)
class StartWorkerRuns(Command[tuple[CheckpointReach, ...]]):
    """Starts a worker run for each checkpoint window a worker's commit completes."""

    worktree_id: int
    commit_id: str
