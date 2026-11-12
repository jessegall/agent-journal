from datetime import timedelta
from typing import Self

from engine.database.database import Database
from engine.model.tables import Tables
from engine.query.conditions.maximum import Maximum
from engine.query.query import Query
from engine.time.timestamp import Timestamp
from core.modules.processes.models.request_run import RequestRun


class RequestRunQuery(Query[RequestRun]):
    """Reads the rows of the hooks, journal commands and viewer requests that went through the one door."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, RequestRun)

    def ended_before(self, present: Timestamp, days: int) -> Self:
        cutoff = Timestamp(present.value - timedelta(days=days))
        return self.matching(Maximum("ended_at", cutoff.text))
