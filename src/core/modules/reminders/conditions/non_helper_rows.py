from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.equal import Equal
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select
from engine.agent.agent_name import MAIN_ROLE



@dataclass(frozen=True)
class NonHelperRows:
    """Matches rows created by a main agent or a user."""

    def statement(self) -> Statement:
        other_agents = Select("agents").matching(Equal("role", MAIN_ROLE, negated=True)).column("id")
        return SubqueryMatch("creator_id", other_agents, negated=True).statement()
