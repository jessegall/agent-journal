from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.memories.support.memory_marks import MEMORIES_FAMILY


class MemoryMark(MarkDeclaration):
    """The mark MemoryMarkType.MEMORY."""

    type = MemoryMarkType.MEMORY
    variants = MemoryMarkVariant
    family = MEMORIES_FAMILY
    label = "Memories"
    mark_icon = "fact"
    click = MarkClick.OPEN_ROW
    body = "memory-round.js"
