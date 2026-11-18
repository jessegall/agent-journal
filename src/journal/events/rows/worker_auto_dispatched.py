from dataclasses import dataclass

from journal.events.rows.worker_dispatched import WorkerDispatched


@dataclass(frozen=True, kw_only=True)
class WorkerAutoDispatched(WorkerDispatched):
    """The journal sent a worker on the next task by itself, in the orchestrator's name; no session awaits it."""
