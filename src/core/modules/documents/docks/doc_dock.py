from engine.chat.dock_declaration import DockDeclaration
from core.modules.documents.models.enums.text_dock_type import TextDockType


class DocDock(DockDeclaration):
    """The dock of TextDockType.DOC."""

    type = TextDockType.DOC
    icon = "docs"
    title = "{row_title}"
    most = 6
    reads = ["doc show"]
    word = "Document"
    person_required = True
