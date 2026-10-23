from datetime import datetime, timezone

from journal.http.controllers.writing_controller import WritingController
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.report import Report
from journal.repositories.reports import Reports


class ReportController(WritingController[Report]):
    """What was checked or researched, written up here, and the updates the user reads, each marked read when the user first opens it."""

    repository: Reports

    def __init__(self, reports: Reports) -> None:
        self.repository = reports

    def rows(self) -> list[Report]:
        return self.repository.scoped()

    def read(self, request: Request) -> Response:
        report = self.repository.find(request.number("id"))
        return Response.json(self.shown(self.repository.save(report.read(datetime.now(timezone.utc)), request.actor)))
