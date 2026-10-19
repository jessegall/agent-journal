from datetime import datetime

from journal.models.check import Check
from journal.repositories.repository import Repository


class Checks(Repository[Check]):
    model = Check

    def all(self) -> list[Check]:
        """The checks the user keeps: a check a blocked task waits on is the task's, and listed with it."""
        return self.newest("waited_on = 0", ())

    def due(self, now: datetime) -> list[Check]:
        return [check for check in self.every() if check.due_at(now)]

    def broken_waits(self) -> list[Check]:
        """The checks a blocked task waits on that could not run their command, so the wait would never end."""
        return [check for check in self.every_where(waited_on=True) if check.cannot_run() and not check.is_settled()]
