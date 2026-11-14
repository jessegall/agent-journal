from core.modules.plans.docks.plan_dock import PlanDock
from core.modules.plans.models.enums.plan_dock_type import PlanDockType


class PausedPlanDock(PlanDock):
    """A paused plan."""

    type = PlanDockType.PAUSED
    badge = "Paused"
