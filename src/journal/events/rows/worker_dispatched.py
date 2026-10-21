from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class WorkerDispatched(RowEvent):
    """A worker was sent out on a job, by the session that dispatched it."""

    worker_id: int
    name: str
    dispatched_by: str
