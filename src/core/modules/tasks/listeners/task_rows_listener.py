from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery


class TaskRowsListener(SaveListener[Changed[Task]]):
    name = "tasks.held-and-queued-rows"

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def handle(self, event: Changed[Task], context: Context) -> None:
        if event.old_row is not None:
            self.tasks.remove(event.old_row)
        if isinstance(event, Deleted):
            self.tasks.remove(event.row)
            return
        self.tasks.remember(event.row)
