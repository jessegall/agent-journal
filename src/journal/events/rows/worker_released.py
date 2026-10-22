from dataclasses import dataclass
from journal.events.rows.worker_mention import WorkerMention

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class WorkerReleased(RowEvent):
    """A worker's task was let go without its work being merged."""

    worker: WorkerMention
