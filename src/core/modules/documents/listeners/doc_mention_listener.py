from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.documents.models.doc import Doc
from engine.change.changed import Changed


class DocMentionListener(TextMentionListener[Changed[Doc]]):
    """Links a saved document to the rows it names."""

    name = "documents.doc-mentions"
