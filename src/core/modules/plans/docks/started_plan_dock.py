from core.modules.plans.docks.plan_dock import PlanDock
from core.modules.plans.models.enums.plan_dock_type import PlanDockType


class StartedPlanDock(PlanDock):
    """A plan whose work goes on."""

    type = PlanDockType.STARTED
    badge = "Started"
