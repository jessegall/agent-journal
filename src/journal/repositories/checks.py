from datetime import datetime

from journal.models.check import Check
from journal.repositories.repository import Repository


class Checks(Repository[Check]):
    model = Check

    def due(self, now: datetime) -> list[Check]:
        return [check for check in self.all() if check.due_at(now)]
