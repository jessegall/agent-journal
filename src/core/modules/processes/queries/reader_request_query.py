from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.base.query.select import Select
from core.base.query.conditions.equal import Equal
from core.base.query.conditions.subquery_match import SubqueryMatch
from core.base.timestamp import Timestamp
from core.modules.processes.models.reader_request import ReaderRequest


class ReaderRequestQuery(Query[ReaderRequest]):
    """Reads requests for proper readers."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, ReaderRequest)

    def open(self) -> Self:
        return self.filter(completed_at=None)

    def environment(self, environment_id: int) -> Self:
        return self.filter(environment_id=environment_id)

    def agent(self, agent_id: int) -> Self:
        processes = Select("processes").matching(Equal("agent_id", agent_id))
        parts = Select("process_parts").matching(SubqueryMatch("process_id", processes.column("id")))
        return self.matching(SubqueryMatch("id", parts.column("reader_request_id")))

    def has_active_requests(self, agent_id: int, current_time: Timestamp) -> bool:
        return any(request.expires_at > current_time for request in self.open().agent(agent_id).all_rows())
