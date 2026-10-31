from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.choose_default_reader import ChooseDefaultReader
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery


class ChooseDefaultReaderHandler(Handler[ChooseDefaultReader, Reader]):
    """Sets the reader as the default of its commands and takes the default off the other readers of the same
    commands."""

    command = ChooseDefaultReader

    def __init__(self, readers: ReaderQuery, repository: Repository) -> None:
        self.readers, self.repository = readers, repository

    def handle(self, command: ChooseDefaultReader, context: Context) -> Reader:
        matching = self.readers.with_name(command.name).page(1, 1).rows
        if not matching:
            raise Refusal(f"there is no reader {command.name}", "journal reader list shows them")
        for previous_default in tuple(self.readers.filter(commands=matching[0].commands).defaults().all_rows()):
            if previous_default.id != matching[0].id:
                self.repository.save(replace(previous_default, is_default=False), context)
        return self.repository.save(replace(matching[0], is_default=True), context)
