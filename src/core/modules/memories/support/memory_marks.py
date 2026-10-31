from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.base.chat.mark_grouping import MarkGrouping
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant

MEMORIES_FAMILY = MarkFamily("memories.memories", "Memories", "fact", MarkGroup.REMINDERS)
REMINDERS_FAMILY = MarkFamily("memories.reminders", "Reminders", "reminder", MarkGroup.REMINDERS)
CONTEXT_FAMILY = MarkFamily("memories.context", "Context", "compact", MarkGroup.AGENT)

MEMORY_MARKS = [
    MarkDeclaration(MemoryMarkType.MEMORY, MemoryMarkVariant, MEMORIES_FAMILY, "Memories", "fact", click=MarkClick.OPEN_ROW),
    MarkDeclaration(MemoryMarkType.REMINDER, MemoryMarkVariant, REMINDERS_FAMILY, "Rules and reminders recalled", "rule", click=MarkClick.OPEN_ROW,
                    group_label="{count} rules and reminders recalled"),
    MarkDeclaration(MemoryMarkType.COMPACTION, MemoryMarkVariant, CONTEXT_FAMILY, "Conversation compacted", "compact", click=MarkClick.NONE,
                    grouping=MarkGrouping.NONE),
]
