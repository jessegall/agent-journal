import threading
from collections.abc import Mapping
from functools import cache

from engine.caller.process_row import ProcessRow
from engine.caller.process_table import ProcessTable
from engine.time.clock import Clock

KEPT_SECONDS = 2.0


class KeptProcessRows:
    """The process table kept for a moment and shared by every request of the process, so a burst of commands runs
    ps once instead of once each. The table is read again when it is older than KEPT_SECONDS, when the asking pid or
    a parent on its chain is not in it, or when the table's way of reading changed."""

    def __init__(self, clock: Clock) -> None:
        self.clock = clock
        self.lock = threading.Lock()
        self.read_at = 0.0
        self.reader: object = None
        self.kept: dict[int, ProcessRow] = {}

    @staticmethod
    @cache
    def shared() -> "KeptProcessRows":
        return KeptProcessRows(Clock())

    def rows(self, table: ProcessTable, pid: int) -> Mapping[int, ProcessRow]:
        with self.lock:
            if not self.is_fresh(table, pid):
                self.kept = {row.pid: row for row in table.rows()}
                self.read_at, self.reader = self.clock.epoch_seconds(), self.reader_of(table)
            return dict(self.kept)

    def is_fresh(self, table: ProcessTable, pid: int) -> bool:
        if self.reader is not self.reader_of(table) or self.clock.epoch_seconds() - self.read_at >= KEPT_SECONDS:
            return False
        return self.reaches_the_root(pid)

    # the machine's table holds nothing of its own, so every instance reads alike unless its rows were replaced; any
    # other table is its own source
    @staticmethod
    def reader_of(table: ProcessTable) -> object:
        return type(table).rows if type(table) is ProcessTable else table

    # a chain that stops at a pid the kept table lacks would end early, so such a chain reads the table again
    def reaches_the_root(self, pid: int) -> bool:
        seen: set[int] = set()
        while pid in self.kept and pid not in seen:
            seen.add(pid)
            pid = self.kept[pid].parent_pid
        return pid in seen or pid <= 1
