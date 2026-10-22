from dataclasses import dataclass


@dataclass(frozen=True)
class WorkerWorktree:
    """A worker's worktree folder under the journal's worktrees, by its name and the worker that writes there."""

    folder: str
    worker_id: int
    worker_name: str
