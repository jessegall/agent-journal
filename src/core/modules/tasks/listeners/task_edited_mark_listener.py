from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from core.modules.tasks.models.task import Task
from core.base.change.updated import Updated

EDIT_COMMAND = f"Edit{Task.__name__}"


class TaskEditedMarkListener(MarkListener[Updated[Task]]):
    """When an agent edits a task, the chat shows a mark naming the task, with a click that opens it."""

    name = "tasks.edited-mark"
    module_name = "journal.core.tasks"

    def handle(self, event: Updated[Task], logged: LoggedEvent) -> None:
        if self.is_agent_command(logged, EDIT_COMMAND):
            task = event.row
            self.show(logged, TaskMarkType.TASK, TaskMarkVariant.EDITED, f"Task {task.id} edited: {task.title}", None, "task", task.id)
