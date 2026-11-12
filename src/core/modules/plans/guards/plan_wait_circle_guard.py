from engine.command.context import Context
from engine.event.created import Created
from engine.guard.guard import Guard
from core.modules.plans.models.plan_wait import PlanWait
from core.modules.plans.support.wait_circle import PLAN, WaitCircle, WaitNode

class PlanWaitCircleGuard(Guard[Created[PlanWait]]):
    """Refuses a plan's wait on another plan that comes back, through tasks and plans, to the plan itself."""

    name = "plans.plan-wait-circle"
    is_safety = True

    def __init__(self, circle: WaitCircle) -> None:
        self.circle = circle

    def check(self, event: Created[PlanWait], context: Context) -> None:
        wait = event.row
        self.circle.refuse_circle(WaitNode(PLAN, wait.plan_id), WaitNode(PLAN, wait.blocker_id))
