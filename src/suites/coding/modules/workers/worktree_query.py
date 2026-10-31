from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from suites.coding.modules.workers.models.worktree import Worktree


class WorktreeQuery(Query[Worktree]):
    """Reads worktrees, with the worktrees of one worker by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Worktree)

    def worker_worktrees(self, agent_id: int) -> Self:
        return self.filter(agent_id=agent_id)
