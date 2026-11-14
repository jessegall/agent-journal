import sqlite3

from core.modules.helpers.migrations.m007_read_only_helper_setting_keys import HelperSettingKeysMigration

STAMP = "2026-01-01T00:00:00"


def migrated(rows: list[tuple[int | None, str, str]]) -> list[tuple[int | None, str, str]]:
    connection = sqlite3.connect(":memory:")
    connection.execute("CREATE TABLE settings (id INTEGER PRIMARY KEY, environment_id INTEGER, creator_id INTEGER NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL,"
                       " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (environment_id, key))")
    connection.executemany("INSERT INTO settings (environment_id, creator_id, key, value, created_at, updated_at) VALUES (?, 7, ?, ?, ?, ?)", [(*row, STAMP, STAMP) for row in rows])
    for statement in HelperSettingKeysMigration.statements:
        connection.execute(statement)
    return connection.execute("SELECT environment_id, key, value FROM settings ORDER BY id").fetchall()


def test_stored_helper_limits_move_to_their_read_only_keys_at_each_level():
    rows = migrated([(None, "journal.core.helpers.helper-run-limit", "2"), (1, "journal.core.helpers.helper-run-limit", "5"), (None, "journal.core.helpers.helper-max-cost", "3")])
    assert rows == [(None, "journal.core.helpers.read-only-helper-run-limit", "2"), (1, "journal.core.helpers.read-only-helper-run-limit", "5"), (None, "journal.core.helpers.read-only-helper-max-cost", "3")]


def test_other_settings_are_left_alone():
    rows = [(None, "journal.core.helpers.allowed-models", "[]")]
    assert migrated(rows) == rows
