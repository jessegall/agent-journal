from dataclasses import dataclass

from journal.models.phase_tasks import PhaseTasks
from journal.models.plan import Plan
from journal.models.task import Task


@dataclass(frozen=True)
class PlanTree:
    """A plan with its tasks and its phases read once, so every question about the plan is answered from one reading."""

    plan: Plan
    tasks: tuple[Task, ...]
    phased: tuple[PhaseTasks, ...]

    @property
    def ordered(self) -> list[Task]:
        return self.plan.ordered(list(self.phased), list(self.tasks))
