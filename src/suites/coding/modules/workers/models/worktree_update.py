from dataclasses import dataclass


@dataclass(frozen=True)
class WorktreeUpdate:
    """What bringing a worktree up to its base branch came to: the base commit it now stands on, the files whose
    merge markers the worker settles, and the stash its uncommitted changes wait in when a conflicting merge left
    no clean tree to put them back on; empty when nothing is kept."""

    base_commit: str
    conflicts: tuple[str, ...] = ()
    stash_id: str = ""
    was_current: bool = False

    @classmethod
    def current(cls, tip: str) -> "WorktreeUpdate":
        return cls(tip, was_current=True)

    def is_clean(self) -> bool:
        return not self.conflicts
