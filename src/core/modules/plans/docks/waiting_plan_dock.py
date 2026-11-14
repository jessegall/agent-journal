from core.modules.plans.docks.plan_dock import PlanDock
from core.modules.plans.models.enums.plan_dock_type import PlanDockType


class WaitingPlanDock(PlanDock):
    """A plan that waits on the user."""

    type = PlanDockType.WAITING
    needs_user = True
