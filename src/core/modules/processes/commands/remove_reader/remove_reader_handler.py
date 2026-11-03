from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.remove_reader.remove_reader import RemoveReader
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.reader_writers import ReaderWriters


class RemoveReaderHandler(Handler[RemoveReader, Reader]):
    """Deletes the reader; the guard says whose it may be."""

    command = RemoveReader

    def __init__(self, readers: ReaderQuery, repository: Repository, writers: ReaderWriters) -> None:
        self.readers, self.repository, self.writers = readers, repository, writers

    def handle(self, command: RemoveReader, context: Context) -> Reader:
        self.writers.check(context.actor)
        matching = self.readers.with_name(command.name).page(1, 1).rows
        if not matching:
            raise Refusal(f"there is no reader {command.name}", "journal reader list shows them")
        self.repository.delete(matching[0], context)
        return matching[0]
