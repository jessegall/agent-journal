from core.base.chat.dock_declaration import DockDeclaration
from core.modules.documents.models.enums.text_dock_type import TextDockType

TEXT_DOCKS = [DockDeclaration(TextDockType.DOC, "document", "{row_title}", "", most=6, reads=["doc show"], badge="Document"),
              DockDeclaration(TextDockType.REPORT, "document", "{row_title}", "", most=6, reads=["report show"], badge="Report")]
