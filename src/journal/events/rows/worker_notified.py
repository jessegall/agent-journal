from dataclasses import dataclass
from journal.events.rows.worker_mention import WorkerMention

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class WorkerNotified(RowEvent):
    """A running worker was given a message in its live session; no wait moves for it."""

    worker: WorkerMention
    text: str
