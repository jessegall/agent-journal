import sqlite3

from suites.coding.migrations.m004_main_agent_settings import MainAgentSettingsMigration
from suites.coding.support.shipped_profiles import MERGER_PROFILE

DRIVER = "journal.core.drivers.driver.main"
AUTO = "journal.suites.coding.auto-mode"
STAMP = "2026-01-01T00:00:00"


def connection_with(rows: list[tuple[int | None, str, str]]) -> sqlite3.Connection:
    connection = sqlite3.connect(":memory:")
    connection.execute("CREATE TABLE settings (id INTEGER PRIMARY KEY, environment_id INTEGER, creator_id INTEGER NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL,"
                       " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (environment_id, key))")
    connection.executemany("INSERT INTO settings (environment_id, creator_id, key, value, created_at, updated_at) VALUES (?, 7, ?, ?, ?, ?)", [(*row, STAMP, STAMP) for row in rows])
    return connection


def migrate(connection: sqlite3.Connection) -> list[tuple[int | None, str, str]]:
    for statement in MainAgentSettingsMigration.statements:
        connection.execute(statement)
    return connection.execute("SELECT environment_id, key, value FROM settings ORDER BY id").fetchall()


def test_an_orchestrator_environment_with_no_auto_value_gets_auto_off():
    rows = migrate(connection_with([(1, DRIVER, '"coding.orchestrator"')]))
    assert (1, AUTO, "false") in rows


def test_values_already_set_and_builder_environments_are_left_alone():
    previous = [(1, DRIVER, '"coding.orchestrator"'), (1, AUTO, "true"), (2, DRIVER, '"coding.builder"'), (2, AUTO, "false"), (3, DRIVER, '"coding.builder"'),
              (None, "journal.core.helpers.read-only-helper-profile-limits", f'["{MERGER_PROFILE.name}:1:2"]'), (1, "journal.suites.coding.workers.worker-run-limit", "3"),
              (None, "journal.suites.coding.workers.merge-commands", '["git push"]')]
    assert migrate(connection_with(previous)) == previous


def test_a_second_run_changes_nothing():
    connection = connection_with([(1, DRIVER, '"coding.orchestrator"')])
    first = migrate(connection)
    assert migrate(connection) == first
