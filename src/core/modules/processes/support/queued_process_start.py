from dataclasses import dataclass

from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class QueuedProcessStart:
    process: Process
    line: str
    session: str
