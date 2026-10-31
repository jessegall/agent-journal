from collections.abc import Sequence
from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.commands.support.new_text import NewText
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report


@dataclass(frozen=True)
class MakeText(Command[NewText]):
    """Writes a new document or report with its title, abstract and text, and the rows a report is about."""

    text_model: type[Doc] | type[Report]
    title: str
    abstract: str
    body: str
    subjects: Sequence[str] = ()
