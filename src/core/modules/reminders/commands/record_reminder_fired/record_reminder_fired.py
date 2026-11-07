from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.reminders.models.reminder import Reminder


@dataclass(frozen=True)
class RecordReminderFired(Command[Reminder]):
    """A reminder reached its agent."""

    reminder_id: int
