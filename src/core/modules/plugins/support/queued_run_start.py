from dataclasses import dataclass

from core.modules.plugins.models.queued_run import QueuedRun
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class QueuedRunStart:
    """A run a plugin queued and its process; a run that joined a waiting one of the same line was started
    already; a detached run is not waited for."""

    run: QueuedRun
    process: Process
    is_joined: bool
    is_detached: bool
