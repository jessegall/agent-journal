from core.modules.plans.docks.draft_plan_dock import DraftPlanDock
from core.modules.plans.docks.started_plan_dock import StartedPlanDock
from core.modules.plans.docks.waiting_plan_dock import WaitingPlanDock
from core.modules.plans.docks.paused_plan_dock import PausedPlanDock
from core.modules.plans.docks.completed_plan_dock import CompletedPlanDock
from core.modules.plans.docks.cancelled_plan_dock import CancelledPlanDock

PLANS_DOCKS = [DraftPlanDock, StartedPlanDock, WaitingPlanDock, PausedPlanDock, CompletedPlanDock, CancelledPlanDock]
