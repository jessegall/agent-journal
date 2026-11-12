from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.query.queries import Queries
from core.modules.plans.commands.cancel_plan.cancel_plan import CancelPlan
from core.modules.plans.commands.close_plan.close_plan import ClosePlan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints

TASKS_DONE_GUARD = "plans.tasks-done"
UNFINISHED_STATES = (PlanState.APPROVED, PlanState.STARTED, PlanState.BLOCKED)
CANCEL_REASON = "every task of the plan was cancelled"


class FinishedPlans:
    """Ends an approved, started or blocked plan whose work is over: it closes as completed once every task of
    it has ended and the checkpoint at its end has passed, and is cancelled when every task of it was."""

    def __init__(self, bus: Bus, queries: Queries, checkpoints: PlanCheckpoints) -> None:
        self.bus, self.queries, self.checkpoints = bus, queries, checkpoints

    def end(self, plan: Plan, cause_id: int) -> None:
        if plan.state not in UNFINISHED_STATES:
            return
        progress = self.queries.query(PlanProgress).find(plan.id)
        if not progress.task_count:
            self.bus.run(CancelPlan(plan.id, CANCEL_REASON), Actor.core(), cause_id=cause_id)
        elif progress.completed_count == progress.task_count and self.checkpoints.is_end_passed(plan.id):
            self.bus.run(ClosePlan(plan.id), Actor.core(), frozenset([TASKS_DONE_GUARD]), cause_id=cause_id)
