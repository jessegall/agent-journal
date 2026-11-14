from core.modules.plans.docks.plan_dock import PlanDock
from core.modules.plans.models.enums.plan_dock_type import PlanDockType


class CompletedPlanDock(PlanDock):
    """A finished plan."""

    type = PlanDockType.COMPLETED
    badge = "Done"
