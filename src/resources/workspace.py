from dataclasses import dataclass


@dataclass(frozen=True)
class WorkspaceFolders:
    homes: tuple[str, ...] = ()
    shared: tuple[str, ...] = ()
    shared_if_ignored: tuple[str, ...] = ()
    shared_in: tuple[str, ...] = ()
    worktrees: tuple[tuple[str, ...], ...] = ()

    @property
    def managed(self) -> tuple[str, ...]:
        return tuple(f"/{folder}/" for folder in self.shared_in)

    @property
    def worktree_home(self) -> tuple[str, ...]:
        return self.worktrees[0]
