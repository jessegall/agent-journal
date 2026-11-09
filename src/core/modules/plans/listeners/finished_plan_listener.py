from collections.abc import Sequence
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.base.change.moved import Moved
from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.plans.commands.cancel_plan.cancel_plan import CancelPlan
from core.modules.plans.commands.close_plan.close_plan import ClosePlan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.guards.plan_close_guard import PlanCloseGuard
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.support.task_plans import TaskPlans
from core.modules.tasks.models.task import Task

UNFINISHED_STATES = (PlanState.APPROVED, PlanState.STARTED, PlanState.BLOCKED)
CANCEL_REASON = "every task of the plan was cancelled"


class FinishedPlanListener(CommitListener[Moved[Task]]):
    """When the last open task of an approved, started or blocked plan ends, the plan closes as completed, or is
    cancelled if every task was."""

    name = "plans.finished-plan"
    moves = (TaskLifecycle.close, TaskLifecycle.cancel)

    def __init__(self, bus: Bus, queries: Queries, plans: TaskPlans) -> None:
        self.bus, self.queries = bus, queries
        self.plans = plans

    def prepare(self, events: Sequence[LoggedEvent]) -> None:
        self.plans.prepare([event.row_id for event in events])

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        plan = self.plans.find(event.row.id)
        if plan is None or plan.state not in UNFINISHED_STATES:
            return
        progress = self.queries.query(PlanProgress).find(plan.id)
        if not progress.task_count:
            self.bus.run(CancelPlan(plan.id, CANCEL_REASON), Actor.core(), cause_id=logged.id)
        elif progress.completed_count == progress.task_count:
            self.bus.run(ClosePlan(plan.id), Actor.core(), frozenset([PlanCloseGuard.name]), cause_id=logged.id)
