from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.model.tables import Tables
from core.base.query.query import Query
from suites.coding.modules.workers.models.worktree import Worktree


class WorktreeQuery(Query[Worktree]):
    """Reads worktrees, with the one a worker has out and those an environment has out by name."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Worktree)
        self.kept = kept

    def worker_worktree(self, agent_id: int) -> Worktree | None:
        return self.kept.read(self.table.name, self.filter(session_agent_id=agent_id).first,
                              "session_agent_id = ? AND removed_at IS NULL", [agent_id], name="workers.worker_worktree")

    def newest_worktree(self, agent_id: int) -> Worktree | None:
        return self.kept.read_newest(self.table.name, self.with_removed().filter(session_agent_id=agent_id).newest().first, "session_agent_id = ?", [agent_id], name="workers.newest_worktree")

    def open_worktrees(self) -> list[Worktree]:
        return list(self.kept.scoped_read(self.table.name, lambda: tuple(self.oldest().all_rows()), "removed_at IS NULL", name="workers.open_worktrees"))

    def all_worktrees(self) -> tuple[Worktree, ...]:
        return self.kept.scoped_read(self.table.name, lambda: tuple(self.with_removed().oldest().all_rows()), name="workers.all_worktrees")

    def remember(self, worktree: Worktree) -> None:
        self.replace_cached(worktree, tuple([worktree]))

    def remove(self, worktree: Worktree) -> None:
        self.replace_cached(worktree, ())

    def replace_cached(self, worktree: Worktree, present: tuple[Worktree, ...]) -> None:
        active = [row for row in present if row.removed_at is None]
        self.kept.update(self.table.name, lambda previous: next(iter(active), None), "session_agent_id = ? AND removed_at IS NULL",
                         [worktree.session_agent_id], name="workers.worker_worktree")
        self.kept.scoped_update(self.table.name, lambda worktrees: tuple(sorted([row for row in worktrees if row.id != worktree.id] + list(active), key=lambda row: row.id)),
                                  "removed_at IS NULL", name="workers.open_worktrees")
        self.kept.scoped_update(self.table.name, lambda worktrees: tuple(sorted([row for row in worktrees if row.id != worktree.id] + list(present), key=lambda row: row.id)),
                                  name="workers.all_worktrees")
