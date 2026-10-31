from enum import StrEnum

from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.memories.models.memory import Memory

MEMORIES_MODULE = "journal.core.memories"


class MemoryMarkListener(MarkListener):
    """What the memory mark listeners share: the memories module as the writer, memory as the default type
    and row, and the memory's own environment for an event that carries none."""

    module_name = MEMORIES_MODULE

    def memory_environment(self, event: LoggedEvent) -> int | None:
        return event.environment_id or self.queries.query(Memory).find(event.row_id).environment_id

    def show_memory(self, event: LoggedEvent, variant: MemoryMarkVariant, text: str, type: StrEnum = MemoryMarkType.MEMORY, environment_id: int | None = None,
             agent_id: int | None = None, row_model: str = "memory", row_id: int | None = None) -> None:
        self.show(event, type, variant, text, environment_id, agent_id, row_model, row_id)
