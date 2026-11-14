import sqlite3

import pytest

from core.modules.agents.migrations.m022_agent_number import AgentNumberMigration
from engine.database.database import Database

ROWS = """
    CREATE TABLE agents (id INTEGER PRIMARY KEY, environment_id INTEGER, role TEXT);
    INSERT INTO agents VALUES (1, 1, 'main'), (2, 1, 'main'), (3, 1, 'main');
    INSERT INTO agents VALUES (4, 2, 'worker'), (5, 2, 'helper');
    INSERT INTO agents VALUES (6, 3, 'worker'), (7, 3, 'main'), (8, 3, 'helper');
"""


@pytest.fixture
def connection():
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.executescript(ROWS)
    yield connection
    connection.close()


def numbers(connection) -> dict[int, int]:
    return dict(connection.execute("SELECT id, number FROM agents ORDER BY id").fetchall())


def test_the_newest_main_agent_is_one_and_the_others_count_from_two_in_the_order_they_were_made(connection):
    AgentNumberMigration().run(Database.configured(connection))
    assert numbers(connection) == {1: 2, 2: 3, 3: 1, 4: 2, 5: 3, 6: 2, 7: 1, 8: 3}


def test_a_second_run_changes_nothing(connection):
    database = Database.configured(connection)
    AgentNumberMigration().run(database)
    first = numbers(connection)
    AgentNumberMigration().run(database)
    assert numbers(connection) == first


def test_an_agent_made_without_a_number_after_the_first_run_takes_the_next_number(connection):
    database = Database.configured(connection)
    AgentNumberMigration().run(database)
    connection.execute("INSERT INTO agents (id, environment_id, role) VALUES (9, 2, 'main')")
    AgentNumberMigration().run(database)
    assert numbers(connection)[9] == 1


def test_two_agents_of_one_environment_cannot_have_the_same_number(connection):
    AgentNumberMigration().run(Database.configured(connection))
    with pytest.raises(sqlite3.IntegrityError):
        connection.execute("INSERT INTO agents (id, environment_id, role, number) VALUES (9, 1, 'worker', 2)")
