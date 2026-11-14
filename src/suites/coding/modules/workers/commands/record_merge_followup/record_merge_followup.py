from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.models.merge_followup import MergeFollowup


@dataclass(frozen=True)
class RecordMergeFollowup(Command[MergeFollowup]):
    """Saves the commands a merge must still run, as they stand now, right after git merged."""

    worktree_id: int
    folder: str
    previous_commit: str
    commit_after: str
    revision: str
    commands: tuple[str, ...]
