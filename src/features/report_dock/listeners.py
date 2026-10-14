from events import Fact
from events.report_dock import ReportDocked, ReportUndocked
from events.reports import ReportCompleted, ReportCreated, ReportUpdated
from receiving import Listener
from resources.base import AGENT, USER
from resources.types import Report
from serving import ReadRows

UPDATE = "update"


class SpotReportWritten(Listener[ReportCreated]):
    def listen(self, event: ReportCreated) -> list[Fact]:
        return [ReportDocked(n=event.n)] if event.actor == AGENT else []


class SpotReportTouched(Listener[ReportUpdated]):
    """The agent finishing a report docks it; the user opening it, pressing its button or putting it away undocks it. Reading an update
    leaves it docked: an update goes only by a button or its close."""

    def listen(self, event: ReportUpdated, reports: ReadRows[Report]) -> list[Fact]:
        if event.actor == AGENT and not event.is_read_mark:
            return [ReportDocked(n=event.n)]
        if event.actor != USER or (event.is_read_mark and reports.peek(event.n).kind == UPDATE):
            return []
        return [ReportUndocked(n=event.n)]


class SpotReportClosed(Listener[ReportCompleted]):
    def listen(self, event: ReportCompleted) -> list[Fact]:
        return [ReportUndocked(n=event.n)]
