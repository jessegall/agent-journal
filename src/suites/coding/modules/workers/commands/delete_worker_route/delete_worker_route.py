from dataclasses import dataclass

from core.base.command.delete_command import DeleteCommand
from suites.coding.modules.workers.models.worker_route import WorkerRoute


@dataclass(frozen=True)
class DeleteWorkerRoute(DeleteCommand):
    deleted_model = WorkerRoute
