from dataclasses import dataclass
from journal.events.rows.worker_mention import WorkerMention

from journal.events.rows.row_resolved import RowResolved


@dataclass(frozen=True, kw_only=True)
class WorkerDelivered(RowResolved):
    """A worker handed in its work with a proof for each point of its brief."""

    worker: WorkerMention
