from journal.features.shell.support.cap import Cap, DIRECT, ENDS, HINT, FULL
from journal.repositories.setting_rows import SettingRows
from journal.support.chain import Chain
from journal.support.writes import Writes


class OutputCap:
    """Decides a line's cap from its parts and the Settings page's numbers."""

    def __init__(self, settings: SettingRows) -> None:
        self.settings = settings

    def build(self, line: str) -> Cap:
        from journal.features.shell.feature import Shell
        if Chain.is_reading_code_line(line) or Writes.is_code_write_line(line):
            return Cap(DIRECT, 0)
        if Chain.is_journal_line(line):
            return Cap(FULL, 0)
        if Chain.is_read_line(line):
            return Cap(ENDS, self.settings.integer(Shell.READ_SHOWN))
        return Cap(HINT, self.settings.integer(Shell.COMMAND_SHOWN))
