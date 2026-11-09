from core.base.database.kept_rows import KeptRows
from core.base.plan_authors import PlanAuthors
from core.base.query.queries import Queries
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask


class PlanRowAuthors(PlanAuthors):
    """Finds the plan a line changes, through the plan, phase or task it names, and whether the agent made it."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def is_author(self, agent_id: int, line: str, row_id: int) -> bool:
        plan_id = self.plan_id(line.split(" ", 1)[0], row_id)
        plan = self.plan(plan_id) if plan_id is not None else None
        return plan is not None and plan.creator_id == agent_id

    def plan(self, plan_id: int) -> Plan | None:
        return self.kept.scoped_read("plans", self.queries.query(Plan).filter(id=plan_id).first, "id = ?", [plan_id], name="plans.author_plan")

    def plan_id(self, row_type: str, row_id: int) -> int | None:
        match row_type:
            case "plan":
                return row_id
            case "phase":
                phase = self.queries.query(Phase).filter(id=row_id).first()
                return phase.plan_id if phase is not None else None
            case _:
                place = self.queries.query(PlanTask).filter(task_id=row_id).first()
                return place.plan_id if place is not None else None
