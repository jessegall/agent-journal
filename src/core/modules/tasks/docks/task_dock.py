from engine.chat.dock_declaration import DockDeclaration
from core.modules.tasks.models.enums.task_dock_type import TaskDockType


class TaskDock(DockDeclaration):
    """The dock of TaskDockType.TASK."""

    type = TaskDockType.TASK
    icon = "task"
    title = "{row_title}"
    body = "task-dock.js"
    most = 6
    reads = ["task show"]
