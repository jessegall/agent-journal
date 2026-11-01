from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.documents.support.row_ref import RowRef


@dataclass(frozen=True)
class RecordMentions(Command[int]):
    """Links a row to every existing row its text names in words, once each."""

    source: RowRef
    text: str
