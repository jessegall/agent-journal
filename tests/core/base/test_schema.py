import sqlite3

import pytest

from core.base.database.database import Database
from core.base.database.migration import Migration
from core.base.database.rebuild_migration import RebuildMigration
from core.base.database.schema import ModuleMigrations, Schema
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome


class ShelvesTable(Migration):
    number = 1
    statements = ("CREATE TABLE shelves (id INTEGER PRIMARY KEY, label TEXT NOT NULL) STRICT",)


class BooksTable(Migration):
    number = 1
    statements = ("CREATE TABLE books (id INTEGER PRIMARY KEY, shelf_id INTEGER NOT NULL REFERENCES shelves(id) ON DELETE RESTRICT) STRICT",)


class BrokenSecondStatement(Migration):
    number = 2
    statements = ("CREATE TABLE half (id INTEGER PRIMARY KEY) STRICT", "CREATE TABLE half (id INTEGER PRIMARY KEY) STRICT")


class ShelvesWithFloors(RebuildMigration):
    number = 2
    statements = ("CREATE TABLE shelves_new (id INTEGER PRIMARY KEY, label TEXT NOT NULL, floor INTEGER NOT NULL DEFAULT 1) STRICT",
                  "INSERT INTO shelves_new (id, label) SELECT id, label FROM shelves",
                  "DROP TABLE shelves",
                  "ALTER TABLE shelves_new RENAME TO shelves")


@pytest.fixture
def database(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    yield opened
    opened.close()


def tables(database: Database) -> list[str]:
    return [row["name"] for row in database.rows(Statement("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name"))]


def test_each_migration_runs_once_in_the_order_of_the_modules(database):
    plan = (ModuleMigrations("shelves", (ShelvesTable(),)), ModuleMigrations("books", (BooksTable(),)))
    assert Schema(database).migrate(plan) == ("shelves 1", "books 1")
    assert Schema(database).migrate(plan) == ()
    assert tables(database) == ["books", "migrations", "shelves"]


def test_a_failing_statement_undoes_its_whole_migration(database):
    with pytest.raises(sqlite3.OperationalError):
        Schema(database).migrate((ModuleMigrations("shelves", (ShelvesTable(), BrokenSecondStatement())),))
    assert "half" not in tables(database)
    assert Schema(database).migrate((ModuleMigrations("shelves", (ShelvesTable(),)),)) == ()


def test_a_rebuild_keeps_every_row_that_points_at_the_table(database):
    schema = Schema(database)
    schema.migrate((ModuleMigrations("shelves", (ShelvesTable(),)), ModuleMigrations("books", (BooksTable(),))))
    database.insert(Statement("INSERT INTO shelves (label) VALUES ('top')"))
    database.insert(Statement("INSERT INTO books (shelf_id) VALUES (1)"))
    database.update(Statement("CREATE VIEW shelf_books AS SELECT shelves.id FROM shelves JOIN books ON books.shelf_id = shelves.id"))
    assert schema.migrate((ModuleMigrations("shelves", (ShelvesTable(), ShelvesWithFloors())),)) == ("shelves 2",)
    assert database.rows(Statement("SELECT count(*) FROM books"))[0][0] == 1
    assert database.rows(Statement("SELECT floor FROM shelves"))[0][0] == 1
    assert database.rows(Statement("PRAGMA foreign_keys"))[0][0] == 1
