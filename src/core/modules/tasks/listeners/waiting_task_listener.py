from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.base.scope.actor_scope import ActorScope
from core.base.tasks.tasks_changed_together import TasksChangedTogether
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.dependency_waits import DependencyWaits


WAITING_STATES = (TaskState.OPEN, TaskState.BLOCKED)


class WaitingTaskListener(SaveListener[Changed[Task]]):
    """A task whose state or assignee changes may open what waits on it, or block it again. A move between open and
    blocked changes no dependency, and a command that changes tasks together updates all its tasks at once."""

    name = "tasks.waiting-tasks"
    disabled_scopes = [ActorScope]

    def __init__(self, waits: DependencyWaits) -> None:
        self.waits = waits

    def handle(self, event: Changed[Task], context: Context) -> None:
        row, old_row = event.row, event.old_row
        if isinstance(event, Deleted) or isinstance(context.command, TasksChangedTogether) or (old_row is not None and self.changes_no_dependency(row, old_row)):
            return
        pairs = self.waits.pairs()
        for dependent in (pair for pair in pairs if pair.dependency_id == row.id):
            self.waits.update_wait(dependent.task_id, row.id, context)
        for dependency in (pair for pair in pairs if pair.task_id == row.id):
            self.waits.update_wait(row.id, dependency.dependency_id, context)

    @staticmethod
    def changes_no_dependency(row: Task, old_row: Task) -> bool:
        return row.delegated_to == old_row.delegated_to and (row.state == old_row.state or (row.state in WAITING_STATES and old_row.state in WAITING_STATES))
