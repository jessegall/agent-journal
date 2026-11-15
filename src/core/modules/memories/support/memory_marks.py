from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup

MEMORIES_FAMILY = MarkFamily("memories.memories", "Memories", "fact", MarkGroup.REMINDERS)
REMINDERS_FAMILY = MarkFamily("memories.reminders", "Memories recalled", "fact", MarkGroup.REMINDERS)
CONTEXT_FAMILY = MarkFamily("memories.context", "Context", "compact", MarkGroup.AGENT)
