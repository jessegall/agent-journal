from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.equal import Equal
from engine.query.conditions.exists import Exists
from engine.query.conditions.is_null import IsNull
from engine.query.select import Select

MAIN_ROLE = "main"


@dataclass(frozen=True)
class MessageTarget:
    """Matches the messages addressed to one agent, and the unaddressed ones when that agent is a main agent."""

    agent_id: int

    def statement(self) -> Statement:
        is_main = Exists(Select("agents").matching(Equal("id", self.agent_id)).matching(Equal("role", MAIN_ROLE)))
        return AnyOf([Equal("target_agent_id", self.agent_id), AllOf([IsNull("target_agent_id"), is_main])]).statement()
