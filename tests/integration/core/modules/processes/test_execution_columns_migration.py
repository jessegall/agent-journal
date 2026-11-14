import sqlite3

from engine.database.database import Database
from engine.enums.execution_priority import ExecutionPriority
from core.modules.processes.migrations.m079_execution_columns import ExecutionColumnsMigration


def upgraded() -> sqlite3.Connection:
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.execute("CREATE TABLE processes (id INTEGER PRIMARY KEY, priority INTEGER NOT NULL DEFAULT 2)")
    connection.execute("CREATE TABLE request_runs (id INTEGER PRIMARY KEY)")
    connection.executemany("INSERT INTO processes VALUES (?, ?)", [(1, ExecutionPriority.AGENT), (2, ExecutionPriority.NORMAL)])
    ExecutionColumnsMigration().run(Database.configured(connection))
    return connection


def test_old_rows_get_agent_defaults():
    stored = [tuple(row) for row in upgraded().execute("SELECT id, execution_class, first_priority, raised_at FROM processes ORDER BY id").fetchall()]
    assert stored == [(1, "", ExecutionPriority.AGENT, None), (2, "", ExecutionPriority.NORMAL, None)]


def test_new_columns_exist_after_upgrade():
    columns = {row[1] for row in upgraded().execute("PRAGMA table_info(processes)")}
    assert {"execution_class", "first_priority", "raised_at"} <= columns


def test_request_run_has_entered_and_started():
    columns = {row[1] for row in upgraded().execute("PRAGMA table_info(request_runs)")}
    assert {"entered_at", "started_at"} <= columns
