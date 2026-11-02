from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from core.base.query.condition import Condition
from core.base.query.conditions.subquery_match import SubqueryMatch
from core.base.query.select import Select
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.open_dependency import OpenDependency


class TaskQuery(Query[Task]):
    """Reads tasks, with the filters the tasks module and its guards use by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Task)

    def environment(self, environment_id: int) -> Self:
        return self.filter(environment_id=environment_id)

    def unclosed(self) -> Self:
        return self.matching(IsNull("closed_at"))

    def holder(self, agent_id: int) -> Self:
        return self.filter(holder_id=agent_id)

    def started(self) -> Self:
        return self.filter(state=TaskState.STARTED)

    def unopenable_blocks(self, environment_id: int) -> Self:
        return self.environment(environment_id).filter(state=TaskState.BLOCKED).matching(SubqueryMatch("id", Select("task_waits").matching(IsNull("ended_at")).column("task_id"), negated=True))

    def no_open_dependency(self) -> Condition:
        return SubqueryMatch("id", Select(OpenDependency.view).column("task_id"), negated=True)

    def next_delegated(self, agent_id: int) -> Task | None:
        delegated = self.filter(delegated_to=agent_id, state=TaskState.OPEN).matching(self.no_open_dependency()).all_rows()
        return min(delegated, key=lambda task: (-task.priority, task.id), default=None)

    def open_tasks(self, environment_id: int) -> Self:
        return self.environment(environment_id).filter(state=TaskState.OPEN)

    def next_open(self, environment_id: int, excluded_id: int | None, exclusion: Condition) -> Task | None:
        free_tasks = self.open_tasks(environment_id).matching(IsNull("delegated_to")).matching(self.no_open_dependency()).matching(exclusion).all_rows()
        return min((task for task in free_tasks if task.id != excluded_id), key=lambda task: (-task.priority, task.id), default=None)

