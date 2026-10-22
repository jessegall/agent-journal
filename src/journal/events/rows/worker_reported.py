from dataclasses import dataclass
from journal.events.rows.worker_mention import WorkerMention

from journal.events.rows.row_resolved import RowResolved


@dataclass(frozen=True, kw_only=True)
class WorkerReported(RowResolved):
    """A worker reported, its job done or given up."""

    worker: WorkerMention
    report: int
