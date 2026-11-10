from core.base.listener.event_rows import EventRows
from engine.check.step_condition import StepCondition
from core.modules.plans.models.plan import Plan


class PlanBriefSet(StepCondition):
    """The plan says what is true when it is done."""

    name = "plans.brief-set"

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows

    def problem(self, subject_id: int) -> str | None:
        return None if self.rows.required(Plan, subject_id).brief else f"plan {subject_id} has no brief"
