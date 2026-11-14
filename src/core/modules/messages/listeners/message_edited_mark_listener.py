from engine.event.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant
from core.modules.messages.models.message import Message
from engine.event.updated import Updated

EDIT_COMMAND = f"Edit{Message.__name__}"


class MessageEditedMarkListener(MarkListener[Updated[Message]]):
    """When an agent edits a message, the chat shows a mark naming the message, with a click that opens it."""

    name = "messages.edited-mark"
    module_name = "journal.core.messages"

    def handle(self, event: Updated[Message], logged: LoggedEvent) -> None:
        if self.is_agent_command(logged, EDIT_COMMAND):
            message = event.row
            self.show(logged, MessageMarkType.EDITED, MessageMarkVariant.EDITED, f"Message {message.id} edited", None, "message", message.id)
