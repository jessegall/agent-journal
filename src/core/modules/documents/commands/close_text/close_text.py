from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.models.text_row import TextRow


@dataclass(frozen=True)
class CloseText(Command[TextRow]):
    """Closes a document or report with the reason it needs no action."""

    text_model: type[TextRow]
    row_id: int
    reason: str
