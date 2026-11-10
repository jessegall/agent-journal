from typing import Self

from engine.query.conditions.greater import Greater
from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from engine.model.tables import Tables
from engine.query.query import Query
from engine.time.timestamp import Timestamp
from core.modules.processes.models.reader_request import ReaderRequest


OPEN_REQUESTS_REASON = "the open reader requests are read once and kept until one completes"

class ReaderRequestQuery(Query[ReaderRequest]):
    """Reads requests for proper readers."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, ReaderRequest)
        self.kept = kept

    def open(self) -> Self:
        return self.filter(completed_at=None)

    def open_rows(self) -> tuple[ReaderRequest, ...]:
        return self.kept.scoped_read(self.table.name, lambda: tuple(self.open().full_table(OPEN_REQUESTS_REASON).all_rows()), "completed_at IS NULL", name="processes.open_reader_requests")

    def agent_open_rows(self, agent_id: int) -> tuple[ReaderRequest, ...]:
        return self.kept.scoped_read(self.table.name, lambda: tuple(self.open().agent(agent_id).oldest().all_rows()), "creator_id = ? AND completed_at IS NULL", [agent_id], name="processes.agent_reader_requests")

    def remove_completed(self, completed: ReaderRequest) -> None:
        def remaining(requests: tuple[ReaderRequest, ...]) -> tuple[ReaderRequest, ...]:
            return tuple(request for request in requests if request.id != completed.id)

        self.kept.scoped_update(self.table.name, remaining, "completed_at IS NULL", name="processes.open_reader_requests")

    def agent(self, agent_id: int) -> Self:
        return self.filter(creator_id=agent_id)

    def active_requester_ids(self, current_time: Timestamp) -> set[int]:
        return {request.creator_id for request in self.open_rows() if request.expires_at > current_time}

    def has_active_requests(self, agent_id: int, current_time: Timestamp) -> bool:
        return self.open().agent(agent_id).matching(Greater("expires_at", current_time.text)).exists()
