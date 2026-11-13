from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.conjunction import Conjunction
from engine.query.conditions.disjunction import Disjunction
from engine.query.conditions.equal import Equal
from engine.query.conditions.exists import Exists
from engine.query.conditions.is_null import IsNull
from engine.query.select import Select
from engine.agent.agent_name import MAIN_ROLE


@dataclass(frozen=True)
class MessageTarget:
    """Matches the messages addressed to one agent, and the unaddressed ones when that agent is a main agent."""

    agent_id: int

    def statement(self) -> Statement:
        is_main = Exists(Select("agents").matching(Equal("id", self.agent_id)).matching(Equal("role", MAIN_ROLE)))
        return Disjunction([Equal("target_agent_id", self.agent_id), Conjunction([IsNull("target_agent_id"), is_main])]).statement()
