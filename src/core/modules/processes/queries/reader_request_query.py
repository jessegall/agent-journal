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
        return self.kept.scoped_read(self.table.name, lambda: tuple(self.open().all_rows()), "completed_at IS NULL", name="processes.open_reader_requests")

    def agent_open_rows(self, agent_id: int) -> tuple[ReaderRequest, ...]:
        return self.kept.scoped_read(self.table.name, lambda: tuple(self.open().agent(agent_id).oldest().all_rows()), "creator_id = ? AND completed_at IS NULL", [agent_id], name="processes.agent_reader_requests")

    def remove_completed(self, completed: ReaderRequest) -> None:
        def remaining(requests: tuple[ReaderRequest, ...]) -> tuple[ReaderRequest, ...]:
            return tuple(request for request in requests if request.id != completed.id)

        self.kept.scoped_update(self.table.name, remaining, "completed_at IS NULL", name="processes.open_reader_requests")

    def agent(self, agent_id: int) -> Self:
        return self.filter(creator_id=agent_id)

    def has_active_requests(self, agent_id: int, current_time: Timestamp) -> bool:
        return any(request.expires_at > current_time for request in self.open().agent(agent_id).all_rows())
