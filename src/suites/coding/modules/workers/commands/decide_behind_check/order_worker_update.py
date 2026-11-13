from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class OrderWorkerUpdate(Command[None]):
    """The merger or the main agent orders a worker behind its base to update its worktree, saying what overlaps."""

    worker_id: int
    reason: str
