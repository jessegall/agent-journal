from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant
from core.modules.messages.models.message import Message

EDIT_COMMAND = f"Edit{Message.__name__}"


class MessageEditedMarkListener(MarkListener):
    """When an agent edits a message, the chat shows a mark naming the message, with a click that opens it."""

    name = "messages.edited-mark"
    event = "message.update"
    module_name = "journal.core.messages"

    def handle(self, event: LoggedEvent) -> None:
        if event.command == EDIT_COMMAND and self.by_agent(event):
            message = self.queries.query(Message).find(event.row_id)
            self.show(event, MessageMarkType.EDITED, MessageMarkVariant.EDITED, f"Message {message.id} edited", message.environment_id, None, "message", message.id)
