from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worker_route import WorkerRoute


@dataclass(frozen=True)
class MoveWorkerRoute(Command[WorkerRoute]):
    route_id: int
    position: int
