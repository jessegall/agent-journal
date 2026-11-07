from dataclasses import dataclass

from core.base.command.edit_command import EditCommand
from core.base.model_tier import ModelTier
from core.modules.tasks.models.support.task_complexity import TaskComplexity
from suites.coding.modules.workers.models.worker_route import WorkerRoute


@dataclass(frozen=True)
class EditWorkerRoute(EditCommand[WorkerRoute]):
    program: str | None = None
    tags: tuple[str, ...] | None = None
    minimum_complexity: TaskComplexity | None = None
    maximum_complexity: TaskComplexity | None = None
    tier: ModelTier | None = None
    strict: bool | None = None
