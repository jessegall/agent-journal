from dataclasses import dataclass

from engine.database.statement import Statement
from core.modules.plans.conditions.plan_tasks_condition import PlanTasksCondition


@dataclass(frozen=True)
class PlanWindowTables:
    """The rows a plan's checkpoint windows are worked out from: its tasks, its phases and the places of its tasks."""

    plan_id: int

    def tables(self) -> tuple[tuple[str, Statement], ...]:
        return (("tasks", PlanTasksCondition(tuple([self.plan_id])).statement()), ("phases", Statement("plan_id = ?", [self.plan_id])),
                ("phase_tasks", Statement("phase_id IN (SELECT id FROM phases WHERE plan_id = ?)", [self.plan_id])))
