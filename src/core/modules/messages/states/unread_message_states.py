from core.modules.messages.support.message_agent_messages import UNREAD_COUNTDOWN

from engine.agent_stack.states.blocked import Blocked
from engine.agent_machine.states.block_plan import BlockPlan
from engine.enums.closer_role import CloserRole
from core.modules.messages.agent_messages.unread_message_stop_notice import UnreadMessageStopNotice
from core.modules.messages.agent_messages.unread_refusal_message import UnreadRefusalMessage
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.block_conditions.messages_read import MessagesRead
from core.modules.messages.support.message_agent_messages import UNREAD_TOOL_USES
from engine.agent_machine.contracts.agent_plan_states import AgentPlanStates

UNREAD_RANK = "messages.unread"
TOOL_KEY, STOP_KEY = "messages.unread-write", "messages.unread-at-stop"
MESSAGE_COUNT_SHOWN = 3
READ_COMMANDS = ("journal message read", "journal message unread")


class UnreadMessageStates(AgentPlanStates):
    """Plans the one block over an agent's unread messages, told of or not yet (doc 1310 section 4.6): its tools
    after twenty uses, its stop at once, naming the oldest; the two scopes keep their two keys and their
    two texts."""
    state_type = Blocked
    rank = UNREAD_RANK

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def plan(self, agent_id: int) -> BlockPlan | None:
        unread = self.messages.unread(agent_id).oldest()
        shown = unread.take(MESSAGE_COUNT_SHOWN)
        if not shown:
            return None
        count = unread.count() if len(shown) == MESSAGE_COUNT_SHOWN else len(shown)
        refusal = UnreadRefusalMessage.declared().agent_message(count=count, messages=", ".join(str(message.id) for message in shown))
        return BlockPlan(refusal, MessagesRead([message.id for message in shown]), TOOL_KEY, UNREAD_RANK, stop_check_key=STOP_KEY,
                         members=tuple(message.id for message in shown), tool_grace_uses=UNREAD_TOOL_USES, scope_stop=True,
                         closer_roles=(CloserRole.AGENT,), lifting_lines=READ_COMMANDS,
                         stop_agent_message=UnreadMessageStopNotice.declared().agent_message(message=shown[0].id),
                         countdown=UNREAD_COUNTDOWN.agent_message("{left}", messages=", ".join(str(message.id) for message in shown)))
