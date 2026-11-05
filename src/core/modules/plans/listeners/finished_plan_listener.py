from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.plans.commands.cancel_plan.cancel_plan import CancelPlan
from core.modules.plans.commands.close_plan.close_plan import ClosePlan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.models.plan_task import PlanTask
from core.base.change.touched import Touched
from core.modules.tasks.models.task import Task

ENDED_TASK_EVENTS = ("task.close", "task.cancel")
UNFINISHED_STATES = (PlanState.APPROVED, PlanState.STARTED, PlanState.BLOCKED)
CANCEL_REASON = "every task of the plan was cancelled"


class FinishedPlanListener(CommitListener[Touched[Task]]):
    """When the last open task of an approved, started or blocked plan ends, the plan closes as completed, or is
    cancelled if every task was."""

    name = "plans.finished-plan"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: Touched[Task], logged: LoggedEvent) -> None:
        if logged.event not in ENDED_TASK_EVENTS:
            return
        places = self.queries.query(PlanTask).filter(task_id=logged.row_id).page(1, 1).rows
        plan = self.queries.query(Plan).find(places[0].plan_id) if places else None
        if plan is None or plan.state not in UNFINISHED_STATES:
            return
        progress = self.queries.query(PlanProgress).find(plan.id)
        if not progress.task_count:
            self.bus.run(CancelPlan(plan.id, CANCEL_REASON), Actor.core(), cause_id=logged.id, environment_id=plan.environment_id)
        elif progress.completed_count == progress.task_count:
            self.bus.run(ClosePlan(plan.id), Actor.core(), cause_id=logged.id, environment_id=plan.environment_id)
