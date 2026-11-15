from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.plans.nudges.plan_context_nudge import PlanContextNudge
from core.modules.plans.support.plan_context_delivery import PlanContextDelivery


class PlanContextLines(EventLineSource):
    """Before each tool use, a main agent that has not read a started plan's context is told to read it; its hold
    refuses what changes project files until it does."""

    key = "plans.start-context"
    events = [HookEventName.PRE_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, delivery: PlanContextDelivery) -> None:
        self.delivery = delivery

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        plan_id = self.delivery.unread_plan(agent_id)
        return [PlanContextNudge.declared().nudge(plan=plan_id)] if plan_id is not None else []
