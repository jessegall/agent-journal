import sqlite3

import pytest

from suites.coding.modules.workers.migrations.m063_merger_line_ledger import MergerLineLedgerMigration

OLDER_JOURNAL = """
    CREATE TABLE merger_lines (id INTEGER PRIMARY KEY, worker_id INTEGER, facts_json TEXT);
    CREATE TABLE agents (id INTEGER PRIMARY KEY, retired_at TEXT);
    CREATE TABLE tasks (id INTEGER PRIMARY KEY, state TEXT);
    CREATE TABLE waits (id INTEGER PRIMARY KEY, session_agent_id INTEGER, state TEXT, type TEXT);
    INSERT INTO agents VALUES (4, NULL), (5, NULL), (6, '2026-03-01T09:00:00.000000+00:00'), (7, NULL);
    INSERT INTO tasks VALUES (11, 'started'), (12, 'completed'), (13, 'started'), (14, 'started');
    INSERT INTO waits VALUES (21, 4, 'open', 'answer'), (22, 5, 'open', 'answer'), (23, 6, 'open', 'help_request'), (24, 7, 'ended', 'answer');
    INSERT INTO merger_lines VALUES
        (1, 4, '{"task": 11}'), (2, 5, '{"task": 12}'), (3, 6, '{"task": 13}'), (4, 7, '{"task": 14}'), (5, 4, NULL), (6, NULL, NULL);
"""


@pytest.fixture
def upgraded():
    connection = sqlite3.connect(":memory:")
    connection.executescript(OLDER_JOURNAL)
    for statement in MergerLineLedgerMigration.statements:
        connection.execute(statement)
    yield connection
    connection.close()


def line(connection, line_id: int) -> tuple:
    return connection.execute("SELECT task_id, wait_id, outcome, closed_at IS NOT NULL, due_at IS NOT NULL, forward_at IS NOT NULL, visit_count FROM merger_lines WHERE id = ?", [line_id]).fetchone()


def test_the_line_of_a_worker_that_still_waits_keeps_its_wait_and_gets_its_times_from_the_upgrade(upgraded):
    assert line(upgraded, 1) == (11, 21, None, 0, 1, 1, 0)
    due_at, forward_at = upgraded.execute("SELECT due_at, forward_at FROM merger_lines WHERE id = 1").fetchone()
    assert due_at < forward_at and due_at.endswith("+00:00") and len(due_at) == len("2026-03-01T09:00:00.000000+00:00")


@pytest.mark.parametrize("line_id, task_id", [(2, 12), (3, 13), (4, 14)])
def test_a_line_whose_task_ended_whose_worker_retired_or_whose_wait_ended_is_closed_as_moot(upgraded, line_id, task_id):
    assert line(upgraded, line_id) == (task_id, None, "moot", 1, 0, 0, 0)


def test_a_line_with_no_facts_and_no_wait_is_closed_without_an_error(upgraded):
    assert line(upgraded, 5) == (None, None, "moot", 1, 0, 0, 0)


def test_a_line_about_no_worker_is_not_changed(upgraded):
    assert line(upgraded, 6) == (None, None, None, 0, 0, 0, 0)
