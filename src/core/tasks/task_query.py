from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from core.tasks.task import Task


class TaskQuery(Query[Task]):
    """Reads tasks, with the filters the tasks module and its guards use by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Task)

    def environment(self, environment_id: int) -> Self:
        return self.filter(environment_id=environment_id)

    def unclosed(self) -> Self:
        return self.matching(IsNull("closed_at"))
