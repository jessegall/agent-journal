from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.plans.models.enums.plan_mark_type import PlanMarkType
from core.modules.plans.models.enums.plan_mark_variant import PlanMarkVariant
from core.modules.plans.models.plan import Plan

PLANS_MODULE = "journal.core.plans"
MOVE_VARIANTS = {"create": PlanMarkVariant.MADE, "start": PlanMarkVariant.STARTED, "close": PlanMarkVariant.CLOSED, "block": PlanMarkVariant.BLOCKED, "cancel": PlanMarkVariant.CANCELLED}


class PlanMoveMarkListener(MarkListener):
    """When a plan is made, started, closed, blocked or cancelled, the chat shows a mark naming the plan and the move."""

    name = "plans.move-mark"
    event = "plan.*"
    module_name = PLANS_MODULE

    def handle(self, event: LoggedEvent) -> None:
        variant = MOVE_VARIANTS.get(event.event.split(".")[1])
        if variant is not None:
            plan = self.queries.query(Plan).find(event.row_id)
            self.show(event, PlanMarkType.PLAN, variant, f"Plan {plan.id} {variant.value}", plan.environment_id, None, "plan", plan.id)
