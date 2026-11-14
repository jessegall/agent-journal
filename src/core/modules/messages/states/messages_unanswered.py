from collections.abc import Sequence

from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.driver.open_row import OpenRow
from engine.enums.state_tier import StateTier
from core.modules.messages.rules.unanswered_message_rule import UnansweredMessageRule
from core.modules.messages.states.messages_unread import MessagesUnread
from core.modules.messages.support.session_read_messages import SessionReadMessages


class MessagesUnanswered(AgentState):
    """An agent read a message in its current session: the rule that waits for the answer is asked in its own
    place only then, and with nothing read the agent has nothing to answer."""

    name = "messages.unanswered-due"
    tier = StateTier.IN_PLACE
    rules = [UnansweredMessageRule]

    def __init__(self, reads: SessionReadMessages) -> None:
        self.reads = reads

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        return [MessagesUnread.row(message) for message in self.reads.first_read(hook.agent_id)]
