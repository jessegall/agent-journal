from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.model.state_book import StateBook
from core.base.model.tables import Tables
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.support.task_waits import TaskWaits
from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context


class TaskWaitListener(SaveListener[Changed[Model]]):
    """A row a blocked task waits on resolves when it leaves its lifecycle's editable states, and may open the
    task; a
    task no longer blocked has its waits ended."""

    name = "tasks.task-waits"
    disabled_scopes = [ActorScope]

    def __init__(self, repository: Repository, tables: Tables, waits: TaskWaits, book: StateBook) -> None:
        self.repository, self.tables, self.waits, self.book = repository, tables, waits, book

    def handle(self, event: Changed[Model], context: Context) -> None:
        row = event.row
        if isinstance(row, TaskWait):
            if isinstance(event, Deleted):
                self.waits.remove(row)
                return
            self.waits.remember(row)
            return
        if isinstance(row, HelperJob) and row.ended_at is not None:
            self.waits.resolved(self.waits.pending_target(f"helpers:{row.helper_id}:{row.id}"), context)
            return
        lifecycle = self.book.lifecycle(type(row))
        if isinstance(row, Task) and row.state is not TaskState.BLOCKED:
            for wait in self.waits.pending_task(row.id):
                self.repository.update(wait, context, ended_at=context.timestamp)
        if lifecycle is None:
            return
        if not isinstance(event, Deleted) and getattr(row, "state", None) in lifecycle.editable:
            return
        target = f"{self.tables.table(type(row)).name}:{row.id}"
        self.waits.resolved(self.waits.pending_target(target), context)
