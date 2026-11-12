from engine.chat.dock_declaration import DockDeclaration
from core.modules.documents.models.enums.text_dock_type import TextDockType

TEXT_DOCKS = [DockDeclaration(TextDockType.DOC, "docs", "{row_title}", most=6, reads=["doc show"], word="Document", needs_user=True),
              DockDeclaration(TextDockType.REPORT, "reports", "{row_title}", most=6, reads=["report show"], word="Report")]
