from argparse import Namespace
from datetime import datetime, timezone

from journal.features.memory.commands.memory_command import MemoryCommand
from journal.features.memory.support.threshold_decisions import ThresholdDecisions
from journal.features.memory.support.memory_context import MemoryContext
from journal.models.reminder import Reminder
from journal.repositories.reminders import Reminders
from journal.support.rejection import Rejection



class ReminderCommand(MemoryCommand):
    """Reminders: what to keep doing here, and with --at one set for a moment, told once then and struck."""

    noun = "reminder"

    def __init__(self, reminders: Reminders, decisions: ThresholdDecisions, context: MemoryContext) -> None:
        super().__init__(decisions, context)
        self.repository = reminders

    def creation_arguments(self, creation) -> None:
        creation.add_argument("--at", default="", help="a local date and time, such as 2026-10-24 09:30: quiet until then, told once then, and struck")

    def new(self, args: Namespace) -> Reminder:
        return Reminder(text=args.text, keywords=self.keywords(args), due_at=self.moment(args.at) if args.at else None)

    def listed(self, row: Reminder) -> str:
        return f"{row.text} (at {row.due_at.astimezone().strftime(Reminder.MOMENT)})" if row.due_at else row.text

    @staticmethod
    def moment(text: str) -> datetime:
        try:
            return datetime.strptime(text.strip(), Reminder.MOMENT).astimezone(timezone.utc)
        except ValueError as wrong:
            raise Rejection(f"--at takes a local date and time such as 2026-10-24 09:30, not {text}") from wrong
