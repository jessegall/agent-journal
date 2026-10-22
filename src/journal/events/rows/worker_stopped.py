from dataclasses import dataclass
from journal.events.rows.worker_mention import WorkerMention

from journal.events.rows.row_resolved import RowResolved


@dataclass(frozen=True, kw_only=True)
class WorkerStopped(RowResolved):
    """A worker was stopped before it reported."""

    worker: WorkerMention
