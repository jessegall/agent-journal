from dataclasses import dataclass

from journal.events.rows.row_resolved import RowResolved


@dataclass(frozen=True, kw_only=True)
class WorkerStopped(RowResolved):
    """A worker was stopped before it reported."""

    worker_id: int
    name: str
    dispatcher: str = ""
