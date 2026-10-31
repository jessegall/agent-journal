from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.plans.plan_progress import PlanProgress


class PlanCloseGuard(Guard):
    """Refuses to close a plan while a task in it is neither completed nor cancelled."""

    name = "plans.tasks-done"
    event = "plan.close"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        progress = self.queries.query(PlanProgress).find(change.row.id)
        if progress.completed_count < progress.task_count:
            raise Refusal(f"plan {change.row.id} has {progress.task_count - progress.completed_count} tasks still open",
                          f"see them with journal plan progress {change.row.id}, and close or cancel each first")
