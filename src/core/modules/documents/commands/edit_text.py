from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report


@dataclass(frozen=True)
class EditText(Command[Doc | Report]):
    """Writes a document's or report's text anew, and its abstract when one is given."""

    text_model: type[Doc] | type[Report]
    row_id: int
    abstract: str | None
    body: str | None
