from engine.caller.kept_process_rows import KeptProcessRows
from engine.caller.process_row import ProcessRow
from engine.time.timestamp import Timestamp

STARTED = Timestamp.parsed("2026-11-14T06:00:00+00:00")


class SetClock:
    def __init__(self) -> None:
        self.now = 100.0

    def epoch_seconds(self) -> float:
        return self.now


class CountedTable:
    def __init__(self, pids: dict[int, int]) -> None:
        self.pids, self.reads = pids, 0

    def rows(self) -> list[ProcessRow]:
        self.reads += 1
        return [ProcessRow(pid, parent, STARTED) for pid, parent in self.pids.items()]


def test_two_chains_within_the_window_read_the_table_once():
    kept, table = KeptProcessRows(SetClock()), CountedTable({1: 0, 50: 1, 60: 50})
    kept.rows(table, 60)
    kept.rows(table, 50)
    assert table.reads == 1


def test_a_new_pid_reads_the_table_again():
    kept, table = KeptProcessRows(SetClock()), CountedTable({1: 0, 50: 1})
    kept.rows(table, 50)
    table.pids[70] = 50
    assert 70 in kept.rows(table, 70)
    assert table.reads == 2


def test_an_old_table_is_read_again():
    clock = SetClock()
    kept, table = KeptProcessRows(clock), CountedTable({1: 0, 50: 1})
    kept.rows(table, 50)
    clock.now += 3
    kept.rows(table, 50)
    assert table.reads == 2
