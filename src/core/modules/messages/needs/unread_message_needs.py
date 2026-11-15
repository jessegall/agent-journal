from core.modules.messages.support.message_nudges import UNREAD_COUNTDOWN
from collections.abc import Mapping, Sequence

from engine.agent_stack.states.blocked import Blocked
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.enums.closer_role import CloserRole
from core.modules.messages.nudges.unread_message_stop_nudge import UnreadMessageStopNudge
from core.modules.messages.nudges.unread_refusal_nudge import UnreadRefusalNudge
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.block_conditions.messages_read import MessagesRead
from core.modules.messages.support.message_nudges import UNREAD_TOOL_USES

UNREAD_RANK = "messages.unread"
TOOL_RULE, STOP_RULE = "messages.unread-write", "messages.unread-at-stop"
MESSAGE_COUNT_SHOWN = 3
READ_COMMANDS = ("journal message read", "journal message unread")


class UnreadMessageNeeds(NeedSource):
    """Plans the one block over an agent's unread messages, told of or not yet (doc 1310 section 4.6): its tools
    after twenty uses, its stop at once, naming the oldest; the two scopes keep their two keys and their
    two texts."""
    state_type = Blocked
    rank = UNREAD_RANK

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        plans = {agent.agent_id: self.plan(agent.agent_id) for agent in agents}
        return {agent_id: [plan] for agent_id, plan in plans.items() if plan is not None}

    def plan(self, agent_id: int) -> BlockPlan | None:
        unread = self.messages.unread(agent_id).oldest()
        shown = unread.take(MESSAGE_COUNT_SHOWN)
        if not shown:
            return None
        count = unread.count() if len(shown) == MESSAGE_COUNT_SHOWN else len(shown)
        refusal = UnreadRefusalNudge.declared().nudge(count=count, messages=", ".join(str(message.id) for message in shown))
        return BlockPlan(refusal, MessagesRead([message.id for message in shown]), TOOL_RULE, UNREAD_RANK, stop_check_key=STOP_RULE,
                         members=tuple(message.id for message in shown), tool_grace_uses=UNREAD_TOOL_USES, scope_stop=True,
                         closer_roles=tuple([CloserRole.AGENT]), lifting_lines=READ_COMMANDS,
                         stop_nudge=UnreadMessageStopNudge.declared().nudge(message=shown[0].id),
                         countdown=UNREAD_COUNTDOWN.nudge("{left}", messages=", ".join(str(message.id) for message in shown)))
