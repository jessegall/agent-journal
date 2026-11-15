from engine.database.database import Database
from engine.request.request_values import RequestValues
from engine.time.clock import Clock
from suites.coding.modules.checks.models.check import Check
from suites.coding.modules.checks.queries.check_query import CheckQuery

REPEAT_MINUTES = 60


class UnreportedChecks:
    """The checks that fail and have not been told to the main agent, or not for an hour: read once a request,
    so the lines that tell them and the effect that records them share one read."""

    def __init__(self, checks: CheckQuery, clock: Clock, request_values: RequestValues, database: Database) -> None:
        self.checks, self.clock, self.request_values, self.database = checks, clock, request_values, database

    def failing(self) -> list[Check]:
        return self.request_values.read("checks.unreported", self.database.change_mark, lambda: list(self.checks.unreported(self.clock.timestamp(), REPEAT_MINUTES)))
