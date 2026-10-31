from core.base.change.logged_event import LoggedEvent
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant


class MemoryRemovedMarkListener(MemoryMarkListener):
    """When a memory is removed, its chat shows a mark naming the memory."""

    name = "memories.removed-mark"
    event = "memory.remove"

    def handle(self, event: LoggedEvent) -> None:
        self.show(event, MemoryMarkVariant.REMOVED, f"Memory {event.row_id} removed", row_id=event.row_id)
