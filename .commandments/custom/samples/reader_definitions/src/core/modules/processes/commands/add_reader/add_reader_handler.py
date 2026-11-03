from core.base.command.context import Context
from core.base.repository.repository import Repository
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.enums.reader_type import ReaderType


def save_reader(repository: Repository, reader: Reader, context: Context) -> None:
    # @righteous architecture_processes_ReaderSavedThroughAddReaderDetector
    repository.save(Reader(creator_id=1, name="tests", type=ReaderType.PATTERN, commands="pytest*", lines_pattern="failed"), context)
