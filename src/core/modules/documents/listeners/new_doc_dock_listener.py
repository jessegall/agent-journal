from core.modules.documents.listeners.new_text_dock_listener import NewTextDockListener
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.enums.text_dock_type import TextDockType
from engine.change.created import Created


class NewDocDockListener(NewTextDockListener[Created[Doc]]):
    """Docks a new document."""

    dock_type = TextDockType.DOC
    name = "documents.new-doc-dock"
