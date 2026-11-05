from collections.abc import Sequence
from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.commands.support.new_text import NewText
from core.modules.documents.models.text_row import TextRow


@dataclass(frozen=True)
class MakeText(Command[NewText]):
    """Writes a new document or report with its title, abstract and text, and the rows a report is about."""

    text_model: type[TextRow]
    title: str
    abstract: str
    body: str
    subjects: Sequence[str] = ()
