from typing import Self

from engine.database.database import Database
from engine.model.tables import Tables
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.less import Less
from engine.time.timestamp import Timestamp
from engine.query.query import Query
from core.modules.agents.models.agent import Agent


class AgentQuery(Query[Agent]):
    """Reads agents. A running agent is one that has not ended: this is the one place that says so."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Agent)

    def running(self) -> Self:
        return self.matching(IsNull("ended_at"))

    def created_earlier(self, cutoff: Timestamp) -> Self:
        return self.matching(Less("created_at", cutoff.text))
