from engine.change.changed import Changed
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_waits import PlanWaits

ENDED_STATES = (PlanState.COMPLETED, PlanState.CANCELLED)


class PlanWaitListener(SaveListener[Changed[Plan]]):
    """A plan that is completed or cancelled ends the waits on it and may open the plans that waited; a plan
    no longer blocked has its own waits ended."""

    name = "plans.plan-waits"
    disabled_scopes = [ActorScope]

    def __init__(self, waits: PlanWaits) -> None:
        self.waits = waits

    def handle(self, event: Changed[Plan], context: Context) -> None:
        plan, old_row = event.row, event.old_row
        if old_row is None:
            return
        if plan.state in ENDED_STATES and old_row.state not in ENDED_STATES:
            self.waits.ended(plan, context)
        if old_row.state is PlanState.BLOCKED and plan.state is not PlanState.BLOCKED:
            self.waits.end_open_waits(plan, context)
