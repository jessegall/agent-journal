from engine.event.logged_event import LoggedEvent
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from engine.event.created import Created
from core.modules.memories.models.memory import Memory


class MemoryMadeMarkListener(MemoryMarkListener[Created[Memory]]):
    """When a memory is made, its chat shows a mark naming the memory."""

    name = "memories.made-mark"

    def handle(self, event: Created[Memory], logged: LoggedEvent) -> None:
        self.show_memory(logged, MemoryMarkVariant.MADE, f"Memory {logged.row_id} created", row_id=logged.row_id)
