from core.modules.documents.listeners.text_mention_listener import TextMentionListener
from core.modules.documents.models.doc import Doc
from core.base.change.touched import Touched


class DocMentionListener(TextMentionListener[Touched[Doc]]):
    """Links a saved document to the rows it names."""

    name = "documents.doc-mentions"
