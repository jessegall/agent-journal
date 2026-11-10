from core.base.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.modules.documents.support.row_refs import RowRefs
from core.modules.templates.models.template import Template
from core.modules.templates.support.template_row import TemplateRow


class TemplateTargets:
    """Resolves a template's target and checks its type and environment before any message is written."""

    def __init__(self, refs: RowRefs, rows: EventRows) -> None:
        self.refs, self.rows = refs, rows

    def row(self, text: str, template: Template, environment_id: int | None) -> TemplateRow:
        reference = self.refs.resolved(text)
        if template.targets and reference.model.cli_name not in template.targets:
            raise Refusal(f"template {template.id} does not apply to {reference.model.cli_name}")
        row = self.rows.required(reference.model, reference.row_id)
        row_environment = getattr(row, "environment_id", None)
        if row_environment is not None and row_environment != environment_id:
            raise Refusal(f"{row.cli_name} {row.id} belongs to another environment", "send the template there")
        return TemplateRow(row)
