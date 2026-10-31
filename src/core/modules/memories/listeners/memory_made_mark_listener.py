from core.base.change.logged_event import LoggedEvent
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant


class MemoryMadeMarkListener(MemoryMarkListener):
    """When a memory is made, its chat shows a mark naming the memory."""

    name = "memories.made-mark"
    event = "memory.create"

    def handle(self, event: LoggedEvent) -> None:
        self.show(event, MemoryMarkVariant.MADE, f"Memory {event.row_id} made", row_id=event.row_id)
