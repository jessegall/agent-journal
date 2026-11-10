from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from engine.event.created import Created
from engine.event.moved import Moved
from engine.event.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from core.modules.tasks.models.task import Task

VARIANT_LABELS = {TaskMarkVariant.MADE: "created"}
MOVE_VARIANTS = {"create": TaskMarkVariant.MADE, "start": TaskMarkVariant.STARTED, "close": TaskMarkVariant.CLOSED, "block": TaskMarkVariant.BLOCKED}


class TaskMoveMarkListener(MarkListener[Created[Task] | Moved[Task]]):
    """When a task is made, started, closed or blocked, the chat shows a mark naming the task and the move."""

    name = "tasks.move-mark"
    moves = (TaskLifecycle.start, TaskLifecycle.close, TaskLifecycle.block)
    module_name = "journal.core.tasks"

    def handle(self, event: Created[Task] | Moved[Task], logged: LoggedEvent) -> None:
        variant = MOVE_VARIANTS.get(event.move.name if event.move else "create")
        if variant is not None:
            task = event.row
            self.show(logged, TaskMarkType.TASK, variant, f"Task {task.id} {VARIANT_LABELS.get(variant, variant.value)}: {task.title}", None, "task", task.id)
