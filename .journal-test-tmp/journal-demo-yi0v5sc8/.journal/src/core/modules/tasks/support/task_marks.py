from core.base.chat.dock_declaration import DockDeclaration
from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.tasks.models.enums.task_dock_type import TaskDockType
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant

TASKS_FAMILY = MarkFamily("tasks.tasks", "Tasks", "task", MarkGroup.WORK)

TASK_MARKS = [MarkDeclaration(TaskMarkType.TASK, TaskMarkVariant, TASKS_FAMILY, "Task moves", "task_start", click=MarkClick.OPEN_ROW)]

TASK_DOCKS = [DockDeclaration(TaskDockType.TASK, "task", "{row_title}", "task-dock.js", most=6, reads=["task show"])]
