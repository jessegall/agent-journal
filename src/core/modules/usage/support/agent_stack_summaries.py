from collections.abc import Mapping, Sequence

from engine.agent_step.stack_codec import StackCodec
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.models.enums.escalation_state import EscalationState
from core.modules.usage.support.stack_summary import StackSummary

PAGE_STACKS_REASON = "one page of agent cards reads the stacks of its own agents"


class AgentStackSummaries:
    """What the agent machine knows of the agents on one page of cards, read in two batched queries: the top
    frame of each stack, its refusal counts and its open escalation; an agent with no stack yet has no
    summary."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def summaries(self, agent_ids: Sequence[int]) -> Mapping[int, StackSummary]:
        stacks = self.queries.query(AgentStack).matching(Among("session_agent_id", agent_ids)).every_row(PAGE_STACKS_REASON)
        escalations = {row.session_agent_id: row.id for row in self.queries.query(AgentEscalation).filter(state=EscalationState.OPEN)
                       .matching(Among("session_agent_id", agent_ids)).every_row(PAGE_STACKS_REASON)}
        return {stack.session_agent_id: self.summary(stack, escalations.get(stack.session_agent_id)) for stack in stacks if stack.has_frames}

    @staticmethod
    def summary(stack: AgentStack, escalation_id: int | None) -> StackSummary:
        top = StackCodec.decoded(stack.frames)[-1]
        return StackSummary(f"{type(top.state).__name__} {top.need_key.generation}", stack.stop_refusals, stack.tool_refusals, escalation_id)
