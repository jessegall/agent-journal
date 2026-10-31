from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.plans.models.enums.plan_state import PlanState


class PlanLifecycle(Lifecycle):
    states = PlanState
    initial = [PlanState.DRAFT]
    editable = (PlanState.DRAFT, PlanState.READY, PlanState.APPROVED, PlanState.STARTED, PlanState.BLOCKED)
    deletable = (PlanState.DRAFT, PlanState.CANCELLED)

    ready = Move("ready", [PlanState.DRAFT], PlanState.READY)
    approve = Move("approve", [PlanState.READY], PlanState.APPROVED)
    start = Move("start", [PlanState.APPROVED], PlanState.STARTED)
    block = Move("block", [PlanState.STARTED], PlanState.BLOCKED)
    unblock = Move("unblock", [PlanState.BLOCKED], PlanState.STARTED)
    close = Move("close", [PlanState.STARTED], PlanState.COMPLETED)
    cancel = Move("cancel", (PlanState.DRAFT, PlanState.READY, PlanState.APPROVED, PlanState.STARTED, PlanState.BLOCKED),
                  PlanState.CANCELLED)
