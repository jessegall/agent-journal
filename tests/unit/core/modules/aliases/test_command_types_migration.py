import sqlite3

from core.base.database.database import Database
from core.modules.aliases.migrations.m004_command_kinds import CommandWordsMigration
from core.modules.aliases.migrations.m006_command_types import CommandTypesMigration


def test_the_table_of_command_kinds_becomes_the_table_of_command_types_with_its_rows():
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.execute("CREATE TABLE actors (id INTEGER PRIMARY KEY)")
    connection.execute("INSERT INTO actors VALUES (1)")
    database = Database.configured(connection)
    CommandWordsMigration().run(database)
    connection.execute("INSERT INTO command_kinds (creator_id, words, category, created_at, updated_at) VALUES (1, 'scripts/dev go test', 'test run', 'now', 'now')")
    CommandTypesMigration().run(database)
    assert [tuple(row) for row in connection.execute("SELECT words, category FROM command_types").fetchall()] == [("scripts/dev go test", "test run")]
    assert connection.execute("SELECT count(*) FROM sqlite_master WHERE name = 'command_kinds'").fetchone()[0] == 0
