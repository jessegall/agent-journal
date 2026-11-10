from engine.change.changed import Changed
from engine.change.deleted import Deleted
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.modules.messages.models.message import Message
from core.modules.messages.support.unread_messages import UnreadMessages
from core.modules.messages.queries.message_query import MessageQuery


class MessageRowsListener(SaveListener[Changed[Message]]):
    name = "messages.saved-rows"

    def __init__(self, messages: UnreadMessages, query: MessageQuery) -> None:
        self.messages, self.query = messages, query

    def handle(self, event: Changed[Message], context: Context) -> None:
        if isinstance(event, Deleted):
            self.messages.remove(event.row)
            return
        self.messages.remember(event.row)
        self.query.remember(event.row)
