from dataclasses import dataclass
from journal.events.rows.worker_mention import WorkerMention

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class WorkerRetired(RowEvent):
    """A worker's report was acted on and the worker let go."""

    worker: WorkerMention
