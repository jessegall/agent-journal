from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.among import Among
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select
from core.modules.tasks.models.enums.task_state import TaskState

UNFINISHED_WORK_STATES = (TaskState.OPEN, TaskState.STARTED, TaskState.TESTING)


@dataclass(frozen=True)
class UnfinishedTaskHolder:
    """Matches agents that an open, started or testing task is delegated to."""

    def statement(self) -> Statement:
        holders = Select("tasks").matching(IsNull("closed_at")).matching(HasValue("delegated_to")).matching(Among("state", [state.value for state in UNFINISHED_WORK_STATES]))
        return SubqueryMatch("id", holders.column("delegated_to")).statement()
