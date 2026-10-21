from dataclasses import dataclass

from journal.events.rows.worker_dispatched import WorkerDispatched


@dataclass(frozen=True, kw_only=True)
class WorkerRevived(WorkerDispatched):
    """A worker that was stopped, or whose process ended without a report, was started again in its last session with a new job."""
