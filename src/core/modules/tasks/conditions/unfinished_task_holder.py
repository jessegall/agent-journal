from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.among import Among
from engine.query.conditions.equal import Equal
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.conditions.takeable_tasks import TASK_MODEL

UNFINISHED_WORK_STATES = (TaskState.OPEN, TaskState.STARTED, TaskState.TESTING)


@dataclass(frozen=True)
class UnfinishedTaskHolder:
    """Matches agents that an open, started or testing task is assigned to."""

    def statement(self) -> Statement:
        unfinished = Select("tasks").matching(IsNull("closed_at")).matching(Among("state", [state.value for state in UNFINISHED_WORK_STATES])).column("id")
        holders = Select("assignments").matching(Equal("subject_model", TASK_MODEL)).matching(SubqueryMatch("subject_id", unfinished)).column("actor_id")
        return SubqueryMatch("id", holders).statement()
