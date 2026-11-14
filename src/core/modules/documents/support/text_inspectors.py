from engine.viewer.button_condition import ButtonCondition
from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.inspector_component import InspectorComponent
from engine.viewer.inspector_declaration import InspectorDeclaration
from engine.viewer.inspector_links import InspectorLinks
from engine.enums.inspector_width import InspectorWidth
from engine.viewer.text_field import TextField
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report

CLOSE_REASON_EMPTY = ButtonCondition("close_reason", tuple([""]))


def text_inspector(model: type[Doc] | type[Report], model_name: str, closing_line: str, label: str) -> InspectorDeclaration:
    return InspectorDeclaration(
        model,
        reads=f"{model_name} inspect {{row_id}}",
        label=f"{label} {{id}}",
        title="{title}",
        description="{abstract}",
        width=InspectorWidth.WIDE,
        events=tuple([f"{model_name}.*"]),
        actions=(ButtonDeclaration(f"documents.{model_name}-settle", (), f"Mark the {model_label(model_name)} as needing no action", f"{closing_line} {{row_id}} --why={{why}}", icon="tick", condition=CLOSE_REASON_EMPTY,
                                   fields=tuple([TextField("why", "Why does it need no action?")])),),
        components=tuple([InspectorComponent("documents.document-body")]),
        links=InspectorLinks(),
        draws_text=True,
    )


def model_label(model_name: str) -> str:
    return "document" if model_name == "doc" else model_name


DOC_INSPECTOR = text_inspector(Doc, "doc", "doc settle", "Document")
REPORT_INSPECTOR = text_inspector(Report, "report", "report close", "Report")
