from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.remove_reader import RemoveReader
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery


class RemoveReaderHandler(Handler[RemoveReader, Reader]):
    """Deletes the reader; the guard says whose it may be."""

    command = RemoveReader

    def __init__(self, readers: ReaderQuery, repository: Repository) -> None:
        self.readers, self.repository = readers, repository

    def handle(self, command: RemoveReader, context: Context) -> Reader:
        found = self.readers.named(command.name).page(1, 1).rows
        if not found:
            raise Refusal(f"there is no reader {command.name}", "journal reader list shows them")
        self.repository.delete(found[0], context)
        return found[0]
