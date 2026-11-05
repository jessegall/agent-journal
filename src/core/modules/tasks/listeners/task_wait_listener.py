from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.model.state_book import StateBook
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.tasks.models.enums.task_state import TaskState
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

    def __init__(self, queries: Queries, repository: Repository, tables: Tables, waits: TaskWaits, book: StateBook) -> None:
        self.queries, self.repository, self.tables, self.waits, self.book = queries, repository, tables, waits, book

    def handle(self, event: Changed[Model], context: Context) -> None:
        row = event.row
        lifecycle = self.book.lifecycle(type(row))
        if isinstance(row, Task) and row.state is not TaskState.BLOCKED:
            for wait in self.waits.open_waits(row.id).all_rows():
                self.repository.update(wait, context, ended_at=context.timestamp)
        if isinstance(row, TaskWait) or lifecycle is None:
            return
        if not isinstance(event, Deleted) and getattr(row, "state", None) in lifecycle.editable:
            return
        target = f"{self.tables.table(type(row)).name}:{row.id}"
        for wait in tuple(self.queries.query(TaskWait).filter(target=target).matching(IsNull("ended_at")).all_rows()):
            self.waits.resolved(wait, context)
