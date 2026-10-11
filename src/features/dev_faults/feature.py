from functools import cached_property

from engine.events.engine import Measured
from expects import Given, Unchanged, Updated
from expects.watching import BROKEN
from features.base import Feature
from features.journal import Journal
from features.dev_faults.details import DevFaultsDetails
from engine.developing import developing
from features.dev_faults.handlers import LiftOverdueHold, ReportSlow, RestartCountOnClose, TodoCompleted
from engine.events.resources import ResourceCreated
from resources.types import Notification, Todo
from features.dev_faults.reports import FaultReports
from features.dev_faults.reports import OVER
from features.dev_faults.routes import get_diagnostics, post_clear_diagnostics

__all__ = ["developing"]

SLOW_TITLE = f"request /api/summary {OVER}"


class DevFaults(Feature):
    details = DevFaultsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ReportSlow(), expects=[
            Given(Measured(root="/nowhere", env="t", kind="request", target="/api/summary", took=4.0, working=3.0)) >> Unchanged(),
        ])
        journal.events.handler(LiftOverdueHold(), expects=[
            Given(ResourceCreated(n=2, type="todo"), rows=[Todo(n=2, title=SLOW_TITLE)]) >> Unchanged(),
            Given(ResourceCreated(n=2, type="todo"), rows=[Todo(n=2, title="the header")]) >> Unchanged(),
            Given(ResourceCreated(n=2, type="message"), rows=[Todo(n=2, title=SLOW_TITLE)]) >> Unchanged(),
        ])
        journal.events.handler(RestartCountOnClose(), expects=[
            Given(TodoCompleted(n=2, type="todo"), rows=[Todo(n=2, title=SLOW_TITLE), Notification(n=1, title=SLOW_TITLE, data={"times": 5})])
                >> Updated(Notification(n=1), times=0),
            Given(TodoCompleted(n=2, type="todo"), rows=[Todo(n=2, title="the header"), Notification(n=1, title=SLOW_TITLE, data={"times": 5})]) >> Unchanged(),
        ])
        journal.routes.add(get_diagnostics, post_clear_diagnostics)
        BROKEN.add(self, self.reports.broken)

    @cached_property
    def reports(self) -> FaultReports:
        return FaultReports(self)
