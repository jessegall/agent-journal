from dataclasses import dataclass

from journal.events.rows.worker_dispatched import WorkerDispatched


@dataclass(frozen=True, kw_only=True)
class WorkerReused(WorkerDispatched):
    """A worker that reported was given its next job, in its last session with its memory of the last."""
