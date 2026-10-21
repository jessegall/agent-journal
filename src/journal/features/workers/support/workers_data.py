from dataclasses import dataclass
from pathlib import Path

from journal.features.workers.support.dispatch import Dispatch
from journal.features.workers.support.worker_worktree import WorkerWorktree
from journal.models.worker import Worker


@dataclass(frozen=True)
class WorkersData:
    """The workers feature's reading: the workers out, the idle workers whose report is not acted on, the subagents running besides the newest dispatch, every subagent this session dispatched, and the workers' worktrees."""

    active_workers: tuple[int, ...]
    idle_workers: tuple[Worker, ...]
    active_subagents: int
    dispatches: tuple[Dispatch, ...]
    worktrees_root: Path
    worktrees: tuple[WorkerWorktree, ...]
