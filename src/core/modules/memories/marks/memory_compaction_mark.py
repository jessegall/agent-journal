from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from engine.enums.mark_grouping import MarkGrouping
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.memories.support.marks.memory_marks import CONTEXT_FAMILY


class MemoryCompactionMark(MarkDeclaration):
    """The mark MemoryMarkType.COMPACTION."""

    type = MemoryMarkType.COMPACTION
    variants = MemoryMarkVariant
    family = CONTEXT_FAMILY
    label = "Conversation compacted"
    mark_icon = "compact"
    click = MarkClick.NONE
    grouping = MarkGrouping.NONE
    full_width = True
