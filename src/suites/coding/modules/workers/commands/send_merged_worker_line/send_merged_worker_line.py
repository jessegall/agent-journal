from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class SendMergedWorkerLine(Command[None]):
    """Tells the main agent that a worker's work was merged, or the unit it asked to merge, and wakes it if it
    sits idle."""

    worker_id: int
    worktree_id: int
