from collections.abc import Sequence
from fnmatch import fnmatchcase

from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.part_reader import PartReader


class ReaderSelection:
    """The reader of a run, judged part by part, a test run, a build or a check first and then the parts in
    order: among the readers whose commands match the part the default, else the newest, so a reader of the
    project comes before a shipped one; a journal command's own output, and that of a read or a search, is
    read by none. A reader's commands are patterns of a command, separated by commas."""

    @staticmethod
    def choose(readers: Sequence[Reader], parts: Sequence[ProcessPart]) -> PartReader | None:
        for part in sorted(parts, key=lambda part: (not part.category.is_watched, part.position)):
            matching = sorted((reader for reader in readers if ReaderSelection.reads(reader, part)), key=lambda reader: (not reader.is_default, -reader.id))
            if matching:
                return PartReader(matching[0], part)
        return None

    @staticmethod
    def reads(reader: Reader, part: ProcessPart) -> bool:
        return not part.category.is_readonly and any(fnmatchcase(part.command or part.text, pattern.strip()) for pattern in reader.commands.split(","))
