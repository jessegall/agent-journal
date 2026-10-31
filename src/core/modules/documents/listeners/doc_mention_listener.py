from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.documents.models.doc import Doc


class DocMentionListener(TextMentionListener):
    """Links a saved document to the rows it names."""

    name = "documents.doc-mentions"
    event = "doc.*"
    model = Doc
