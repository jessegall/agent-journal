from collections.abc import Sequence
from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.among import Among
from core.base.query.conditions.equal import Equal
from core.base.query.conditions.is_null import IsNull
from core.base.query.conditions.subquery_match import SubqueryMatch
from core.base.query.query import Query
from core.base.query.select import Select
from core.base.timestamp import Timestamp
from core.modules.memories.conditions.agent_scope import AgentScope
from core.modules.memories.conditions.due_memory import DueMemory
from core.modules.memories.memory_in_context import MemoryInContext
from core.modules.memories.standing_memory import StandingMemory


class StandingMemoryQuery(Query[StandingMemory]):
    """Reads the memories that stand, with the filters the memory rules, guards and handlers use by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, StandingMemory)

    def scope(self, agent_id: int, environment_id: int) -> Self:
        return self.matching(AgentScope(agent_id, environment_id))

    def agent_memories(self, agent_id: int) -> Self:
        return self.filter(agent_id=agent_id)

    def environment_memories(self, environment_id: int) -> Self:
        return self.filter(environment_id=environment_id).matching(IsNull("agent_id"))

    def fading(self) -> Self:
        return self.filter(fades=True)

    def start_memories(self) -> Self:
        return self.filter(given_at_start=True)

    def mark_memories(self) -> Self:
        return self.filter(given_at_mark=True)

    def due(self, timestamp: Timestamp) -> Self:
        return self.matching(DueMemory(timestamp))

    def types(self, type_names: Sequence[str]) -> Self:
        return self.matching(Among("type", type_names))

    def undated(self) -> Self:
        return self.matching(IsNull("due_at"))

    def among(self, memory_ids: Sequence[int]) -> Self:
        return self.matching(Among("memory_id", memory_ids))

    def heaviest_first(self) -> Self:
        return self.descending("weight")

    def giving_order(self) -> Self:
        return self.ordered("giving_order").descending("weight")

    def absent_memories(self, agent_id: int) -> Self:
        context_memory_ids = Select(MemoryInContext.view).matching(Equal("agent_id", agent_id)).column("memory_id")
        return self.matching(SubqueryMatch("memory_id", context_memory_ids, negated=True))
