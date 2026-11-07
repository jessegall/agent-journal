from core.base.viewer.button_condition import ButtonCondition
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.inspector_component import InspectorComponent
from core.base.viewer.inspector_declaration import InspectorDeclaration
from core.base.viewer.inspector_links import InspectorLinks
from core.base.viewer.inspector_width import InspectorWidth
from core.base.viewer.text_field import TextField
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report

NOT_SETTLED = ButtonCondition("close_reason", ("",))


def text_inspector(model: type[Doc] | type[Report], noun: str, closing_line: str, label: str) -> InspectorDeclaration:
    """The inspector of a document or a report: wide, with one action to mark it as needing no action and its text, comments and revisions as one body."""
    return InspectorDeclaration(
        model,
        reads=f"{noun} inspect {{row_id}}",
        label=f"{label} {{id}}",
        title="{title}",
        description="{abstract}",
        width=InspectorWidth.WIDE,
        events=(f"{noun}.*",),
        actions=(ButtonDeclaration(f"documents.{noun}-settle", (), f"Mark the {noun_word(noun)} as needing no action", f"{closing_line} {{row_id}} --why={{why}}", icon="tick", condition=NOT_SETTLED,
                                   fields=(TextField("why", "Why does it need no action?"),)),),
        components=(InspectorComponent("documents.document-body"),),
        links=InspectorLinks(),
    )


def noun_word(noun: str) -> str:
    return "document" if noun == "doc" else noun


DOC_INSPECTOR = text_inspector(Doc, "doc", "doc settle", "Document")
REPORT_INSPECTOR = text_inspector(Report, "report", "report close", "Report")
