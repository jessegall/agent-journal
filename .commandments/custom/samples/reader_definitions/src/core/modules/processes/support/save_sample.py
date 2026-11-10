from core.base.command.context import Context
from engine.repository.repository import Repository
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.enums.reader_type import ReaderType


def save_reader(repository: Repository, reader: Reader, context: Context) -> None:
    # @sin architecture_processes_reader_saved_outside_add_reader
    repository.save(Reader(creator_id=1, name="tests", type=ReaderType.PATTERN, commands="pytest*", lines_pattern="failed"), context)


def draft_reader(reader: Reader) -> Reader:
    # @righteous architecture_processes_reader_saved_outside_add_reader
    return Reader(creator_id=1, name="draft", type=ReaderType.PATTERN, commands="pytest*", lines_pattern="failed")
