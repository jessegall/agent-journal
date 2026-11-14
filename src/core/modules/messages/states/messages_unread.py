from collections.abc import Sequence

from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.enums.state_tier import StateTier
from engine.driver.open_row import OpenRow
from core.modules.messages.models.message import Message
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.rules.unread_message_write_rule import UnreadMessageWriteRule


class MessagesUnread(AgentState):
    """An agent was told of a message it has not read: the oldest such message opens the state, and the
    rule that counts its tool uses down to a hold is asked in its own place only then."""

    name = "messages.unread"
    tier = StateTier.IN_PLACE
    rules = [UnreadMessageWriteRule]

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        return [self.row(message) for message in self.messages.delivered_unread(hook.agent_id).take(1)]

    @staticmethod
    def row(message: Message) -> OpenRow:
        return OpenRow(Message.model_name, message.id, message.creation_timestamp())
