from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.disjunction import Disjunction
from engine.query.conditions.equal import Equal
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select
from engine.agent.agent_name import MAIN_ROLE



@dataclass(frozen=True)
class MainMessageTarget:
    """Matches the messages addressed to a main agent or to nobody."""

    def statement(self) -> Statement:
        main_agents = Select("agents").matching(Equal("role", MAIN_ROLE)).column("id")
        return Disjunction([IsNull("target_agent_id"), SubqueryMatch("target_agent_id", main_agents)]).statement()
