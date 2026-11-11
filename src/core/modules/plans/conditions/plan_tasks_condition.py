from dataclasses import dataclass

from core.modules.plans.conditions.shared_plan_tasks import PLAN_TASK_IDS
from engine.database.statement import Statement


@dataclass(frozen=True)
class PlanTasksCondition:
    """Matches the tasks of the given plans."""

    plan_ids: tuple[int, ...]

    def statement(self) -> Statement:
        return Statement(PLAN_TASK_IDS.format(plan_ids=", ".join("?" for _ in self.plan_ids)), list(self.plan_ids))
