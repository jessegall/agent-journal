from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.models.merge_request import MergeRequest


@dataclass(frozen=True)
class RecordMergeRequest(Command[MergeRequest]):
    """Saves a worker's merge before git merges anything: a plugin's guard on it may refuse the merge."""

    worktree_id: int
    target_commit: str
    branch_commit: str
    folder: str
