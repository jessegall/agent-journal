from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.reminders.commands.record_reminder_fired.record_reminder_fired import RecordReminderFired
from core.modules.reminders.models.reminder import Reminder


class RecordReminderFiredHandler(Handler[RecordReminderFired, Reminder]):
    """Keeps when a reminder last fired, and ends one that comes only once."""

    command = RecordReminderFired

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordReminderFired, context: Context) -> Reminder:
        reminder = self.queries.query(Reminder).find(command.reminder_id)
        return self.repository.update(reminder, context, last_fired_at=context.timestamp, ended_at=context.timestamp if reminder.has_one_firing else None)
