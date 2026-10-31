from collections.abc import Sequence
from fnmatch import fnmatchcase

from core.base.driver.command_category import CommandCategory
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader


class ReaderSelection:
    """The reader of a process: among those whose commands match its line the default, else the oldest; a journal
    command's own output is read by none."""

    @staticmethod
    def of(readers: Sequence[Reader], process: Process) -> Reader | None:
        if process.category is CommandCategory.JOURNAL:
            return None
        matching = sorted((reader for reader in readers if fnmatchcase(process.line, reader.commands)), key=lambda reader: (not reader.is_default, reader.id))
        return matching[0] if matching else None
