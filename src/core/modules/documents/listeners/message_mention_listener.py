from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.messages.models.message import Message
from engine.change.created import Created
from engine.change.updated import Updated


class MessageMentionListener(TextMentionListener[Created[Message] | Updated[Message]]):
    """Links a saved message to the rows it names."""

    text_fields = tuple(["text"])
    name = "documents.message-mentions"
