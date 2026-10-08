from functools import cached_property
from pathlib import Path

from features.base import Feature
from features.journal import Journal
from features.dev_faults.details import DevFaultsDetails
from features.dev_faults.developing import developing
from features.dev_faults.handlers import LiftOverdueHold, ReportSlow
from features.dev_faults.reports import FaultReports
from features.dev_faults.routes import get_diagnostics, post_clear_diagnostics

__all__ = ["developing"]


class DevFaults(Feature):
    details = DevFaultsDetails

    @classmethod
    def default_for(cls, root) -> bool:
        return developing(Path(root).parent) if root else cls.default

    def register(self, journal: Journal) -> None:
        journal.events.handler(ReportSlow())
        journal.events.handler(LiftOverdueHold())
        journal.routes.add(get_diagnostics, post_clear_diagnostics)

    @cached_property
    def reports(self) -> FaultReports:
        return FaultReports(self)
