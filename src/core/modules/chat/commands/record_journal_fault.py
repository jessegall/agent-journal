from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.chat.models.journal_fault import JournalFault


@dataclass(frozen=True)
class RecordJournalFault(Command[JournalFault]):
    """Records a fault the journal met, so the chat can show it."""

    environment_id: int | None
    source: str
    message: str
