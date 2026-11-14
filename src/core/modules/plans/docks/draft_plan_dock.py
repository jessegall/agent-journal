from core.modules.plans.docks.plan_dock import PlanDock
from core.modules.plans.models.enums.plan_dock_type import PlanDockType


class DraftPlanDock(PlanDock):
    """A plan not started yet."""

    type = PlanDockType.DRAFT
    badge = "Planned"
