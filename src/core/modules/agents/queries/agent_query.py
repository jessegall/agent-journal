from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from core.modules.agents.models.agent import Agent


class AgentQuery(Query[Agent]):
    """Reads agents. A running agent is one that has not ended: this is the one place that says so."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Agent)

    def running(self) -> Self:
        return self.matching(IsNull("ended_at"))
