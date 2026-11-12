from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class AnnounceBehindChecks(Command[None]):
    """Tells the merger of the worktrees one look found behind their base, starting it once for all of them."""

    worktree_ids: tuple[int, ...]
