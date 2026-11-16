from engine.viewer.inspector_component import InspectorComponent
from engine.viewer.inspector_declaration import InspectorDeclaration
from engine.enums.inspector_width import InspectorWidth
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report


def text_inspector(model: type[Doc] | type[Report], model_name: str, label: str) -> InspectorDeclaration:
    return InspectorDeclaration(
        model,
        reads=f"{model_name} inspect {{row_id}}",
        label=f"{label} {{id}}",
        title="{title}",
        description="{abstract}",
        width=InspectorWidth.WIDE,
        events=(f"{model_name}.*",),
        components=(InspectorComponent("documents.document-body"),),
        links=None,
        draws_text=True,
    )
