from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class CloseClaimedWorktreeTasks(Command[bool]):
    """Closes a delivered worktree whose branch has no commit ahead of its base, as when its work was taken in by
    hand: its tasks close as merged, its folder goes and its worker goes on. Says whether it was closed. It holds no
    write turn of its own, so its git runs while no other write waits; each record it makes is a write of its own."""

    worktree_id: int
