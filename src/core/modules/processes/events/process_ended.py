from dataclasses import dataclass

from core.base.change.moved import Moved
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class ProcessEnded(Moved[Process]):
    """A run came to an end, however it ended."""

    moves = (ProcessLifecycle.finish, ProcessLifecycle.fail, ProcessLifecycle.stop, ProcessLifecycle.orphan)
