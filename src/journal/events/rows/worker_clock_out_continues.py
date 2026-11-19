from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent
from journal.events.rows.worker_mention import WorkerMention


@dataclass(frozen=True, kw_only=True)
class WorkerClockOutContinues(RowEvent):
    """A worker's clock-out outlasted the time its command may hold the worker and goes on in the journal by itself: the worker may end its turn, and the journal hands its work in once its tests pass or sends it back."""

    feature_name = "workers"

    worker: WorkerMention
