from dataclasses import dataclass

from engine.command.command import Command

SOURCE_KEY_PREFIX = "unstarted-proofs:"


@dataclass(frozen=True)
class ReportUnstartedProofs(Command[None]):
    """Tells the main agent which queued proofs have not started although their worktree has no test running."""
