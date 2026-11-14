import sqlite3

from engine.database.database import Database
from core.modules.processes.migrations.m028_process_part_visibility import ProcessPartVisibilityMigration


def test_existing_parts_keep_category_visibility():
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.execute("CREATE TABLE process_parts (text TEXT NOT NULL, category TEXT NOT NULL)")
    connection.executemany("INSERT INTO process_parts VALUES (?, ?)", [
        ("journal task show 4", "unknown"), ("make build", "build"), ("pytest", "test run"),
    ])
    ProcessPartVisibilityMigration().run(Database.configured(connection))
    assert [row[0] for row in connection.execute("SELECT is_visible FROM process_parts ORDER BY rowid")] == [0, 1, 1]
