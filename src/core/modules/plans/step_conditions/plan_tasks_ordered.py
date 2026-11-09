from core.base.step_condition import StepCondition
from core.modules.plans.support.plan_order import PlanOrder


class PlanTasksOrdered(StepCondition):
    """Every task of the plan but the first states what it waits on."""

    name = "plans.tasks-ordered"

    def __init__(self, order: PlanOrder) -> None:
        self.order = order

    def problem(self, subject_id: int) -> str | None:
        return self.order.refusal_text(subject_id)
