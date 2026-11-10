from dataclasses import dataclass

from engine.command.command import Command
from engine.time.timestamp import Timestamp
from core.modules.reminders.models.reminder import Reminder


@dataclass(frozen=True)
class MakeReminder(Command[Reminder]):
    """Makes a reminder for a date and time or on an interval, once or repeating, with a block if asked."""

    lock = False

    text: str
    interval_seconds: int = 0
    interval_tool_uses: int = 0
    interval_tasks: int = 0
    due_at: Timestamp | None = None
    single_use: bool = False
    block_condition: str = ""
    block_subject: str = ""
