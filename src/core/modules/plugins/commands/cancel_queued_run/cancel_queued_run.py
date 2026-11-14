from dataclasses import dataclass

from engine.command.command import Command
from core.modules.plugins.models.queued_run import QueuedRun


@dataclass(frozen=True)
class CancelQueuedRun(Command[QueuedRun]):
    """Stops a queued run, waiting or running, and records it cancelled."""

    run_id: int
