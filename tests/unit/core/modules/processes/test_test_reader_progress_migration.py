import sqlite3

from core.base.database.database import Database
from core.modules.processes.migrations.m052_test_reader_progress import TestReaderProgressMigration


def test_stock_readers_are_updated_without_changing_custom_readers():
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.execute("CREATE TABLE readers (name TEXT, creator_id INTEGER, progress_pattern TEXT, step_pattern TEXT)")
    connection.executemany("INSERT INTO readers VALUES (?, ?, 'old', 'old')", [("pytest", 1), ("vitest", 1), ("pytest", 2)])
    TestReaderProgressMigration().run(Database.configured(connection))
    rows = connection.execute("SELECT name, creator_id, progress_pattern, step_pattern FROM readers ORDER BY creator_id, name").fetchall()
    assert rows[0][2] == "" and rows[0][3] == "[.FEsxX]"
    assert rows[1][2] == "" and "(?P<passed>" in rows[1][3]
    assert rows[2][2:] == ("old", "old")
