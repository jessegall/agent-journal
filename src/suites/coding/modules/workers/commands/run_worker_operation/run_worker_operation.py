from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worker_operation import WorkerOperation


@dataclass(frozen=True)
class RunWorkerOperation(Command[str]):
    lock = False

    operation: WorkerOperation
