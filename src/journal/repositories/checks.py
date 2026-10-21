from datetime import datetime

from journal.models.check import Check
from journal.repositories.repository import Repository


class Checks(Repository[Check]):
    model = Check

    def all(self) -> list[Check]:
        return self.newest("waited_on = 0", ())

    def due(self, time: datetime) -> list[Check]:
        return [check for check in self.rows() if check.needs_run(time)]

    def broken_waits(self) -> list[Check]:
        return [check for check in self.all_matching(wait_target=True) if check.cannot_run() and not check.is_resolved()]
