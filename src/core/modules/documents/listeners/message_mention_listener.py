from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.messages.models.message import Message
from core.base.change.created import Created


class MessageMentionListener(TextMentionListener[Created[Message]]):
    """Links a saved message to the rows it names."""

    model = Message
    text_fields = tuple(["text"])
    name = "documents.message-mentions"
