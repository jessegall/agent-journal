from events import Fact
from events.report_dock import ReportDocked, ReportUndocked
from receiving import Handler
from resources.types import Report
from serving import Rows


class Dock(Handler[ReportDocked]):
    def handle(self, event: ReportDocked, reports: Rows[Report]) -> list[Fact]:
        reports.update(event.n, docked=True)
        return []


class Undock(Handler[ReportUndocked]):
    def handle(self, event: ReportUndocked, reports: Rows[Report]) -> list[Fact]:
        reports.update(event.n, docked=False)
        return []
