from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.models.text_row import TextRow


@dataclass(frozen=True)
class EditText(Command[TextRow]):
    """Writes a document's or report's text anew, and its abstract when one is given."""

    text_model: type[TextRow]
    row_id: int
    abstract: str | None
    body: str | None
