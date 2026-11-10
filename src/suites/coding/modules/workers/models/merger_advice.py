from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep


@dataclass(frozen=True, kw_only=True)
class MergerAdvice(EnvironmentScoped, Model):
    """One piece of advice from the merger to a worker, counted against the worker's group."""

    model_name = "merger_advice"
    cli_name = "merger-advice"

    environment_id: int = 0
    worker_id: int
    group_key: str
    step: WorkerStep
    task_id: int
    visit_id: int | None = None
    text: str

    def is_at(self, step: WorkerStep, task_id: int) -> bool:
        return self.step is step and self.task_id == task_id
