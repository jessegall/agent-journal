from core.modules.messages.support.message_agent_messages import UNANSWERED_COUNTDOWN
from collections.abc import Mapping, Sequence

from engine.agent_stack.states.blocked import Blocked
from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.enums.closer_role import CloserRole
from core.modules.messages.agent_messages.unanswered_refusal_message import UnansweredRefusalMessage
from core.modules.messages.support.block_conditions.messages_answered import MessagesAnswered
from core.modules.messages.support.message_agent_messages import UNANSWERED_TOOL_USES
from core.modules.messages.support.unanswered_messages import UnansweredMessages

UNANSWERED_RANK = "messages.unanswered"
UNANSWERED_KEY = "messages.unanswered"
ANSWER_COMMANDS = ("journal message", "journal task make")
ANSWERING_TYPES = ("main", "helper")


class UnansweredMessageStates(StateSource):
    """Plans the block of messages a main agent or a read-only helper read and has not answered: its tools after
    ten uses; a journal message line and a task it is asked for always pass, since they are the answer."""
    state_type = Blocked
    rank = UNANSWERED_RANK
    agent_types = ANSWERING_TYPES

    def __init__(self, unanswered: UnansweredMessages) -> None:
        self.unanswered = unanswered

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        plans = {agent.agent_id: self.plan(agent.agent_id) for agent in agents}
        return {agent_id: [plan] for agent_id, plan in plans.items() if plan is not None}

    def plan(self, agent_id: int) -> BlockPlan | None:
        unanswered = self.unanswered.unanswered(agent_id)
        if not unanswered:
            return None
        numbers = ", ".join(str(message.id) for message in unanswered)
        refusal = UnansweredRefusalMessage.declared().agent_message(messages=numbers, message=unanswered[0].id)
        return BlockPlan(refusal, MessagesAnswered([message.id for message in unanswered]), UNANSWERED_KEY, UNANSWERED_RANK,
                         members=tuple(message.id for message in unanswered), tool_grace_uses=UNANSWERED_TOOL_USES,
                         closer_roles=tuple([CloserRole.AGENT]), lifting_lines=ANSWER_COMMANDS, countdown=UNANSWERED_COUNTDOWN.agent_message("{left}", messages=numbers))
