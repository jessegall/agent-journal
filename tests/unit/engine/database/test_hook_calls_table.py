import sqlite3

from engine.database.database import Database
from engine.database.hook_calls_table import HookCallsTable

ROWS = """
    CREATE TABLE hook_calls (id INTEGER PRIMARY KEY, created_at TEXT);
    CREATE TABLE agent_lines (id INTEGER PRIMARY KEY, hook_call_id INTEGER REFERENCES hook_calls (id) ON DELETE RESTRICT, state TEXT);
    CREATE TABLE processes (id INTEGER PRIMARY KEY, hook_call_id INTEGER REFERENCES hook_calls (id) ON DELETE SET NULL);
    INSERT INTO hook_calls VALUES (1, '2026-01-01'), (2, '2026-01-02'), (3, '2026-01-03'), (4, '2026-03-01');
    INSERT INTO agent_lines VALUES (1, 1, 'delivered'), (2, 2, 'waiting'), (3, 4, 'delivered');
    INSERT INTO processes VALUES (1, 1);
"""


def database() -> Database:
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.executescript(ROWS)
    return Database.configured(connection)


def test_a_batch_deletes_old_calls_with_their_delivered_lines_and_keeps_a_call_whose_line_still_waits():
    rows = database()
    deleted, last_id = HookCallsTable(rows).delete_batch(0, "2026-02-01", 500)
    assert (deleted, last_id) == (2, 3)
    assert [tuple(row) for row in rows.connection.execute("SELECT id FROM hook_calls ORDER BY id")] == [(2,), (4,)]
    assert [tuple(row) for row in rows.connection.execute("SELECT id FROM agent_lines ORDER BY id")] == [(2,), (3,)]
    assert rows.connection.execute("SELECT hook_call_id FROM processes").fetchone()[0] is None


def test_the_next_batch_starts_after_the_last_id_and_an_empty_batch_keeps_it():
    rows = database()
    assert HookCallsTable(rows).delete_batch(0, "2026-02-01", 1) == (1, 1)
    assert HookCallsTable(rows).delete_batch(3, "2026-02-01", 500) == (0, 3)
