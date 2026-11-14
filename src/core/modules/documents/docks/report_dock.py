from engine.chat.dock_declaration import DockDeclaration
from core.modules.documents.models.enums.text_dock_type import TextDockType


class ReportDock(DockDeclaration):
    """The dock of TextDockType.REPORT."""

    type = TextDockType.REPORT
    icon = "reports"
    title = "{row_title}"
    most = 6
    reads = ["report show"]
    word = "Report"
