from dataclasses import dataclass
from journal.events.rows.worker_mention import WorkerMention

from journal.events.rows.row_resolved import RowResolved


@dataclass(frozen=True, kw_only=True)
class WorkerUnfinished(RowResolved):
    """A worker's run ended without its clocking out: never clocked in, died, ran out of time or never started its session twice; its task stays assigned to it."""

    feature_name = "workers"

    worker: WorkerMention
    times: int = 1
    is_run_limit: bool = False
    is_stalled_start: bool = False
