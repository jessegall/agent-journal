from collections.abc import Mapping, Sequence

from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.row_reference import RowReference
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.required_state import RequiredState
from engine.agent_machine.needs.state_source import StateSource
from engine.agent_machine.record.question import Question
from core.modules.plans.nudges.plan_context_message import PlanContextMessage
from core.modules.plans.support.block_conditions.plan_context_read import PlanContextRead
from core.modules.plans.support.plan_context_delivery import PlanContextDelivery

PLAN_CONTEXT_RANK = "plans.context"
PLAN_CONTEXT_RULE = "plans.start-context"


class PlanContextNeeds(StateSource):
    """Plans the block of the oldest started plan whose start context a main agent has not read: its tools at once,
    reads and journal commands passing, until it reads journal plan context (doc 1310 section 4.6)."""
    state_type = Blocked
    rank = PLAN_CONTEXT_RANK
    agent_types = ["main"]

    def __init__(self, delivery: PlanContextDelivery) -> None:
        self.delivery = delivery

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        plans = {agent.agent_id: self.plan(agent.agent_id) for agent in agents if agent.agent_type == "main"}
        return {agent_id: [plan] for agent_id, plan in plans.items() if plan is not None}

    def plan(self, agent_id: int) -> BlockPlan | None:
        plan_id = self.delivery.unread_plan(agent_id)
        if plan_id is None:
            return None
        return BlockPlan(PlanContextMessage.declared().nudge(plan=plan_id), PlanContextRead(plan_id), PLAN_CONTEXT_RULE, PLAN_CONTEXT_RANK,
                         subject=RowReference("plan", plan_id), lifting_lines=tuple([f"journal plan context {plan_id}"]))
