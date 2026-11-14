import sqlite3

import pytest

from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from core.modules.tasks.migrations.m027_task_holder_any_actor import TaskHolderAnyActorMigration

PERSON_ID = 5
AGENT_ID = 6
OLD_TABLES = (
    "CREATE TABLE environments (id INTEGER PRIMARY KEY)",
    "CREATE TABLE actors (id INTEGER PRIMARY KEY)",
    "CREATE TABLE agents (id INTEGER PRIMARY KEY)",
    "CREATE TABLE tasks (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
    " holder_id INTEGER REFERENCES agents(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
    " title TEXT NOT NULL, brief TEXT NOT NULL DEFAULT '', state TEXT NOT NULL DEFAULT 'open', reason TEXT NOT NULL DEFAULT '',"
    " outcome TEXT NOT NULL DEFAULT '', closed_at TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}',"
    " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, priority INTEGER NOT NULL DEFAULT 200, started_at TEXT, complexity INTEGER,"
    " independence_reason TEXT NOT NULL DEFAULT '', focused_at TEXT) STRICT",
    "CREATE TABLE task_logs (id INTEGER PRIMARY KEY, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE, line TEXT NOT NULL)",
    "INSERT INTO environments VALUES (1)", f"INSERT INTO actors VALUES ({PERSON_ID})", f"INSERT INTO actors VALUES ({AGENT_ID})", f"INSERT INTO agents VALUES ({AGENT_ID})",
    f"INSERT INTO tasks (id, environment_id, holder_id, creator_id, title, state, priority, started_at, complexity, created_at, updated_at)"
    f" VALUES (7, 1, {AGENT_ID}, {PERSON_ID}, 'Held by an agent', 'started', 300, 'then', 3, 'then', 'then')",
    "INSERT INTO task_logs VALUES (1, 7, 'a line')",
)


def migrated(tmp_path) -> sqlite3.Connection:
    home = JournalHome(tmp_path / "journal")
    home.folder.mkdir()
    connection = sqlite3.connect(home.database)
    connection.executescript(";".join(OLD_TABLES))
    connection.close()
    database = Database.opened(home)
    TaskHolderAnyActorMigration().run(database)
    database.close()
    connection = sqlite3.connect(home.database)
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def test_every_task_is_kept_with_its_holder_and_its_logs(tmp_path):
    connection = migrated(tmp_path)
    assert connection.execute("SELECT id, holder_id, state, priority, started_at, complexity FROM tasks").fetchall() == [(7, AGENT_ID, "started", 300, "then", 3)]
    assert connection.execute("SELECT task_id FROM task_logs").fetchall() == [tuple([7])]
    assert tuple(["tasks_holder"]) in connection.execute("SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = 'tasks'").fetchall()


def test_a_person_may_hold_a_task(tmp_path):
    connection = migrated(tmp_path)
    connection.execute(f"UPDATE tasks SET holder_id = {PERSON_ID} WHERE id = 7")
    assert connection.execute("SELECT holder_id FROM tasks").fetchall() == [tuple([PERSON_ID])]


def test_a_holder_must_still_be_an_actor(tmp_path):
    connection = migrated(tmp_path)
    with pytest.raises(sqlite3.IntegrityError):
        connection.execute("UPDATE tasks SET holder_id = 999 WHERE id = 7")
