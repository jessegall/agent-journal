from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from engine.tasks.task_waits_updated_together import TaskWaitsUpdatedTogether
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
        if isinstance(event, Deleted) or isinstance(context.command, TaskWaitsUpdatedTogether) or (old_row is not None and self.changes_no_dependency(row, old_row)):
            return
        self.waits.update_tasks([row.id], context)

    @staticmethod
    def changes_no_dependency(row: Task, old_row: Task) -> bool:
        return row.delegated_to == old_row.delegated_to and (row.state == old_row.state or (row.state in WAITING_STATES and old_row.state in WAITING_STATES))
