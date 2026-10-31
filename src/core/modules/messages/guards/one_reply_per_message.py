from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.messages.message import Message, MessageType
from core.modules.messages.message_query import MessageQuery


class OneReplyPerMessage(Guard):
    """A message an agent has answered gets a second agent reply only when the sender confirms it."""

    name = "messages.one-reply-per-message"
    event = "message.create"
    short_flag = "confirm"

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def check(self, change: Change[Model]) -> None:
        message = change.row
        if not isinstance(message, Message) or message.type is not MessageType.AGENT or message.parent_id is None:
            return
        answered = self.messages.replies(message.parent_id).agent_messages().page(1, 1).rows
        if answered:
            raise Refusal(f"message {message.parent_id} already has your reply {answered[0].id}", "send it again only if it adds something new")
