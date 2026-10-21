from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class WorkerStopped(RowEvent):
    """A worker was stopped before it reported."""

    worker_id: int
    name: str
