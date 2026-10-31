from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report


@dataclass(frozen=True)
class CloseText(Command[Doc | Report]):
    """Closes a document or report with the reason it needs no action."""

    text_model: type[Doc] | type[Report]
    row_id: int
    reason: str
