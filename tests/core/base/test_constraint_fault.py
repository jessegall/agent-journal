import sqlite3

import pytest

from core.base.database.constraint_fault import ConstraintFault
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome


@pytest.fixture
def database(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    for sql in ("CREATE TABLE shelves (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE) STRICT",
                "CREATE TABLE books (id INTEGER PRIMARY KEY, shelf_id INTEGER NOT NULL REFERENCES shelves(id) ON DELETE RESTRICT) STRICT",
                "CREATE TABLE loans (id INTEGER PRIMARY KEY, state TEXT NOT NULL CHECK (state != 'lost')) STRICT",
                "CREATE TRIGGER loans_rule BEFORE INSERT ON loans WHEN NEW.state = 'stolen' BEGIN SELECT RAISE(ABORT, 'rule: a loan cannot start as stolen'); END"):
        opened.update(Statement(sql))
    opened.insert(Statement("INSERT INTO shelves (name) VALUES ('top')"))
    opened.insert(Statement("INSERT INTO books (shelf_id) VALUES (1)"))
    yield opened
    opened.close()


def refusal_of(database: Database, sql: str, table: str, noun: str):
    with pytest.raises(sqlite3.IntegrityError) as caught:
        database.update(Statement(sql))
    return ConstraintFault(database).refusal(caught.value, table, noun)


def test_a_rule_raised_by_a_trigger_is_printed_as_written(database):
    assert refusal_of(database, "INSERT INTO loans (state) VALUES ('stolen')", "loans", "loan").text == "a loan cannot start as stolen"


def test_a_unique_failure_names_its_column(database):
    assert refusal_of(database, "INSERT INTO shelves (name) VALUES ('top')", "shelves", "shelf").text == "a shelf with that name exists already"


def test_a_row_still_referred_to_names_the_tables_that_refer_to_it(database):
    refusal = refusal_of(database, "DELETE FROM shelves WHERE id = 1", "shelves", "shelf")
    assert refusal.text == "this shelf is still referred to by books: remove or move those first"


def test_a_failure_it_cannot_read_is_raised_as_it_is(database):
    with pytest.raises(sqlite3.IntegrityError) as caught:
        database.update(Statement("INSERT INTO loans (state) VALUES ('lost')"))
    with pytest.raises(sqlite3.IntegrityError, match="CHECK"):
        ConstraintFault(database).refusal(caught.value, "loans", "loan")
