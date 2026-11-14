from dataclasses import dataclass, replace

from suites.coding.modules.workers.support.worktree_file_change import WorktreeFileChange


@dataclass(frozen=True)
class WorktreeChanges:
    """The base commit and changed files used to judge a worker's changes, by name and with what happened to each."""

    base: str
    files: tuple[str, ...]
    changes: tuple[WorktreeFileChange, ...]

    def filtered(self, files: tuple[str, ...]) -> "WorktreeChanges":
        return replace(self, files=files, changes=tuple(change for change in self.changes if change.relative in files))
