import sqlite3

import pytest

from core.modules.agents.migrations.m024_main_agent_parent import MainAgentParentMigration
from engine.database.database import Database

ENDED = "2026-01-01T00:00:00+00:00"
ROWS = f"""
    CREATE TABLE agents (id INTEGER PRIMARY KEY, environment_id INTEGER, role TEXT, number INTEGER, parent_id INTEGER, ended_at TEXT, retired_at TEXT);
    INSERT INTO agents VALUES (1, 1, 'main', 2, NULL, '{ENDED}', NULL), (2, 1, 'main', 3, NULL, NULL, NULL), (3, 1, 'main', 1, NULL, '{ENDED}', NULL);
    INSERT INTO agents VALUES (4, 1, 'worker', 4, 1, '{ENDED}', NULL), (5, 1, 'helper', 5, 3, NULL, NULL), (6, 1, 'worker', 6, 1, '{ENDED}', '{ENDED}'), (7, 1, 'worker', 7, 2, NULL, NULL);
    INSERT INTO agents VALUES (8, 2, 'main', 2, NULL, '{ENDED}', NULL), (9, 2, 'main', 1, NULL, '{ENDED}', NULL), (10, 2, 'worker', 3, 8, '{ENDED}', NULL);
    INSERT INTO agents VALUES (11, 3, 'main', 2, NULL, '{ENDED}', NULL), (12, 3, 'worker', 3, 11, '{ENDED}', NULL), (13, 3, 'worker', 4, 12, NULL, NULL);
"""


@pytest.fixture
def connection():
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.executescript(ROWS)
    yield connection
    connection.close()


def parents(connection) -> dict[int, int | None]:
    return dict(connection.execute("SELECT id, parent_id FROM agents WHERE role != 'main' ORDER BY id").fetchall())


def test_a_kept_agent_under_an_ended_main_session_moves_to_the_main_session_that_runs(connection):
    MainAgentParentMigration().run(Database.configured(connection))
    assert (parents(connection)[4], parents(connection)[5], parents(connection)[7]) == (2, 2, 2)


def test_with_no_main_session_running_it_moves_to_the_main_agent_numbered_one(connection):
    MainAgentParentMigration().run(Database.configured(connection))
    assert parents(connection)[10] == 9


def test_a_retired_agent_an_agent_under_a_worker_and_an_environment_with_no_main_agent_to_move_to_stay_as_they_are(connection):
    MainAgentParentMigration().run(Database.configured(connection))
    assert (parents(connection)[6], parents(connection)[13], parents(connection)[12]) == (1, 12, 11)


def test_a_second_run_changes_nothing(connection):
    database = Database.configured(connection)
    MainAgentParentMigration().run(database)
    first = parents(connection)
    MainAgentParentMigration().run(database)
    assert parents(connection) == first
