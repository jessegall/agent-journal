from dataclasses import dataclass
from journal.events.rows.worker_mention import WorkerMention

from journal.events.rows.row_pending import RowPending


@dataclass(frozen=True, kw_only=True)
class WorkerDispatched(RowPending):
    """A worker was sent out on a job; its awaiter is the session that dispatched it."""

    worker: WorkerMention
    brief: str = ""
