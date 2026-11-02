from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.plans.commands.close_plan.close_plan import ClosePlan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.models.plan_task import PlanTask

ENDED_TASK_EVENTS = ("task.close", "task.cancel")
UNFINISHED_STATES = (PlanState.APPROVED, PlanState.STARTED, PlanState.BLOCKED)


class FinishedPlanListener(CommitListener):
    """When the last open task of an approved, started or blocked plan ends, the plan closes as completed."""

    name = "plans.finished-plan"
    event = "task.*"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: LoggedEvent) -> None:
        if event.event not in ENDED_TASK_EVENTS:
            return
        places = self.queries.query(PlanTask).filter(task_id=event.row_id).page(1, 1).rows
        plan = self.queries.query(Plan).find(places[0].plan_id) if places else None
        if plan is None or plan.state not in UNFINISHED_STATES:
            return
        progress = self.queries.query(PlanProgress).find(plan.id)
        if progress.task_count and progress.completed_count == progress.task_count:
            self.bus.run(ClosePlan(plan.id), Actor.core(), cause_id=event.id, environment_id=plan.environment_id)
