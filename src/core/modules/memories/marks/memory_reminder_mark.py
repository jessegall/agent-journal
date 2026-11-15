from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.memories.support.marks.memory_marks import REMINDERS_FAMILY


class MemoryReminderMark(MarkDeclaration):
    """The mark MemoryMarkType.REMINDER."""

    type = MemoryMarkType.REMINDER
    variants = MemoryMarkVariant
    family = REMINDERS_FAMILY
    label = "Memories recalled"
    mark_icon = "fact"
    click = MarkClick.OPEN_ROW
    group_label = "{count} memories recalled"
