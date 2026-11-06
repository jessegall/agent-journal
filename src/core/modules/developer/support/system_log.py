from itertools import chain

from core.base.journal_home import JournalHome
from core.base.page import Page
from core.modules.developer.support.log_file_lines import LogFileLines
from core.modules.developer.support.log_filter import LogFilter
from core.modules.developer.support.log_line import LogLine

MOST_BYTES_READ = 32 * 1024 * 1024


class SystemLog:
    """Reads the system log, newest first. It reads the file from its end only as far as the page asks,
    reaches the rotated file only for an older page, and stops at a limit of bytes, so one read of the page
    never parses the whole log. The total is what it has seen, plus one when more may follow."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def page(self, filters: LogFilter, number: int, size: int) -> Page[LogLine]:
        number, size = max(1, number), min(200, max(1, size))
        offset = (number - 1) * size
        log = self.home.system_log
        readers = [LogFileLines(path) for path in (log, log.with_name(log.name + ".1")) if path.is_file()]
        matching: list[LogLine] = []
        for line in chain.from_iterable(reader.newest_first() for reader in readers):
            if filters.matches(line):
                matching.append(line)
            if len(matching) > offset + size or sum(reader.bytes_read for reader in readers) > MOST_BYTES_READ:
                break
        rows = tuple(matching[offset:offset + size])
        return Page(rows, number, size, len(matching))
