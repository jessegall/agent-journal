import sqlite3
from contextlib import ExitStack

import pytest

from core.base.database.database import NESTING_LIMIT_LEVELS, Database
from core.base.database.nesting_error import NestingError
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome


@pytest.fixture
def database(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    opened.update(Statement("CREATE TABLE notes (id INTEGER PRIMARY KEY, text TEXT NOT NULL) STRICT"))
    yield opened
    opened.close()


def count(database: Database) -> int:
    return database.rows(Statement("SELECT count(*) FROM notes"))[0][0]


def test_the_pragmas_are_set_as_it_opens(database):
    assert database.rows(Statement("PRAGMA foreign_keys"))[0][0] == 1
    assert database.rows(Statement("PRAGMA journal_mode"))[0][0] == "wal"
    assert database.rows(Statement("PRAGMA busy_timeout"))[0][0] == 5000


def test_a_transaction_that_ends_well_is_kept(database):
    with database.transaction():
        database.insert(Statement("INSERT INTO notes (text) VALUES (?)", ("kept",)))
    assert count(database) == 1 and not database.has_transaction


def test_an_error_rolls_everything_back_and_is_raised_as_it_was(database):
    with pytest.raises(KeyError, match="first"):
        with database.transaction():
            database.insert(Statement("INSERT INTO notes (text) VALUES (?)", ("lost",)))
            raise KeyError("first")
    assert count(database) == 0 and not database.has_transaction


def test_a_commit_that_fails_is_rolled_back(database):
    database.update(Statement("CREATE TABLE parents (id INTEGER PRIMARY KEY) STRICT"))
    database.update(Statement("CREATE TABLE children (id INTEGER PRIMARY KEY, parent_id INTEGER REFERENCES parents(id) DEFERRABLE INITIALLY DEFERRED) STRICT"))
    with pytest.raises(sqlite3.IntegrityError):
        with database.transaction():
            database.insert(Statement("INSERT INTO children (parent_id) VALUES (?)", (99,)))
    assert not database.has_transaction
    assert database.rows(Statement("SELECT count(*) FROM children"))[0][0] == 0


def test_a_second_connection_waits_for_the_write_lock_instead_of_writing_halfway(database, tmp_path):
    other = sqlite3.connect(tmp_path / "journal.db", autocommit=True, timeout=0.2)
    with database.transaction():
        database.insert(Statement("INSERT INTO notes (text) VALUES (?)", ("first",)))
        with pytest.raises(sqlite3.OperationalError, match="locked"):
            other.execute("BEGIN IMMEDIATE")
    other.execute("BEGIN IMMEDIATE")
    other.execute("ROLLBACK")
    other.close()


def test_an_inner_rollback_keeps_the_outer_work(database):
    with database.transaction():
        database.insert(Statement("INSERT INTO notes (text) VALUES (?)", ("outer",)))
        with pytest.raises(KeyError):
            with database.savepoint("CancelTask"):
                database.insert(Statement("INSERT INTO notes (text) VALUES (?)", ("inner",)))
                raise KeyError("inner refused")
    assert [row["text"] for row in database.rows(Statement("SELECT text FROM notes"))] == ["outer"]


def test_inner_work_is_lost_when_the_outer_rolls_back(database):
    with pytest.raises(KeyError):
        with database.transaction():
            with database.savepoint("CancelTask"):
                database.insert(Statement("INSERT INTO notes (text) VALUES (?)", ("inner",)))
            raise KeyError("outer refused")
    assert count(database) == 0


def test_nesting_past_the_limit_is_a_fault_naming_the_chain(database):
    with database.transaction():
        with pytest.raises(NestingError, match="TaskUpdate > TaskUpdate"):
            with ExitStack() as stack:
                for _ in range(NESTING_LIMIT_LEVELS + 1):
                    stack.enter_context(database.savepoint("TaskUpdate"))
        assert database.nested == []
