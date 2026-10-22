from dataclasses import dataclass
from pathlib import Path

from journal.features.workers.support.worker_worktree import WorkerWorktree
from journal.models.subagent import Subagent
from journal.models.worker import Worker
from journal.models.worker_todo import WorkerTodo


@dataclass(frozen=True)
class WorkersData:
    """The workers feature's reading: the workers out and the idle workers whose report is not acted on, how many subagents of this session's rows are running, every subagent this session dispatched, the workers' worktrees, and, for a worker's own agent, its worker and the to-do items of the task it holds."""

    dispatched_workers: tuple[Worker, ...]
    idle_workers: tuple[Worker, ...]
    active_subagents: int
    subagents: tuple[Subagent, ...]
    worktrees_root: Path
    worktrees: tuple[WorkerWorktree, ...]
    session_workers: tuple[Worker, ...] = ()
    todos: tuple[WorkerTodo, ...] = ()
