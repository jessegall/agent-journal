from core.modules.documents.listeners.new_text_dock_listener import NewTextDockListener
from core.modules.documents.models.enums.text_dock_type import TextDockType
from core.modules.documents.models.report import Report


class NewReportDockListener(NewTextDockListener):
    """Docks a new report."""

    name = "documents.new-report-dock"
    event = "report.create"
    row_model = Report
    dock_type = TextDockType.REPORT
