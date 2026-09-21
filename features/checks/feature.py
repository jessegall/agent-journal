from features.base import Feature
from features.checks.controller import Checks
from features.checks.details import ChecksDetails
from features.checks.handlers import ReportCheckResult, RunDueChecks
from features.journal import Journal

__all__ = ["Checks"]


class ChecksFeature(Feature):
    details = ChecksDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(RunDueChecks())
        journal.events.handler(ReportCheckResult())
