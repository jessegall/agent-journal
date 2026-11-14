from engine.enums.mark_click import MarkClick
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant

TASKS_FAMILY = MarkFamily("tasks.tasks", "Tasks", "task", MarkGroup.WORK)

TASK_MARKS = [MarkDeclaration(TaskMarkType.TASK, TaskMarkVariant, TASKS_FAMILY, "Task moves", "task_start", click=MarkClick.OPEN_ROW)]

