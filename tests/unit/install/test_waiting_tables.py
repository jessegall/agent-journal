from core.modules import DEFAULT_MODULES
from install.upgrade_text import WAITING_TABLES
from suites import DEFAULT_SUITES


def read_tables(modules) -> set[str]:
    return {read.split(" (")[0] for module in modules for move in module.moves for read in (*move.reads, *move.drops)}


def waiting_and_moved(waiting, modules) -> list[str]:
    return sorted(set(waiting) & read_tables(modules))


def test_no_waiting_table_is_one_a_move_reads():
    assert waiting_and_moved(WAITING_TABLES, (*DEFAULT_MODULES, *DEFAULT_SUITES)) == []


def test_a_table_a_move_reads_is_found_among_the_waiting_ones():
    assert waiting_and_moved(("gadgets", "phones"), DEFAULT_MODULES) == ["phones"]
