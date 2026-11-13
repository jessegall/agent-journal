from dataclasses import dataclass

from engine.command.command import Command
from core.modules.plugins.support.queued_run_start import QueuedRunStart
from core.modules.processes.models.enums.queue_priority import QueuePriority


@dataclass(frozen=True)
class QueuePluginRun(Command[QueuedRunStart]):
    """Queues a shell line of a plugin under a kind its manifest declares, in a folder or in an agent's checkout
    when none is named; a kind that coalesces joins a waiting run of the same line in the same folder. A
    detached run is not waited for."""

    plugin: str
    kind: str
    agent_id: int
    folder: str
    line: str
    timeout_durations: tuple[str, ...]
    priority: QueuePriority
    is_detached: bool
