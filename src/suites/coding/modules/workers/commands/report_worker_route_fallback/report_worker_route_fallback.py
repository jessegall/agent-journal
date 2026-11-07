from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.support.worker_route_fallback import WorkerRouteFallback


@dataclass(frozen=True)
class ReportWorkerRouteFallback(Command[None]):
    worker_id: int
    task_ids: tuple[int, ...]
    fallback: WorkerRouteFallback

    @property
    def task_text(self) -> str:
        return ", ".join(f"task {task_id}" for task_id in self.task_ids)
