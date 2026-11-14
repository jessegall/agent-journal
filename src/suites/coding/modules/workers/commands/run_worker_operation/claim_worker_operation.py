from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.models.worker_operation import WorkerOperation


@dataclass(frozen=True)
class ClaimWorkerOperation(Command[WorkerOperation]):
    worker_id: int
    process_id: int
