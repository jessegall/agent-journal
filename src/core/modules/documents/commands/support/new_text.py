from dataclasses import dataclass

from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report


@dataclass(frozen=True)
class NewText:
    """A document or report just made, with the rows it is about."""

    text_row: Doc | Report
    subjects: tuple[str, ...]
