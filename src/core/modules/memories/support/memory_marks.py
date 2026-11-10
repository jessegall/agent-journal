from engine.chat.dock_declaration import DockDeclaration
from engine.chat.mark_click import MarkClick
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.chat.mark_group import MarkGroup
from engine.chat.mark_grouping import MarkGrouping
from core.modules.memories.models.enums.memory_dock_type import MemoryDockType
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant

MEMORIES_FAMILY = MarkFamily("memories.memories", "Memories", "fact", MarkGroup.REMINDERS)
REMINDERS_FAMILY = MarkFamily("memories.reminders", "Memories recalled", "fact", MarkGroup.REMINDERS)
CONTEXT_FAMILY = MarkFamily("memories.context", "Context", "compact", MarkGroup.AGENT)

MEMORY_MARKS = [
    MarkDeclaration(MemoryMarkType.MEMORY, MemoryMarkVariant, MEMORIES_FAMILY, "Memories", "fact", click=MarkClick.OPEN_ROW, body="memory-round.js"),
    MarkDeclaration(MemoryMarkType.REMINDER, MemoryMarkVariant, REMINDERS_FAMILY, "Memories recalled", "fact", click=MarkClick.OPEN_ROW,
                    group_label="{count} memories recalled"),
    MarkDeclaration(MemoryMarkType.COMPACTION, MemoryMarkVariant, CONTEXT_FAMILY, "Conversation compacted", "compact", click=MarkClick.NONE,
                    grouping=MarkGrouping.NONE, full_width=True),
]

MEMORY_DOCKS = [DockDeclaration(MemoryDockType.MEMORY, "bulb", "{row_title}", "memory-dock.js", most=6, reads=["memory show"])]
