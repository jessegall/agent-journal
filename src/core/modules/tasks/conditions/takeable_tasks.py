from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.equal import Equal
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select
from engine.agent.agent_name import MAIN_ROLE

OPEN_STATE = "open"
TASK_MODEL = "task"


@dataclass(frozen=True)
class TakeableTasks:
    """Matches the open tasks one agent may take: for the main agent the tasks assigned to nobody or to the main
    agent, for any other agent only the tasks assigned to it."""

    agent_id: int
    is_main: bool

    def statement(self) -> Statement:
        assigned = Select("assignments").matching(Equal("subject_model", TASK_MODEL))
        if self.is_main:
            main_agents = Select("agents").matching(Equal("role", MAIN_ROLE)).column("id")
            to_main = assigned.matching(SubqueryMatch("actor_id", main_agents)).column("subject_id")
            unassigned = SubqueryMatch("id", assigned.column("subject_id"), negated=True)
            return AllOf([Equal("state", OPEN_STATE), AnyOf([unassigned, SubqueryMatch("id", to_main)])]).statement()
        return AllOf([Equal("state", OPEN_STATE), SubqueryMatch("id", assigned.matching(Equal("actor_id", self.agent_id)).column("subject_id"))]).statement()
