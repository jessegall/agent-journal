from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RemoveOrphanWorktrees(Command[tuple[str, ...]]):
    """Removes the worktrees under an environment's worktree folder that no worker holds, keeping the tip of each."""

    lock = False

