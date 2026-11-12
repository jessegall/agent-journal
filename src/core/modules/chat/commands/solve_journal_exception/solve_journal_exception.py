from dataclasses import dataclass

from engine.command.command import Command
from core.modules.chat.models.journal_exception import JournalException


@dataclass(frozen=True)
class SolveJournalException(Command[JournalException]):
    """Marks a recorded exception solved: it leaves the list of errors."""

    row_id: int
