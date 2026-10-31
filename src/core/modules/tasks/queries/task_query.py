from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState


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

    def open_tasks(self, environment_id: int) -> Self:
        return self.environment(environment_id).filter(state=TaskState.OPEN)

