from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.messages.models.message import Message
from engine.event.created import Created
from engine.event.updated import Updated


class MessageMentionListener(TextMentionListener[Created[Message] | Updated[Message]]):
    """Links a saved message to the rows it names."""

    text_fields = tuple(["text"])
    name = "documents.message-mentions"
