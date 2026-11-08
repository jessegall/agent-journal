from dataclasses import dataclass

from core.base.command.command import Command
from core.base.profile.model_tier import ModelTier
from core.modules.tasks.models.support.task_complexity import TaskComplexity
from suites.coding.modules.workers.models.worker_route import WorkerRoute


@dataclass(frozen=True)
class MakeWorkerRoute(Command[WorkerRoute]):
    program: str = ""
    tags: tuple[str, ...] = ()
    minimum_complexity: TaskComplexity | None = None
    maximum_complexity: TaskComplexity | None = None
    tier: ModelTier | None = None
    strict: bool = False
