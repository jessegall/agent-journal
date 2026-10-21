from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class WorkerBack(RowEvent):
    """A worker reported, its job done or given up."""

    worker_id: int
    name: str
    report: int
    dispatched_by: str
