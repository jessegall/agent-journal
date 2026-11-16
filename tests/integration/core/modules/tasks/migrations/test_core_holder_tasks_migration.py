import sqlite3

from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from core.modules.tasks.migrations.m028_core_holder_tasks import CoreHolderTasksMigration

MAIN_ID = 78
TABLES = (
    "CREATE TABLE environments (id INTEGER PRIMARY KEY, test INTEGER NOT NULL DEFAULT 0)",
    "CREATE TABLE agents (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL, role TEXT NOT NULL)",
    "CREATE TABLE tasks (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL, holder_id INTEGER, state TEXT NOT NULL)",
    "INSERT INTO environments VALUES (5, 0), (6, 1), (7, 0)",
    f"INSERT INTO agents VALUES ({MAIN_ID}, 5, 'main'), (90, 5, 'helper')",
    "INSERT INTO tasks VALUES (1, 5, 0, 'started'), (2, 5, 0, 'blocked'), (3, 5, 0, 'completed'), (4, 6, 0, 'started'),"
    " (5, 7, 0, 'testing'), (6, 7, 0, 'blocked'), (7, 5, 90, 'started')",
)


def migrated(tmp_path, runs: int = 1) -> sqlite3.Connection:
    home = JournalHome(tmp_path / "journal")
    home.folder.mkdir(parents=True)
    connection = sqlite3.connect(home.database)
    connection.executescript(";".join(TABLES))
    connection.close()
    database = Database.opened(home)
    for _ in range(runs):
        CoreHolderTasksMigration().run(database)
    database.close()
    return sqlite3.connect(home.database)


def test_a_task_of_the_core_goes_to_its_environments_main_agent_and_elsewhere_is_let_go(tmp_path):
    rows = migrated(tmp_path).execute("SELECT id, holder_id, state FROM tasks ORDER BY id").fetchall()
    assert rows == [(1, MAIN_ID, "started"), (2, MAIN_ID, "blocked"), (3, 0, "completed"), (4, None, "open"),
                    (5, None, "open"), (6, None, "blocked"), (7, 90, "started")]


def test_a_second_run_changes_nothing(tmp_path):
    once = migrated(tmp_path / "once").execute("SELECT id, holder_id, state FROM tasks ORDER BY id").fetchall()
    twice = migrated(tmp_path / "twice", runs=2).execute("SELECT id, holder_id, state FROM tasks ORDER BY id").fetchall()
    assert once == twice


def test_a_database_with_no_agents_table_is_left_as_it_is(tmp_path):
    home = JournalHome(tmp_path / "journal")
    home.folder.mkdir(parents=True)
    connection = sqlite3.connect(home.database)
    connection.executescript("CREATE TABLE tasks (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL, holder_id INTEGER, state TEXT NOT NULL);"
                             "INSERT INTO tasks VALUES (1, 5, 1, 'started')")
    connection.close()
    database = Database.opened(home)
    CoreHolderTasksMigration().run(database)
    database.close()
    assert sqlite3.connect(home.database).execute("SELECT holder_id, state FROM tasks").fetchall() == [(1, "started")]
