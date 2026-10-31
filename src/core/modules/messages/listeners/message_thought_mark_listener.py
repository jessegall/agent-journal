from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message

MESSAGES_MODULE = "journal.core.messages"


class MessageThoughtMarkListener(MarkListener):
    """When an agent writes a message, the chat shows its words as a thought mark."""

    name = "messages.thought-mark"
    event = "message.create"
    module_name = MESSAGES_MODULE

    def handle(self, event: LoggedEvent) -> None:
        message = self.queries.query(Message).find(event.row_id)
        if message.type is MessageType.AGENT:
            self.show(event, MessageMarkType.THOUGHT, MessageMarkVariant.SUMMARY, message.text, message.environment_id, message.agent_id, "message", message.id)
