from core.modules.documents.listeners.new_text_dock_listener import NewTextDockListener
from core.modules.documents.models.enums.text_dock_type import TextDockType
from core.modules.documents.models.report import Report
from core.base.change.created import Created


class NewReportDockListener(NewTextDockListener[Created[Report]]):
    """Docks a new report."""

    dock_type = TextDockType.REPORT
    name = "documents.new-report-dock"
