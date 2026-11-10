from engine.module.module_finder import DEFAULT_MODULE_LISTS
from install.upgrade_text import BOOKKEEPING_TABLES
from tests.stories.fixtures.version_four import table_names, version_four_fixture, with_unknown_table

UNCLAIMED_TABLE = "old_reports"
ADDED_TABLE = "gadgets"


def claimed_tables() -> set[str]:
    modules = [module for path in DEFAULT_MODULE_LISTS for module in path.value()]
    return {table for module in modules for move in module.moves for table in (*move.reads, *move.drops)}


def missing_tables(tables: list[str]) -> list[str]:
    listed = claimed_tables() | set(BOOKKEEPING_TABLES) | {UNCLAIMED_TABLE}
    return [table for table in tables if table not in listed]


def test_every_table_of_the_version_4_fixture_is_moved_dropped_waits_for_a_task_or_is_kept_as_version_4s_own_records(tmp_path):
    expect_missing_tables(table_names(version_four_fixture(tmp_path / "journal.db", with_rows=False)), [])


def test_a_table_added_to_the_fixture_with_no_move_drop_or_waiting_entry_is_found(tmp_path):
    fixture = version_four_fixture(tmp_path / "journal.db", with_rows=False)
    with_unknown_table(fixture)
    expect_missing_tables(table_names(fixture), [ADDED_TABLE])


def expect_missing_tables(tables: list[str], expected) -> None:
    actual = missing_tables(tables)
    assert actual == expected, actual
