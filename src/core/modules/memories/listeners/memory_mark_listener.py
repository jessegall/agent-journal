from enum import StrEnum

from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.base.change.event_subscriber import E

MEMORIES_MODULE = "journal.core.memories"


class MemoryMarkListener(MarkListener[E]):
    """What the memory mark listeners share: the memories module as the writer, memory as the default type
    and row."""

    module_name = MEMORIES_MODULE

    def show_memory(self, logged: LoggedEvent, variant: MemoryMarkVariant, text: str, type: StrEnum = MemoryMarkType.MEMORY,
             agent_id: int | None = None, row_model: str = "memory", row_id: int | None = None, detail: str = "") -> None:
        self.show(logged, type, variant, text, agent_id, row_model, row_id, detail)
