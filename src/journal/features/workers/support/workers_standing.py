from dataclasses import dataclass
from pathlib import Path

from journal.features.workers.support.dispatch import Dispatch
from journal.features.workers.support.worker_worktree import WorkerWorktree


@dataclass(frozen=True)
class WorkersStanding:
    """The workers feature's reading: the workers out, those whose report is not acted on and how they are named, the subagents running besides the newest dispatch, every subagent this session dispatched, and the workers' worktrees."""

    out: tuple[int, ...]
    reports_waiting: tuple[int, ...]
    reports_waiting_named: str
    subagents_running: int
    dispatches: tuple[Dispatch, ...]
    worktrees_root: Path
    worktrees: tuple[WorkerWorktree, ...]
