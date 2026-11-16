from collections.abc import Mapping, Sequence

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.enums.closer_role import CloserRole
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.support.block_review_round import BLOCK_REVIEW_KEY, BlockReviewRound

BLOCK_REVIEW_RANK = "tasks.blocked-review"


class BlockReviewStates(StateSource):
    """The third reminder of tasks the main agent blocked by hand, none of them moved, holds its tools until it acts
    on them or skips the hold with a reason."""
    state_type = Blocked
    rank = BLOCK_REVIEW_RANK
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, review: BlockReviewRound) -> None:
        self.review = review

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        event = question.event
        if event is None or event.event is not HookEventName.POST_TOOL_USE:
            return {}
        holds = {agent.agent_id: self.review.answer(event, agent.agent_id).hold for agent in agents}
        return {agent_id: [BlockPlan(hold[0], hold[1], BLOCK_REVIEW_KEY, BLOCK_REVIEW_RANK, scope_tools=True, scope_stop=False, closer_roles=(CloserRole.AGENT,))]
                for agent_id, hold in holds.items() if hold is not None}
