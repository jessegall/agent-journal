from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.choose_default_reader import ChooseDefaultReader
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery


class ChooseDefaultReaderHandler(Handler[ChooseDefaultReader, Reader]):
    """Sets the reader as the default of its commands and takes the default off every other reader of the same commands."""

    command = ChooseDefaultReader

    def __init__(self, readers: ReaderQuery, repository: Repository) -> None:
        self.readers, self.repository = readers, repository

    def handle(self, command: ChooseDefaultReader, context: Context) -> Reader:
        found = self.readers.named(command.name).page(1, 1).rows
        if not found:
            raise Refusal(f"there is no reader {command.name}", "journal reader list shows them")
        for other in tuple(self.readers.filter(commands=found[0].commands).defaults().all_rows()):
            if other.id != found[0].id:
                self.repository.save(replace(other, is_default=False), context)
        return self.repository.save(replace(found[0], is_default=True), context)
