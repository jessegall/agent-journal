import sqlite3
from types import SimpleNamespace

import pytest

from core.modules.agents.support.main_fold import MainFold
from core.modules.agents.support.main_fold_plan import EnvironmentFold
from engine.database.database import Database
from engine.errors.refusal import Refusal

FOLDED_AT = "2026-11-12T00:00:00+00:00"
ROWS = """
    CREATE TABLE actors (id INTEGER PRIMARY KEY, name TEXT);
    CREATE TABLE agents (id INTEGER PRIMARY KEY REFERENCES actors (id), environment_id INTEGER, role TEXT, number INTEGER);
    CREATE TABLE agent_sessions (id INTEGER PRIMARY KEY, session_agent_id INTEGER REFERENCES agents (id) ON DELETE CASCADE, session TEXT);
    CREATE TABLE memories (id INTEGER PRIMARY KEY, actor_id INTEGER REFERENCES actors (id), weight INTEGER);
    CREATE TABLE agent_folds (id INTEGER PRIMARY KEY, environment_id INTEGER, folded_agent_id INTEGER UNIQUE, survivor_id INTEGER, folded_number INTEGER,
        agent_row TEXT, actor_row TEXT, sessions TEXT, folded_at TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE agent_fold_rows (id INTEGER PRIMARY KEY, environment_id INTEGER, fold_id INTEGER, table_name TEXT, row TEXT, rule TEXT,
        created_at TEXT, updated_at TEXT);
    INSERT INTO actors VALUES (1, 'a'), (2, 'b'), (3, 'c'), (4, 'd'), (5, 'e');
    INSERT INTO agents VALUES (1, 1, 'main', 1), (2, 1, 'main', 2), (3, 1, 'main', 3), (4, 2, 'main', 4), (5, 2, 'main', 5);
    INSERT INTO agent_sessions VALUES (1, 1, 's1'), (2, 2, 's2'), (3, 4, 's4');
    INSERT INTO memories VALUES (1, 1, 7), (2, 2, 3), (3, 3, 5), (4, 4, 2), (5, 5, 9);
"""


def agent(agent_id: int, environment_id: int, number: int) -> SimpleNamespace:
    return SimpleNamespace(id=agent_id, environment_id=environment_id, number=number)


FOLDS = (EnvironmentFold(1, agent(3, 1, 3), (agent(1, 1, 1), agent(2, 1, 2))), EnvironmentFold(2, agent(5, 2, 5), (agent(4, 2, 4),)))


@pytest.fixture
def connection():
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.executescript(ROWS)
    yield connection
    connection.close()


def test_every_reference_moves_to_the_survivor_and_the_folded_rows_go(connection):
    MainFold(Database.configured(connection)).run(FOLDS, FOLDED_AT)
    assert connection.execute("SELECT id, number FROM agents ORDER BY id").fetchall() == [(3, 1), (5, 1)]
    assert connection.execute("SELECT session_agent_id FROM agent_sessions ORDER BY id").fetchall() == [(3,), (3,), (5,)]
    assert connection.execute("SELECT actor_id, weight FROM memories ORDER BY id").fetchall() == [(3, 7), (3, 3), (3, 5), (5, 2), (5, 9)]


def test_each_folded_agent_is_recorded_whole(connection):
    MainFold(Database.configured(connection)).run(FOLDS, FOLDED_AT)
    assert connection.execute("SELECT folded_agent_id, survivor_id, folded_number FROM agent_folds ORDER BY folded_agent_id").fetchall() == [
        (1, 3, 1), (2, 3, 2), (4, 5, 4)]


def test_a_mismatch_rolls_everything_back(connection):
    connection.execute("CREATE TRIGGER planted AFTER UPDATE ON memories BEGIN INSERT INTO agent_sessions (session_agent_id, session) VALUES (99, 'x'); END")
    with pytest.raises(Refusal):
        MainFold(Database.configured(connection)).run(FOLDS, FOLDED_AT)
    assert connection.execute("SELECT count(*) FROM agents").fetchone()[0] == 5
    assert connection.execute("SELECT count(*) FROM agent_folds").fetchone()[0] == 0
    assert connection.execute("PRAGMA foreign_keys").fetchone()[0] == 1
