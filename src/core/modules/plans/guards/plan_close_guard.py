from core.base.guard.guard import Guard
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.plans.models.plan_progress import PlanProgress
from core.base.change.moved import Moved
from core.base.command.context import Context
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.plan import Plan


class PlanCloseGuard(Guard[Moved[Plan]]):
    """Refuses to close a plan while a task in it is neither completed nor cancelled."""

    name = "plans.tasks-done"
    moves = tuple([PlanLifecycle.close])

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Moved[Plan], context: Context) -> None:
        progress = self.queries.query(PlanProgress).find(event.row.id)
        if progress.completed_count < progress.task_count:
            raise Refusal(f"plan {event.row.id} has {progress.task_count - progress.completed_count} tasks still open",
                          f"see them with journal plan progress {event.row.id}, and close or cancel each first")
