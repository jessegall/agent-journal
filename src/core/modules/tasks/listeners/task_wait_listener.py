from dataclasses import replace

from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.support.task_waits import TaskWaits


class TaskWaitListener(SaveListener):
    """A row a blocked task waits on resolves when it leaves its lifecycle's editable states, and may open the
    task; a
    task no longer blocked has its waits ended."""

    name = "tasks.task-waits"
    event = "*.*"

    def __init__(self, queries: Queries, repository: Repository, tables: Tables, waits: TaskWaits) -> None:
        self.queries, self.repository, self.tables, self.waits = queries, repository, tables, waits

    def handle(self, change: Change[Model]) -> None:
        row = change.row
        lifecycle = type(row).lifecycle
        if isinstance(row, Task) and row.state is not TaskState.BLOCKED:
            for wait in tuple(self.waits.open_waits(row.id).all_rows()):
                self.repository.save(replace(wait, ended_at=change.context.timestamp), change.context)
        if isinstance(row, TaskWait) or lifecycle is None:
            return
        if change.new_row is not None and getattr(row, "state", None) in lifecycle.editable:
            return
        target = f"{self.tables.table(type(row)).name}:{row.id}"
        for wait in tuple(self.queries.query(TaskWait).filter(target=target).matching(IsNull("ended_at")).all_rows()):
            self.waits.resolved(wait, change.context)
