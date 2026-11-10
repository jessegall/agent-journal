from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.messages.models.message import Message
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.queries.message_query import MessageQuery
from core.base.change.created import Created
from engine.command.context import Context


class OneReplyPerMessageGuard(Guard[Created[Message]]):
    """A message an agent has answered gets a second agent reply only when the sender confirms it."""

    name = "messages.one-reply-per-message"
    short_flag = "confirm"

    def __init__(self, messages: MessageQuery) -> None:
        self.messages = messages

    def check(self, event: Created[Message], context: Context) -> None:
        message = event.row
        if message.type is not MessageType.AGENT or message.parent_id is None:
            return
        answered = self.messages.replies(message.parent_id).agent_messages().first()
        if answered is not None:
            raise Refusal(f"message {message.parent_id} already has your reply {answered.id}", "send it again only if it adds something new")
