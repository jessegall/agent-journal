from core.modules.messages.support.message_agent_messages import UNANSWERED_COUNTDOWN

from engine.agent_stack.states.blocked import Blocked
from engine.agent_machine.states.block_plan import BlockPlan
from engine.enums.closer_role import CloserRole
from core.modules.messages.agent_messages.unanswered_refusal_message import UnansweredRefusalMessage
from core.modules.messages.support.block_conditions.messages_answered import MessagesAnswered
from core.modules.messages.support.message_agent_messages import UNANSWERED_TOOL_USES
from core.modules.messages.support.unanswered_messages import UnansweredMessages
from engine.agent_machine.states.agent_plan_states import AgentPlanStates

UNANSWERED_RANK = "messages.unanswered"
UNANSWERED_KEY = "messages.unanswered"
ANSWER_COMMANDS = ("journal message", "journal task make")
REPLYING_AGENT_TYPES = ("main", "helper")


class UnansweredMessageStates(AgentPlanStates):
    """Plans the block of messages a main agent or a read-only helper read and has not answered: its tools after
    ten uses; a journal message line and a task it is asked for always pass, since they are the answer."""
    state_type = Blocked
    rank = UNANSWERED_RANK
    agent_types = REPLYING_AGENT_TYPES

    def __init__(self, unanswered: UnansweredMessages) -> None:
        self.unanswered = unanswered

    def plan(self, agent_id: int) -> BlockPlan | None:
        unanswered = self.unanswered.unanswered(agent_id)
        if not unanswered:
            return None
        numbers = ", ".join(str(message.id) for message in unanswered)
        refusal = UnansweredRefusalMessage.declared().agent_message(messages=numbers, message=unanswered[0].id)
        return BlockPlan(refusal, MessagesAnswered([message.id for message in unanswered]), UNANSWERED_KEY, UNANSWERED_RANK,
                         members=tuple(message.id for message in unanswered), tool_grace_uses=UNANSWERED_TOOL_USES,
                         closer_roles=(CloserRole.AGENT,), lifting_lines=ANSWER_COMMANDS, countdown=UNANSWERED_COUNTDOWN.agent_message("{left}", messages=numbers))
