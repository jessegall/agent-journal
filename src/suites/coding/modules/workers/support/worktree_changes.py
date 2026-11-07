from dataclasses import dataclass

from suites.coding.modules.workers.support.worktree_file_change import WorktreeFileChange


@dataclass(frozen=True)
class WorktreeChanges:
    """The base commit and changed files used to judge a worker's changes, by name and with what happened to each."""

    base: str
    files: tuple[str, ...]
    changes: tuple[WorktreeFileChange, ...]
