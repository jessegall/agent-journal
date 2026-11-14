from engine.enums.command_category import CommandCategory
from engine.setting.setting_values import SettingValues
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.count_command import CountCommand
from core.modules.processes.support.reader_selection import ReaderSelection
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT

LISTING_READERS_REASON = "a checkpoint looks for the reader that lists the tests of its own test"


class CheckpointListing:
    """The command that lists the tests of a checkpoint's own test before it is split into parts of at most
    the worker test limit: the listing of the first reader that reads the command, or none when the limit is 0
    or no reader lists it."""

    def __init__(self, readers: ReaderQuery, settings: SettingValues) -> None:
        self.readers, self.settings = readers, settings

    def limit(self) -> int:
        return self.settings.number(WORKER_TEST_LIMIT)

    def command(self, test_command: str) -> str:
        if self.limit() <= 0:
            return ""
        readers = self.readers.with_listing().every_row(LISTING_READERS_REASON)
        return next((CountCommand.filled(reader.count_command, test_command) for reader in readers if ReaderSelection.reads_command(reader, test_command, CommandCategory.TEST_RUN)), "")
