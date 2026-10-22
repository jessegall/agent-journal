from dataclasses import dataclass
from journal.events.rows.worker_mention import WorkerMention

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class WorkerReady(RowEvent):
    """A worker said it is ready and took up its task."""

    worker: WorkerMention
