from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from core.modules.tasks.models.task import Task

EDIT_COMMAND = f"Edit{Task.__name__}"


class TaskEditedMarkListener(MarkListener):
    """When an agent edits a task, the chat shows a mark naming the task, with a click that opens it."""

    name = "tasks.edited-mark"
    event = "task.update"
    module_name = "journal.core.tasks"

    def handle(self, event: LoggedEvent) -> None:
        if event.command == EDIT_COMMAND and self.by_agent(event):
            task = self.queries.query(Task).find(event.row_id)
            self.show(event, TaskMarkType.TASK, TaskMarkVariant.EDITED, f"Task {task.id} edited: {task.title}", task.environment_id, None, "task", task.id)
