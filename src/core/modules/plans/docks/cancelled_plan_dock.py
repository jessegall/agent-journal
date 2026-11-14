from core.modules.plans.docks.plan_dock import PlanDock
from core.modules.plans.models.enums.plan_dock_type import PlanDockType


class CancelledPlanDock(PlanDock):
    """A cancelled plan."""

    type = PlanDockType.CANCELLED
    badge = "Cancelled"
