from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class CancelWorkerOpening(Command[None]):
    """Deletes the agent row and the new worktree row of a dispatch whose cut failed."""

    worktree_id: int
