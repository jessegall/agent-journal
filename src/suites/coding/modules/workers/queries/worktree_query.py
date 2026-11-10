from collections.abc import Sequence

from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.base.query.conditions.among import Among
from core.base.query.conditions.less import Less
from core.base.query.conditions.minimum import Minimum
from core.base.timestamp import Timestamp
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.replaced_rows import replaced_rows


class WorktreeQuery(Query[Worktree]):
    """Reads worktrees, with the one a worker has out and those an environment has out by name."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Worktree)
        self.kept = kept

    def worker_worktree(self, agent_id: int) -> Worktree | None:
        return self.kept.read(self.table.name, self.filter(session_agent_id=agent_id).first,
                              "session_agent_id = ? AND removed_at IS NULL", [agent_id], name="workers.worker_worktree")

    def required_worker_worktree(self, agent_id: int) -> Worktree:
        worktree = self.worker_worktree(agent_id)
        if worktree is None:
            raise Refusal(f"worker {agent_id} has no worktree", "journal worker-worktree list shows the worktrees")
        return worktree

    def required_newest_worktree(self, agent_id: int) -> Worktree:
        worktree = self.newest_worktree(agent_id)
        if worktree is None:
            raise Refusal(f"worker {agent_id} has had no worktree", "journal worker-worktree list shows the worktrees")
        return worktree

    def is_first_worktree(self, worktree: Worktree) -> bool:
        return not self.with_removed().filter(session_agent_id=worktree.session_agent_id).matching(Less("id", worktree.id)).exists()

    def newest_worktree(self, agent_id: int) -> Worktree | None:
        return self.kept.read_newest(self.table.name, self.with_removed().filter(session_agent_id=agent_id).newest().first, "session_agent_id = ?", [agent_id], name="workers.newest_worktree")

    def merged_since(self, agent_id: int, since: Timestamp) -> bool:
        return self.with_removed().filter(session_agent_id=agent_id).matching(Minimum("merged_at", since.text)).exists()

    def open_worktrees(self) -> list[Worktree]:
        return list(self.kept.scoped_read(self.table.name, lambda: tuple(self.oldest().all_rows()), "removed_at IS NULL", name="workers.open_worktrees"))

    def in_folders(self, folders: Sequence[str]) -> tuple[Worktree, ...]:
        return tuple(self.with_removed().matching(Among("folder", folders)).oldest().all_rows())

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

        def with_active(worktrees: tuple[Worktree, ...]) -> tuple[Worktree, ...]:
            return replaced_rows(worktrees, worktree.id, active)

        def with_present(worktrees: tuple[Worktree, ...]) -> tuple[Worktree, ...]:
            return replaced_rows(worktrees, worktree.id, present)

        self.kept.scoped_update(self.table.name, with_active, "removed_at IS NULL", name="workers.open_worktrees")
        self.kept.scoped_update(self.table.name, with_present, name="workers.all_worktrees")
