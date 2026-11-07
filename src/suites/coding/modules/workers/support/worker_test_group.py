from dataclasses import dataclass

from core.modules.plans.models.phase import Phase
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class WorkerTestGroup:
    """A phase or a batch whose tasks are tested together."""

    phase: Phase | None
    tasks: tuple[Task, ...]

    @property
    def key(self) -> str:
        return f"phase:{self.phase.id}" if self.phase is not None else f"batch:{self.tasks[0].id}"
