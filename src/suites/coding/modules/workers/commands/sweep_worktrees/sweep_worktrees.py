from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class SweepWorktrees(Command[tuple[str, ...]]):
    """Removes the worktrees under an environment's worktree folder that no worker holds, keeping the tip of each."""

    environment_id: int
