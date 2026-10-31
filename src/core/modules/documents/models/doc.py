from dataclasses import dataclass

from core.modules.documents.models.text_row import TextRow


@dataclass(frozen=True, kw_only=True)
class Doc(TextRow):
    """A document: what the project keeps knowing."""

    model_name = "doc"
    cli_name = "doc"
