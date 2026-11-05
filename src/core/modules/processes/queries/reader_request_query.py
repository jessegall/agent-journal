from typing import Self

from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.base.timestamp import Timestamp
from core.modules.processes.models.reader_request import ReaderRequest


class ReaderRequestQuery(Query[ReaderRequest]):
    """Reads requests for proper readers."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, ReaderRequest)
        self.kept = kept

    def open(self) -> Self:
        return self.filter(completed_at=None)

    def open_rows(self) -> tuple[ReaderRequest, ...]:
        return self.kept.read_in_scope(self.table.name, lambda: tuple(self.open().all_rows()), "completed_at IS NULL", name="processes.open_reader_requests")

    def remove_completed(self, completed: ReaderRequest) -> None:
        self.kept.update_in_scope(self.table.name, lambda requests: tuple(request for request in requests if request.id != completed.id),
                                  "completed_at IS NULL", name="processes.open_reader_requests")

    def agent(self, agent_id: int) -> Self:
        return self.filter(creator_id=agent_id)

    def has_active_requests(self, agent_id: int, current_time: Timestamp) -> bool:
        return any(request.expires_at > current_time for request in self.open().agent(agent_id).all_rows())
