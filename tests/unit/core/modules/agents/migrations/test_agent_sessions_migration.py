import sqlite3

import pytest

from core.modules.agents.migrations.m023_agent_sessions import AgentSessionsMigration
from engine.database.database import Database

ROWS = """
    CREATE TABLE environments (id INTEGER PRIMARY KEY);
    CREATE TABLE agents (id INTEGER PRIMARY KEY, environment_id INTEGER, session TEXT, program TEXT, program_model TEXT, created_at TEXT, updated_at TEXT, ended_at TEXT);
    INSERT INTO environments VALUES (1);
    INSERT INTO agents VALUES (1, 1, 's-1', 'claude', 'opus', '2026-11-01T09:00:00', '2026-11-01T10:00:00', '2026-11-01T10:00:00');
    INSERT INTO agents VALUES (2, 1, 's-2', 'codex', '', '2026-11-02T09:00:00', '2026-11-02T09:00:00', NULL);
"""


class StoppedSessionsMigration(AgentSessionsMigration):
    """The history migration with a last statement that fails."""

    statements = [*AgentSessionsMigration.statements, "INSERT INTO a_table_that_is_missing VALUES (1)"]


@pytest.fixture
def connection():
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.executescript(ROWS)
    yield connection
    connection.close()


def history(connection) -> list[tuple]:
    return [tuple(row) for row in connection.execute("SELECT session_agent_id, environment_id, session, program, program_model, started_at, ended_at, end_reason FROM agent_sessions ORDER BY id")]


def test_every_agent_gets_one_row_for_its_current_session_and_an_ended_agent_an_unknown_end(connection):
    AgentSessionsMigration().run(Database.configured(connection))
    assert history(connection) == [(1, 1, "s-1", "claude", "opus", "2026-11-01T09:00:00", "2026-11-01T10:00:00", "unknown"),
                                   (2, 1, "s-2", "codex", "", "2026-11-02T09:00:00", None, "")]


def test_a_second_run_adds_no_row(connection):
    database = Database.configured(connection)
    AgentSessionsMigration().run(database)
    AgentSessionsMigration().run(database)
    assert len(history(connection)) == 2


def test_a_failure_in_the_middle_of_a_transaction_leaves_no_table(connection):
    database = Database.configured(connection)
    with pytest.raises(Exception, match="a_table_that_is_missing"):
        with database.transaction():
            StoppedSessionsMigration().run(database)
    assert connection.execute("SELECT name FROM sqlite_master WHERE name = 'agent_sessions'").fetchall() == []
