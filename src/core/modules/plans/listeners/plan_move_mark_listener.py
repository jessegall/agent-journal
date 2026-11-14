from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from engine.event.created import Created
from engine.event.moved import Moved
from engine.event.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.plans.models.enums.plan_mark_type import PlanMarkType
from core.modules.plans.models.enums.plan_mark_variant import PlanMarkVariant
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_marks import PLANS_MODULE

VARIANT_LABELS = {PlanMarkVariant.MADE: "created"}
MOVE_VARIANTS = {"create": PlanMarkVariant.MADE, "start": PlanMarkVariant.STARTED, "close": PlanMarkVariant.CLOSED, "block": PlanMarkVariant.BLOCKED, "cancel": PlanMarkVariant.CANCELLED}


class PlanMoveMarkListener(MarkListener[Created[Plan] | Moved[Plan]]):
    """When a plan is made, started, closed, blocked or cancelled, the chat shows a mark naming the plan
    and the move."""

    name = "plans.move-mark"
    moves = (PlanLifecycle.start, PlanLifecycle.close, PlanLifecycle.block, PlanLifecycle.cancel)
    module_name = PLANS_MODULE

    def handle(self, event: Created[Plan] | Moved[Plan], logged: LoggedEvent) -> None:
        variant = MOVE_VARIANTS.get(event.move.name if event.move else "create")
        if variant is not None:
            plan = event.row
            self.show(logged, PlanMarkType.PLAN, variant, f"Plan {plan.id} {VARIANT_LABELS.get(variant, variant.value)}: {plan.title}", None, "plan", plan.id)
