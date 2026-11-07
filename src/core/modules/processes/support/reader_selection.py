import re
from collections.abc import Sequence
from fnmatch import fnmatchcase

from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.part_reader import PartReader
from core.base.driver.command_category import CommandCategory

ENVIRONMENT_PREFIX = re.compile(r"""^(?:[A-Za-z_]\w*=(?:'[^']*'|"[^"]*"|\S*)\s+)+""")


class ReaderSelection:
    """The reader of a run, judged part by part, a test run, a build or a check first and then the parts in
    order: among the readers whose commands match the part the default, else the newest, so a reader of the
    project comes before a shipped one; a journal command's own output, and that of a read or a search, is
    read by none. A reader's commands are patterns of a command, separated by commas, matched without the
    variables a line sets in front of it."""

    @staticmethod
    def choose(readers: Sequence[Reader], parts: Sequence[ProcessPart]) -> PartReader | None:
        for part in sorted(parts, key=lambda part: (not part.category.is_watched, part.position)):
            matching = sorted((reader for reader in readers if ReaderSelection.reads(reader, part)), key=lambda reader: (not reader.is_default, -reader.id))
            if matching:
                return PartReader(matching[0], part)
        return None

    @staticmethod
    def reads(reader: Reader, part: ProcessPart) -> bool:
        return ReaderSelection.reads_command(reader, part.command or part.text, part.category)

    @staticmethod
    def reads_command(reader: Reader, command: str, category: CommandCategory) -> bool:
        return not category.is_readonly and ReaderSelection.matches(reader.commands, command)

    @staticmethod
    def matches(patterns: str, command: str) -> bool:
        bare_command = ENVIRONMENT_PREFIX.sub("", command)
        return any(fnmatchcase(bare_command, pattern.strip()) for pattern in patterns.split(","))
