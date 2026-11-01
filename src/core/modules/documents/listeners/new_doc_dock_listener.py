from core.modules.documents.listeners.new_text_dock_listener import NewTextDockListener
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.enums.text_dock_type import TextDockType


class NewDocDockListener(NewTextDockListener):
    """Docks a new document."""

    name = "documents.new-doc-dock"
    event = "doc.create"
    row_model = Doc
    dock_type = TextDockType.DOC
