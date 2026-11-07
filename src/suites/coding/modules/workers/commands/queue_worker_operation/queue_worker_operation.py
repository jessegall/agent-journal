from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worker_operation import WorkerOperation

WorkerCommand = Command[object]


@dataclass(frozen=True)
class QueueWorkerOperation(Command[WorkerOperation]):
    worker_id: int
    line: str
    command: WorkerCommand
    plugin_script: str = ""
