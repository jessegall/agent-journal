from collections.abc import Sequence
from fnmatch import fnmatchcase

from core.base.driver.command_category import CommandCategory
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader


class ReaderSelection:
    """The reader of a process: among those whose commands match its line the default, else the newest, so a
    reader of the project comes before a shipped one; a journal command's own output is read by none. A
    reader's commands are patterns of a command line, separated by commas."""

    @staticmethod
    def choose(readers: Sequence[Reader], process: Process) -> Reader | None:
        if process.category is CommandCategory.JOURNAL:
            return None
        matching = sorted((reader for reader in readers if ReaderSelection.reads(reader, process.line)), key=lambda reader: (not reader.is_default, -reader.id))
        return matching[0] if matching else None

    @staticmethod
    def reads(reader: Reader, line: str) -> bool:
        return any(fnmatchcase(line, pattern.strip()) for pattern in reader.commands.split(","))
