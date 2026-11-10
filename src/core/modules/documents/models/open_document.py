from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class OpenDocument(Model):
    """A document being edited by one author until it is closed."""

    model_name = "open_document"
    cli_name = "open-document"

    doc_id: int
    author_id: int
    revision_id: int | None = None
