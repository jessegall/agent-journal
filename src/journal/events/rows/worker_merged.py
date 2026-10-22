from dataclasses import dataclass
from journal.events.rows.worker_mention import WorkerMention

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class WorkerMerged(RowEvent):
    """A worker's checked work was merged, which closes its task."""

    worker: WorkerMention
