from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.equal import Equal
from engine.query.conditions.exists import Exists
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select
from engine.agent.agent_name import MAIN_ROLE



@dataclass(frozen=True)
class SameChat:
    """Matches dock items visible in an agent's chat: its own, and for a main agent or nobody the items of no agent
    or of a main agent."""

    agent_id: int | None

    def statement(self) -> Statement:
        helper_reader = Exists(Select("agents").matching(Equal("id", self.agent_id)).matching(Equal("role", MAIN_ROLE, negated=True)), negated=True)
        main_agents = Select("agents").matching(Equal("role", MAIN_ROLE)).column("id")
        shared = AllOf([helper_reader, AnyOf([IsNull("session_agent_id"), SubqueryMatch("session_agent_id", main_agents)])])
        return AnyOf([Equal("session_agent_id", self.agent_id), shared]).statement()
