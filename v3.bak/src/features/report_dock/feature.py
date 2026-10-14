from events.report_dock import ReportDocked, ReportUndocked
from events.reports import ReportCompleted, ReportCreated, ReportUpdated
from expects import Dispatches, Given, Updated, nothing
from features.report_dock.details import ReportDockDetails
from features.report_dock.handlers import Dock, Undock
from features.report_dock.listeners import SpotReportClosed, SpotReportTouched, SpotReportWritten
from framework.base import Feature
from framework.journal import Journal
from resources.base import AGENT, USER
from resources.types import Report

FOUND = Report(n=1, title="What was found")
UPDATE = Report(n=1, title="What happened today", data={"kind": "update"})


def touched(actor: str, by: str = "") -> ReportUpdated:
    return ReportUpdated(n=1, type="report", action="updated", actor=actor, by=by)


class ReportDock(Feature):
    details = ReportDockDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(ReportCreated, SpotReportWritten(), expects=[
            Given(ReportCreated(n=1, type="report", action="created", actor=AGENT), rows=[FOUND]) >> Dispatches(ReportDocked(n=1)),
            Given(ReportCreated(n=1, type="report", action="created", actor=USER), rows=[FOUND]) >> Dispatches(nothing),
        ])
        journal.events.listen(ReportUpdated, SpotReportTouched(), expects=[
            Given(touched(AGENT), rows=[FOUND]) >> Dispatches(ReportDocked(n=1)),
            Given(touched(USER, by="read"), rows=[FOUND]) >> Dispatches(ReportUndocked(n=1)),
            Given(touched(USER), rows=[FOUND]) >> Dispatches(ReportUndocked(n=1)),
            Given(touched(USER, by="read"), rows=[UPDATE]) >> Dispatches(nothing),
            Given(touched(AGENT, by="read"), rows=[FOUND]) >> Dispatches(nothing),
        ])
        journal.events.listen(ReportCompleted, SpotReportClosed(), expects=[
            Given(ReportCompleted(n=1, type="report", action="completed", actor=USER), rows=[FOUND]) >> Dispatches(ReportUndocked(n=1)),
        ])
        journal.events.handle(ReportDocked, Dock(), expects=[
            Given(ReportDocked(n=1), rows=[FOUND]) >> Updated(Report(n=1), docked=True),
        ])
        journal.events.handle(ReportUndocked, Undock(), expects=[
            Given(ReportUndocked(n=1), rows=[Report(n=1, title="What was found", data={"docked": True})]) >> Updated(Report(n=1), docked=False),
        ])
