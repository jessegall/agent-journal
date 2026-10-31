from core.modules import DEFAULT_MODULES
from install.upgrade_text import WAITING_TABLES
from suites import DEFAULT_SUITES


def read_tables(modules) -> set[str]:
    return {read.split(" (")[0] for module in modules for move in module.moves for read in (*move.reads, *move.drops)}


def overlap(tables, modules) -> list[str]:
    return sorted(set(tables) & read_tables(modules))


def test_no_table_waits_that_a_move_reads():
    assert overlap(WAITING_TABLES, (*DEFAULT_MODULES, *DEFAULT_SUITES)) == []


def test_a_planted_table_is_found():
    assert overlap(("gadgets", "phones"), DEFAULT_MODULES) == ["phones"]
