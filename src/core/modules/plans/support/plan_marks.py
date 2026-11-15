from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.plans.models.enums.plan_dock_type import PlanDockType

PLANS_MODULE = "journal.core.plans"
PLANS_FAMILY = MarkFamily("plans.plans", "Plans", "plan", MarkGroup.WORK)


PLAN_DOCK_READS = ["plan inspect", "plan show"]
PLAN_BADGES = {PlanDockType.DRAFT: "Planned", PlanDockType.STARTED: "Started", PlanDockType.PAUSED: "Paused", PlanDockType.COMPLETED: "Done", PlanDockType.CANCELLED: "Cancelled"}
