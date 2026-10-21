from journal.http.controllers.writing_controller import WritingController
from journal.models.report import Report
from journal.repositories.reports import Reports


class ReportController(WritingController[Report]):
    """What was checked or researched, written up here."""

    def __init__(self, reports: Reports) -> None:
        self.repository = reports

    def rows(self) -> list[Report]:
        return self.repository.scoped()
