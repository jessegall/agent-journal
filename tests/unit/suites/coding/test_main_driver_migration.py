import json
import sqlite3

from suites.coding.migrations.m005_main_driver import MainDriverMigration

DRIVER = "journal.core.drivers.driver.main"
CONTINUE_SETTING = "journal.suites.coding.continue-while-delegatable"
STAMP = "2026-01-01T00:00:00"


def database() -> sqlite3.Connection:
    connection = sqlite3.connect(":memory:")
    connection.execute("CREATE TABLE settings (id INTEGER PRIMARY KEY, environment_id INTEGER, creator_id INTEGER NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL,"
                       " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (environment_id, key))")
    connection.execute("CREATE TABLE refusal_skips (id INTEGER PRIMARY KEY, name TEXT NOT NULL)")
    connection.execute("CREATE TABLE hook_calls (id INTEGER PRIMARY KEY, metadata TEXT NOT NULL)")
    connection.execute("CREATE TABLE viewer_layouts (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL, person_id INTEGER NOT NULL, creator_id INTEGER NOT NULL,"
                       " suite TEXT NOT NULL, page TEXT NOT NULL, driver TEXT NOT NULL, layout TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,"
                       " UNIQUE (environment_id, person_id, suite, page, driver))")
    return connection


def run(connection: sqlite3.Connection) -> None:
    for statement in MainDriverMigration.statements:
        connection.execute(statement)


def add_driver(connection: sqlite3.Connection, environment_id: int, name: str) -> None:
    connection.execute("INSERT INTO settings (environment_id, creator_id, key, value, created_at, updated_at) VALUES (?, 7, ?, ?, ?, ?)",
                       (environment_id, DRIVER, json.dumps(name), STAMP, STAMP))


def drivers(connection: sqlite3.Connection) -> dict[int, str]:
    return {environment: json.loads(value) for environment, value in connection.execute("SELECT environment_id, value FROM settings WHERE key = ?", tuple([DRIVER]))}


def test_builder_and_orchestrator_environments_move_to_the_main_driver_and_the_orchestrator_keeps_going():
    connection = database()
    add_driver(connection, 1, "coding.builder")
    add_driver(connection, 2, "coding.orchestrator")
    run(connection)
    assert drivers(connection) == {1: "coding.main", 2: "coding.main"}
    assert connection.execute("SELECT environment_id FROM settings WHERE key = ?", tuple([CONTINUE_SETTING])).fetchall() == [tuple([2])]


def test_saved_skips_and_stop_check_records_take_the_name_of_the_main_stop_rule():
    connection = database()
    connection.executemany("INSERT INTO refusal_skips (name) VALUES (?)", [tuple(["coding.builder-next-task-at-stop"]), tuple(["coding.orchestrator-open-tasks-at-stop"]),
                                                                         tuple(["coding.orchestrator-starts-no-task"]), tuple(["workers.dispatch-allowed"])])
    connection.execute("INSERT INTO hook_calls (metadata) VALUES (?)", tuple([json.dumps({"stop_checks": [{"rule": "coding.builder-next-task-at-stop", "applied": False}]})]))
    run(connection)
    assert [name for [name] in connection.execute("SELECT name FROM refusal_skips ORDER BY id")] == ["coding.main-stop"] * 3 + ["workers.dispatch-allowed"]
    [metadata] = connection.execute("SELECT metadata FROM hook_calls").fetchone()
    assert json.loads(metadata)["stop_checks"][0]["rule"] == "coding.main-stop"


def test_an_orchestrator_layout_is_copied_for_the_main_driver_and_the_old_row_stays():
    connection = database()
    connection.execute("INSERT INTO viewer_layouts (environment_id, person_id, creator_id, suite, page, driver, layout, created_at, updated_at) VALUES (1, 5, 5, 'coding', 'home', 'coding.orchestrator', '{\"a\": 1}', ?, ?)", (STAMP, STAMP))
    connection.execute("INSERT INTO viewer_layouts (environment_id, person_id, creator_id, suite, page, driver, layout, created_at, updated_at) VALUES (2, 5, 5, 'coding', 'home', 'coding.orchestrator', '{\"a\": 2}', ?, ?)", (STAMP, STAMP))
    connection.execute("INSERT INTO viewer_layouts (environment_id, person_id, creator_id, suite, page, driver, layout, created_at, updated_at) VALUES (2, 5, 5, 'coding', 'home', 'coding.main', '{\"a\": 9}', ?, ?)", (STAMP, STAMP))
    run(connection)
    rows = connection.execute("SELECT environment_id, driver, layout FROM viewer_layouts ORDER BY id").fetchall()
    assert sorted(rows) == sorted([(1, "coding.orchestrator", '{"a": 1}'), (2, "coding.orchestrator", '{"a": 2}'), (2, "coding.main", '{"a": 9}'), (1, "coding.main", '{"a": 1}')])


def test_a_second_run_changes_nothing():
    connection = database()
    add_driver(connection, 2, "coding.orchestrator")
    connection.execute("INSERT INTO refusal_skips (name) VALUES ('coding.builder-next-task-at-stop')")
    run(connection)
    first = [connection.execute(f"SELECT * FROM {table} ORDER BY id").fetchall() for table in ("settings", "refusal_skips", "hook_calls", "viewer_layouts")]
    run(connection)
    assert [connection.execute(f"SELECT * FROM {table} ORDER BY id").fetchall() for table in ("settings", "refusal_skips", "hook_calls", "viewer_layouts")] == first
