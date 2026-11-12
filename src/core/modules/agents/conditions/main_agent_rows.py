from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.equal import Equal
from engine.query.select import Select
from engine.query.conditions.subquery_match import SubqueryMatch


@dataclass(frozen=True)
class MainAgentRows:
    """Matches rows owned by main agents."""

    def statement(self) -> Statement:
        return SubqueryMatch("session_agent_id", Select("agents").matching(Equal("role", "main")).column("id")).statement()
