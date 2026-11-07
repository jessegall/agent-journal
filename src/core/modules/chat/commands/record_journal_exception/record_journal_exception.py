from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.chat.models.journal_exception import JournalException


@dataclass(frozen=True)
class RecordJournalException(Command[JournalException]):
    """Records an exception the journal met, so the chat can show it."""

    lock = False

    environment_id: int | None
    source: str
    message: str
