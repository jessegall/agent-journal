from journal.models.reminder import Reminder
from journal.repositories.scoped_repository import ScopedRepository


class Reminders(ScopedRepository[Reminder]):
    model = Reminder
