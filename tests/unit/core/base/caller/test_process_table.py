import os

from core.base.caller.process_table import ProcessTable, proc_row, ps_rows
from core.base.caller.process_chain import CHAIN_LIMIT_STEPS, ProcessChain
from core.base.caller.process_row import ProcessRow
from core.base.timestamp import Timestamp

START = Timestamp.parsed("2026-10-31T09:00:00+00:00")


class SampleTable(ProcessTable):
    def __init__(self, rows: list[ProcessRow]) -> None:
        self.sample_rows = rows

    def rows(self) -> list[ProcessRow]:
        return self.sample_rows


def test_ps_lines_give_each_process_its_parent_and_start_in_utc():
    rows = ps_rows("  1     0 Thu Oct 29 07:00:00 2026\n48211 48190 Sat Oct 31 09:12:04 2026\nnot a line\n")
    assert [(row.pid, row.parent_pid) for row in rows] == [(1, 0), (48211, 48190)]
    assert rows[1].started_at.value.utcoffset().total_seconds() == 0


def test_a_proc_stat_line_gives_its_pid_parent_and_start_from_the_boot_time():
    stat = "4321 (python3 (x)) S 4000 4321 4000 0 -1 4194560 0 0 0 0 0 0 0 0 20 0 1 0 500 0 0"
    row = proc_row(stat, 1_700_000_000, 100)
    assert (row.pid, row.parent_pid, row.started_at.value.timestamp()) == (4321, 4000, 1_700_000_005)


def test_the_chain_walks_from_a_pid_up_to_the_first_process():
    table = SampleTable([ProcessRow(900, 700, START), ProcessRow(700, 1, START), ProcessRow(1, 0, START), ProcessRow(5, 1, START)])
    assert [step.pid for step in ProcessChain(table).steps(900)] == [900, 700, 1]


def test_the_chain_stops_at_its_limit_and_at_a_loop():
    long_table = SampleTable([ProcessRow(pid, pid - 1, START) for pid in range(1, 100)])
    assert len(ProcessChain(long_table).steps(99)) == CHAIN_LIMIT_STEPS
    looped = SampleTable([ProcessRow(2, 3, START), ProcessRow(3, 2, START)])
    assert [step.pid for step in ProcessChain(looped).steps(2)] == [2, 3]


def test_the_machines_table_holds_this_process_and_its_parent():
    steps = ProcessChain(ProcessTable()).steps(os.getpid())
    assert [step.pid for step in steps[:2]] == [os.getpid(), os.getppid()]
