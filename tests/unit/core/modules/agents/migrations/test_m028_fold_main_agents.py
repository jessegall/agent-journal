import sqlite3

import pytest

from core.modules.agents.migrations.m028_fold_main_agents import FoldMainAgentsMigration
from engine.database.database import Database

ROWS = """
    CREATE TABLE actors (id INTEGER PRIMARY KEY, name TEXT);
    CREATE TABLE agents (id INTEGER PRIMARY KEY REFERENCES actors (id), environment_id INTEGER, role TEXT, number INTEGER, ended_at TEXT);
    CREATE TABLE agent_sessions (id INTEGER PRIMARY KEY, session_agent_id INTEGER REFERENCES agents (id) ON DELETE CASCADE, session TEXT);
    CREATE TABLE memories (id INTEGER PRIMARY KEY, actor_id INTEGER REFERENCES actors (id), weight INTEGER);
    CREATE TABLE agent_folds (id INTEGER PRIMARY KEY, environment_id INTEGER, folded_agent_id INTEGER UNIQUE, survivor_id INTEGER, folded_number INTEGER,
        agent_row TEXT, actor_row TEXT, sessions TEXT, folded_at TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE agent_fold_rows (id INTEGER PRIMARY KEY, environment_id INTEGER, fold_id INTEGER, table_name TEXT, row TEXT, rule TEXT,
        created_at TEXT, updated_at TEXT);
    INSERT INTO actors VALUES (1, 'a'), (2, 'b');
    INSERT INTO agents VALUES (1, 1, 'main', 1, '2026-01-01T00:00:00+00:00'), (2, 1, 'main', 2, NULL);
    INSERT INTO agent_sessions VALUES (1, 1, 's1');
    INSERT INTO memories VALUES (1, 1, 7), (2, 2, 3);
"""


@pytest.fixture
def database(tmp_path):
    connection = sqlite3.connect(tmp_path / "version-5.db", autocommit=True)
    connection.executescript(ROWS)
    yield Database.configured(connection)
    connection.close()


def test_the_migration_folds_the_older_main_row_into_the_running_one_after_a_copy(database, tmp_path):
    FoldMainAgentsMigration().run(database)
    assert [tuple(row) for row in database.connection.execute("SELECT id, number FROM agents")] == [(2, 1)]
    assert [tuple(row) for row in database.connection.execute("SELECT actor_id FROM memories ORDER BY id")] == [(2,), (2,)]
    assert list((tmp_path / "backups-watch").glob("fold-*.db"))


def test_a_mismatch_rolls_back_and_logs_while_the_journal_starts_unfolded(database, tmp_path):
    database.connection.execute("CREATE TRIGGER planted AFTER UPDATE ON memories BEGIN INSERT INTO agent_sessions (session_agent_id, session) VALUES (99, 'x'); END")
    FoldMainAgentsMigration().run(database)
    assert database.connection.execute("SELECT count(*) FROM agents").fetchone()[0] == 2
    assert "rolled back" in next(tmp_path.rglob("*.log")).read_text()


def test_a_second_run_changes_nothing(database):
    FoldMainAgentsMigration().run(database)
    FoldMainAgentsMigration().run(database)
    assert database.connection.execute("SELECT count(*) FROM agent_folds").fetchone()[0] == 1


def test_after_the_fold_a_second_main_row_is_refused(database):
    FoldMainAgentsMigration().run(database)
    with pytest.raises(sqlite3.IntegrityError):
        database.connection.execute("INSERT INTO agents VALUES (3, 1, 'main', 3, NULL)")
