from engine.chat.mark_category import MarkCategory
from engine.enums.mark_group import MarkGroup

MEMORIES_FAMILY = MarkCategory("memories.memories", "Memories", "fact", MarkGroup.REMINDERS)
REMINDERS_FAMILY = MarkCategory("memories.reminders", "Memories recalled", "fact", MarkGroup.REMINDERS)
CONTEXT_FAMILY = MarkCategory("memories.context", "Context", "compact", MarkGroup.AGENT)
