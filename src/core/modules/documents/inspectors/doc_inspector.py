from engine.viewer.inspector_declaration import InspectorDeclaration
from core.modules.documents.models.doc import Doc
from core.modules.documents.support.text_inspectors import text_inspector


class DocInspector(InspectorDeclaration):
    """The inspector of Doc, built the way every text inspector is."""

    @classmethod
    def declared(cls) -> InspectorDeclaration:
        return text_inspector(Doc, "doc", "Document")
