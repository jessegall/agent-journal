import sqlite3

from suites.coding.queries.conditions.prunable_file_edits import PrunableFileEdits

TABLE = "file_edits"


def pruned(rows: list[tuple[int, int]], kept_rows: int, kept_per_agent: int) -> list[int]:
    connection = sqlite3.connect(":memory:")
    connection.execute(f"CREATE TABLE {TABLE} (id INTEGER PRIMARY KEY, session_agent_id INTEGER)")
    connection.executemany(f"INSERT INTO {TABLE} VALUES (?, ?)", rows)
    statement = PrunableFileEdits(TABLE, kept_rows, kept_per_agent).statement()
    return [row[0] for row in connection.execute(f"SELECT id FROM {TABLE} WHERE {statement.sql} ORDER BY id", statement.parameters)]


def test_edits_past_the_newest_kept_rows_go():
    assert pruned([(1, 7), (2, 8), (3, 7), (4, 8)], kept_rows=2, kept_per_agent=10) == [1, 2]


def test_an_agent_keeps_only_its_newest_edits():
    assert pruned([(1, 7), (2, 7), (3, 8), (4, 7), (5, 7)], kept_rows=100, kept_per_agent=2) == [1, 2]


def test_nothing_goes_while_both_limits_hold():
    assert pruned([(1, 7), (2, 8)], kept_rows=10, kept_per_agent=10) == []
