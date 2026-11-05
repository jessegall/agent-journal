from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from suites.coding.modules.workers.models.worktree import Worktree


class WorktreeQuery(Query[Worktree]):
    """Reads worktrees, with the one a worker has out and those an environment has out by name."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Worktree)
        self.kept = kept

    def worker_worktree(self, agent_id: int) -> Worktree | None:
        rows = self.filter(agent_id=agent_id).matching(IsNull("removed_at")).limited(1)
        return rows[0] if rows else None

    def environment_worktrees(self, environment_id: int) -> list[Worktree]:
        return list(self.kept.read(self.table.name, lambda: tuple(self.filter(environment_id=environment_id).matching(IsNull("removed_at")).oldest().all_rows()),
                                   "environment_id = ? AND removed_at IS NULL", [environment_id], name="workers.environment_worktrees"))
