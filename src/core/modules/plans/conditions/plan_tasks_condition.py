from dataclasses import dataclass

from core.modules.plans.conditions.shared_plan_tasks import plan_task_ids
from engine.database.statement import Statement


@dataclass(frozen=True)
class PlanTasksCondition:
    """Matches the tasks of the given plans."""

    plan_ids: tuple[int, ...]

    def statement(self) -> Statement:
        return plan_task_ids(self.plan_ids).statement()
