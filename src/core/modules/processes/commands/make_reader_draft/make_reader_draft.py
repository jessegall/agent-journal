from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.support.reader_draft import ReaderDraft


@dataclass(frozen=True)
class MakeReaderDraft(Command[ReaderDraft]):
    """Drafts a reader for a request and saves it when asked."""

    request_id: int
    save: bool = False
