from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from suites.coding.modules.workers.models.worktree import Worktree


class WorktreeQuery(Query[Worktree]):
    """Reads worktrees, with the one a worker has out and those an environment has out by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Worktree)

    def worker_worktree(self, agent_id: int) -> Worktree | None:
        rows = self.filter(agent_id=agent_id).matching(IsNull("removed_at")).page(1, 1).rows
        return rows[0] if rows else None

    def environment_worktrees(self, environment_id: int) -> list[Worktree]:
        return list(self.filter(environment_id=environment_id).matching(IsNull("removed_at")).oldest().all_rows())
