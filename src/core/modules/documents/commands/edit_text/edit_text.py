from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.models.text_row import TextRow
from core.modules.documents.support.text_change import TextChange


@dataclass(frozen=True)
class EditText(Command[TextRow]):
    """Changes a document's or report's text, in whole or in part, and its abstract when one is given."""

    text_model: type[TextRow]
    row_id: int
    abstract: str | None
    change: TextChange
