from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from core.modules.tasks.support.task_marks import TASKS_FAMILY


class TaskMark(MarkDeclaration):
    """The mark TaskMarkType.TASK."""

    type = TaskMarkType.TASK
    variants = TaskMarkVariant
    family = TASKS_FAMILY
    label = "Task moves"
    mark_icon = "task_start"
    click = MarkClick.OPEN_ROW
