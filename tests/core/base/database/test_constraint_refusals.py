import sqlite3

import pytest

from core.base.database.constraint_refusals import ConstraintRefusals
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.model.table import Table


@pytest.fixture
def database(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    for sql in ("CREATE TABLE shelves (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE) STRICT",
                "CREATE TABLE books (id INTEGER PRIMARY KEY, shelf_id INTEGER NOT NULL REFERENCES shelves(id) ON DELETE RESTRICT) STRICT",
                "CREATE TABLE items (id INTEGER PRIMARY KEY, state TEXT NOT NULL CHECK (state != 'lost')) STRICT",
                "CREATE TRIGGER items_rule BEFORE INSERT ON items WHEN NEW.state = 'stolen' BEGIN SELECT RAISE(ABORT, 'rule: an item cannot start as stolen'); END"):
        opened.update(Statement(sql))
    opened.insert(Statement("INSERT INTO shelves (name) VALUES ('top')"))
    opened.insert(Statement("INSERT INTO books (shelf_id) VALUES (1)"))
    yield opened
    opened.close()


def sample_table(name: str, cli_name: str) -> Table:
    return Table(type(cli_name.title(), (), {"cli_name": cli_name}), name, {})


def refusal_of(database: Database, sql: str, table: str, cli_name: str):
    with pytest.raises(sqlite3.IntegrityError) as raised:
        database.update(Statement(sql))
    return ConstraintRefusals(database).refusal(raised.value, sample_table(table, cli_name), sql.startswith("DELETE"))


def test_a_rule_raised_by_a_trigger_is_printed_as_written(database):
    assert refusal_of(database, "INSERT INTO items (state) VALUES ('stolen')", "items", "item").text == "an item cannot start as stolen"


def test_a_unique_failure_names_its_column(database):
    assert refusal_of(database, "INSERT INTO shelves (name) VALUES ('top')", "shelves", "shelf").text == "a shelf with that name exists already"


def test_a_row_still_referred_to_names_the_tables_that_refer_to_it(database):
    refusal = refusal_of(database, "DELETE FROM shelves WHERE id = 1", "shelves", "shelf")
    assert refusal.text == "this shelf is still referred to by books: remove or move those first"


def test_a_failure_it_cannot_read_is_raised_as_it_is(database):
    with pytest.raises(sqlite3.IntegrityError, match="cannot store TEXT value"):
        ConstraintRefusals(database).refusal(sqlite3.IntegrityError("cannot store TEXT value in INTEGER column items.id"), sample_table("items", "item"), False)
