from core.base.file_status import FileStatus
from suites.coding.modules.workers.support.worktree_file_change import WorktreeFileChange


class TreeChanges:
    """What differs between a base tree and a tracked tree the way git diff names it: a file only in the
    base is deleted, a file only in the tracked tree is added, and a deleted and an added file with the same
    text are one rename."""

    def __init__(self, base: dict[str, str], tracked: dict[str, str]) -> None:
        self.base, self.tracked = base, tracked

    def tracked_changes(self) -> tuple[WorktreeFileChange, ...]:
        deleted = {name for name in self.base if name not in self.tracked}
        added = {name for name in self.tracked if name not in self.base}
        renames = {new: old for new in sorted(added) for old in sorted(deleted) if self.tracked[new] == self.base[old]}
        renamed_olds = set(renames.values())
        changes = [WorktreeFileChange(new, FileStatus.RENAMED, old) for new, old in renames.items()]
        changes += [WorktreeFileChange(name, FileStatus.DELETED) for name in deleted if name not in renamed_olds]
        changes += [WorktreeFileChange(name, FileStatus.ADDED) for name in added if name not in renames]
        changes += [WorktreeFileChange(name, FileStatus.CHANGED) for name in self.base if name in self.tracked and self.base[name] != self.tracked[name]]
        return tuple(sorted(changes, key=lambda change: change.relative))

    def names(self) -> tuple[str, ...]:
        return tuple(sorted({name for name in {*self.base, *self.tracked} if self.base.get(name) != self.tracked.get(name)}))
