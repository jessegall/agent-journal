from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from core.modules.tasks.models.task import Task

MOVE_VARIANTS = {"create": TaskMarkVariant.MADE, "start": TaskMarkVariant.STARTED, "close": TaskMarkVariant.CLOSED, "block": TaskMarkVariant.BLOCKED}


class TaskMoveMarkListener(MarkListener):
    """When a task is made, started, closed or blocked, the chat shows a mark naming the task and the move."""

    name = "tasks.move-mark"
    event = "task.*"
    module_name = "journal.core.tasks"

    def handle(self, event: LoggedEvent) -> None:
        variant = MOVE_VARIANTS.get(event.event.split(".")[1])
        if variant is not None:
            task = self.queries.query(Task).find(event.row_id)
            self.show(event, TaskMarkType.TASK, variant, f"Task {task.id} {variant.value}", task.environment_id, None, "task", task.id)
