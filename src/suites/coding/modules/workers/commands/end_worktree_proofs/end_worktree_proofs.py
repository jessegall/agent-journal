from dataclasses import dataclass

from engine.command.command import Command

ENDED_WITH_WORKTREE_NOTE = "ended: worktree {worktree} was abandoned or removed while this test waited or ran"


@dataclass(frozen=True)
class EndWorktreeProofs(Command[None]):
    """Ends the queued and running proof tests of a worktree that was abandoned or removed."""

    worktree_id: int
