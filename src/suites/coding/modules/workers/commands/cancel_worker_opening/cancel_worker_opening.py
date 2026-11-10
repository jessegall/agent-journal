from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class CancelWorkerOpening(Command[None]):
    """Undoes a dispatch that never got cut: its new worktree row goes, and its agent row goes or ends."""

    worktree_id: int
    retain_agent: bool = False
