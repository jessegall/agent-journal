import heapq
from collections.abc import Iterator
from itertools import chain

from core.base.journal_home import JournalHome
from core.base.page import Page
from core.modules.developer.support.log_file_lines import LogFileLines
from core.modules.developer.support.log_filter import LogFilter
from core.modules.developer.support.log_line import LogLine

MOST_BYTES_READ = 32 * 1024 * 1024


class SystemLog:
    """Reads server messages, errors and journal notes together, newest first. It reads each file from its end only
    as far as the page asks, reaches a rotated file only for an older page, and stops at a limit of bytes, so one
    read of the page never parses the whole logs. The total is what it has seen, plus one when more may follow."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def page(self, filters: LogFilter, number: int, size: int) -> Page[LogLine]:
        number, size = max(1, number), min(200, max(1, size))
        offset = (number - 1) * size
        readers = [LogFileLines(path) for log in (self.home.folder / "runtime" / "server.log", self.home.error_log)
                   for path in (log, log.with_name(log.name + ".1")) if path.is_file()]
        matching: list[LogLine] = []
        for line in heapq.merge(*self.logs(readers), key=lambda line: line.recorded_at, reverse=True):
            if filters.matches(line):
                matching.append(line)
            if len(matching) > offset + size or sum(reader.bytes_read for reader in readers) > MOST_BYTES_READ:
                break
        rows = tuple(matching[offset:offset + size])
        return Page(rows, number, size, len(matching))

    @staticmethod
    def logs(readers: list[LogFileLines]) -> list[Iterator[LogLine]]:
        by_log: dict[str, list[LogFileLines]] = {}
        for reader in readers:
            by_log.setdefault(reader.path.name.removesuffix(".1"), []).append(reader)
        return [chain.from_iterable(reader.newest_first() for reader in kept) for kept in by_log.values()]
