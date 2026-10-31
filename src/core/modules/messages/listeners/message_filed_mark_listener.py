from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.messages.listeners.message_thought_mark_listener import MESSAGES_MODULE
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message


class MessageFiledMarkListener(MarkListener):
    """When a message of the user is read, the chat shows that it was filed."""

    name = "messages.filed-mark"
    event = "message.update"
    module_name = MESSAGES_MODULE

    def handle(self, event: LoggedEvent) -> None:
        message = self.queries.query(Message).find(event.row_id)
        if "read_at" in event.data and message.type is MessageType.USER:
            self.show(event, MessageMarkType.FILED, MessageMarkVariant.FILED, f"Filed from your message {message.id}", message.environment_id, None, "message", message.id)
