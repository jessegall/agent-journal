from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class WakeWaitingWorker(Command[None]):
    """Wakes a worker that waits with its whole unit committed, when a run of its commit passed."""

    worker_id: int
    phase_id: int
