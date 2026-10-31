from core.base.change.logged_event import LoggedEvent
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.listeners.reminder_acknowledged_mark_listener import REMINDER_TYPE
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.memories.models.memory import Memory


class MemoryRemovedMarkListener(MemoryMarkListener):
    """When a memory is removed, its chat shows a mark naming the memory; a reminder has its own
    acknowledged mark."""

    name = "memories.removed-mark"
    event = "memory.remove"

    def handle(self, event: LoggedEvent) -> None:
        if self.queries.query(Memory).find(event.row_id).type != REMINDER_TYPE:
            self.show(event, MemoryMarkVariant.REMOVED, f"Memory {event.row_id} removed", environment_id=self.memory_environment(event), row_id=event.row_id)
