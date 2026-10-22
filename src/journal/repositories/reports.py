from datetime import datetime
from journal.models.report import Report
from journal.repositories.scoped_repository import ScopedRepository


class Reports(ScopedRepository[Report]):
    model = Report

    def recent_numbered(self, ids: list[int], time: datetime) -> list[Report]:
        return [report for report in self.numbered(ids) if report.creation_time >= time]
