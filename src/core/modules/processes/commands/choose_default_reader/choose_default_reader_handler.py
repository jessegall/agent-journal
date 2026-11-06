from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.choose_default_reader.choose_default_reader import ChooseDefaultReader
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.reader_writers import ReaderWriters


class ChooseDefaultReaderHandler(Handler[ChooseDefaultReader, Reader]):
    """Sets the reader as the default of its commands and takes the default off the other readers of the same
    commands."""

    command = ChooseDefaultReader

    def __init__(self, readers: ReaderQuery, repository: Repository, writers: ReaderWriters) -> None:
        self.readers, self.repository, self.writers = readers, repository, writers

    def handle(self, command: ChooseDefaultReader, context: Context) -> Reader:
        self.writers.check(context.actor)
        reader = self.readers.with_name(command.name).first()
        if reader is None:
            raise Refusal(f"there is no reader {command.name}", "journal reader list shows them")
        for previous_default in tuple(self.readers.filter(commands=reader.commands).defaults().all_rows()):
            if previous_default.id != reader.id:
                self.repository.save(replace(previous_default, is_default=False), context)
        return self.repository.save(replace(reader, is_default=True), context)
