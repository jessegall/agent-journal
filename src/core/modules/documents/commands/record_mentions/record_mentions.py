from dataclasses import dataclass

from engine.command.command import Command
from core.modules.documents.references.row_ref import RowRef


@dataclass(frozen=True)
class RecordMentions(Command[int]):
    """Links a row to every existing row its text names in words, once each."""

    source: RowRef
    texts: tuple[str, ...]
