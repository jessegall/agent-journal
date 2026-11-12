from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.equal import Equal
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select

OPEN_STATE = "open"
MAIN_ROLE = "main"


@dataclass(frozen=True)
class TakeableTasks:
    """Matches the open tasks one agent may take: for the main agent the tasks reserved for nobody or for the main
    agent, for any other agent only the tasks assigned to it."""

    agent_id: int
    is_main: bool

    def statement(self) -> Statement:
        if self.is_main:
            main_agents = Select("agents").matching(Equal("role", MAIN_ROLE)).column("id")
            return AllOf([Equal("state", OPEN_STATE), AnyOf([IsNull("delegated_to"), SubqueryMatch("delegated_to", main_agents)])]).statement()
        return AllOf([Equal("state", OPEN_STATE), Equal("delegated_to", self.agent_id)]).statement()
