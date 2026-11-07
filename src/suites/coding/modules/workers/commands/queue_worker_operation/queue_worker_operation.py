from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.models.enums.worker_operation_name import WorkerOperationName

WorkerCommand = Command[object]


@dataclass(frozen=True)
class QueueWorkerOperation(Command[WorkerOperation]):
    worker_id: int
    line: str
    command: WorkerCommand
    name: WorkerOperationName
    plugin_script: str = ""
