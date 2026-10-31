from dataclasses import dataclass

from core.modules.documents.models.text_row import TextRow


@dataclass(frozen=True, kw_only=True)
class Report(TextRow):
    """A report: what was checked or researched at one time."""

    model_name = "report"
    cli_name = "report"
