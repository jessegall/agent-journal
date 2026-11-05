from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.modules.messages.models.message import Message
from core.modules.messages.support.unread_messages import UnreadMessages


class UnreadMessagesListener(SaveListener[Changed[Message]]):
    name = "messages.unread-rows"

    def __init__(self, messages: UnreadMessages) -> None:
        self.messages = messages

    def handle(self, event: Changed[Message], context: Context) -> None:
        if isinstance(event, Deleted):
            self.messages.remove(event.row)
            return
        self.messages.remember(event.row)
