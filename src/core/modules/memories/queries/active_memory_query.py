from collections.abc import Sequence
from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from engine.query.conditions.among import Among
from engine.query.conditions.equal import Equal
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.query import Query
from engine.query.select import Select
from core.modules.memories.models.context_memory import ContextMemory
from core.modules.memories.models.active_memory import ActiveMemory


class ActiveMemoryQuery(Query[ActiveMemory]):
    """Reads the memories that stand, with the filters the memory rules, guards and handlers use by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, ActiveMemory)

    def among(self, memory_ids: Sequence[int]) -> Self:
        return self.matching(Among("memory_id", memory_ids))

    def weight_order(self) -> Self:
        return self.descending("weight").ordered("memory_id")

    def absent_memories(self, agent_id: int) -> Self:
        context_memory_ids = Select(ContextMemory.view).matching(Equal("session_agent_id", agent_id)).column("memory_id")
        return self.matching(SubqueryMatch("memory_id", context_memory_ids, negated=True))
