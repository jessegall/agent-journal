from engine.viewer.inspector_declaration import InspectorDeclaration
from core.modules.documents.models.report import Report
from core.modules.documents.support.text_inspectors import text_inspector


class ReportInspector(InspectorDeclaration):
    """The inspector of Report, built the way every text inspector is."""

    @classmethod
    def declared(cls) -> InspectorDeclaration:
        return text_inspector(Report, "report", "report close", "Report")
