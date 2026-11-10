from engine.enums.actor_type import ActorType
from core.base.change.moved import Moved
from core.base.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_order import PlanOrder


class UnorderedTasksGuard(Guard[Moved[Plan]]):
    """Refuses an agent that marks a plan ready while a task does not state what it waits on."""

    name = "plans.unordered-tasks"
    moves = tuple([PlanLifecycle.ready])
    is_safety = True

    def __init__(self, order: PlanOrder) -> None:
        self.order = order

    def check(self, event: Moved[Plan], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return
        unordered = self.order.refusal_text(event.row.id)
        if unordered is not None:
            raise Refusal(unordered, "state what each waits on, or say why it waits on nothing")
