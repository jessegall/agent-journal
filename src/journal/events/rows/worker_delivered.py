from dataclasses import dataclass
from journal.events.rows.worker_mention import WorkerMention

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class WorkerDelivered(RowEvent):
    """A worker handed in its work with a proof for each point of its brief."""

    worker: WorkerMention
