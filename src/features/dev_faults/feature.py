from functools import cached_property

from features.base import Feature
from features.journal import Journal
from features.dev_faults.details import DevFaultsDetails
from features.dev_faults.developing import developing
from features.dev_faults.handlers import LiftOverdueHold, ReportSlow, RestartCountOnClose
from features.dev_faults.reports import FaultReports
from features.dev_faults.routes import get_diagnostics, post_clear_diagnostics

__all__ = ["developing"]


class DevFaults(Feature):
    details = DevFaultsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ReportSlow())
        journal.events.handler(LiftOverdueHold())
        journal.events.handler(RestartCountOnClose())
        journal.routes.add(get_diagnostics, post_clear_diagnostics)

    @cached_property
    def reports(self) -> FaultReports:
        return FaultReports(self)
