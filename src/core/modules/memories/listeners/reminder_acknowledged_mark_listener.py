from core.base.change.logged_event import LoggedEvent
from core.modules.memories.listeners.memory_mark_listener import MemoryMarkListener
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.memories.models.memory import Memory

REMINDER_TYPE = "reminder"


class ReminderAcknowledgedMarkListener(MemoryMarkListener):
    """When a reminder is removed, its chat shows that the reminder was acknowledged."""

    name = "memories.reminder-acknowledged-mark"
    event = "memory.remove"

    def handle(self, event: LoggedEvent) -> None:
        memory = self.queries.query(Memory).find(event.row_id)
        if memory.type == REMINDER_TYPE:
            self.show(event, MemoryMarkVariant.ACKNOWLEDGED, f"Reminder {memory.id} acknowledged", MemoryMarkType.REMINDER, memory.environment_id, row_id=memory.id)
