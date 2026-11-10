from engine.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.memories.listeners.memory_mark_listener import MEMORIES_MODULE
from core.modules.memories.models.enums.memory_mark_type import MemoryMarkType
from core.modules.memories.models.enums.memory_mark_variant import MemoryMarkVariant
from core.modules.reminders.models.reminder import Reminder
from engine.change.created import Created

MINUTE = 60


class ReminderMadeMarkListener(MarkListener[Created[Reminder]]):
    """When a reminder is made, the chat shows a mark with its text and when it fires."""

    name = "reminders.made-mark"
    module_name = MEMORIES_MODULE

    def handle(self, event: Created[Reminder], logged: LoggedEvent) -> None:
        reminder = event.row
        self.show(logged, MemoryMarkType.REMINDER, MemoryMarkVariant.MADE, f"Reminder set: {reminder.text}", None, "reminder", reminder.id, self.firing(reminder))

    @staticmethod
    def firing(reminder: Reminder) -> str:
        if reminder.due_at is not None:
            return f"Fires at {reminder.due_at.text}"
        if reminder.interval_seconds:
            return f"Fires every {reminder.interval_seconds // MINUTE} minutes"
        if reminder.interval_tool_uses:
            return f"Fires every {reminder.interval_tool_uses} tool uses"
        return f"Fires every {reminder.interval_tasks} closed tasks"
