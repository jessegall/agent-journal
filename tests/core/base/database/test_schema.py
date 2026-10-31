import sqlite3

import pytest

from core.base.database.database import Database
from core.base.database.migration import Migration
from core.base.database.rebuild_migration import RebuildMigration
from core.base.database.schema import ModuleMigrations, Schema
from core.base.database.statement import Statement
from core.base.database.schema_mismatch_error import SchemaMismatchError
from core.base.database.view import View
from core.base.journal_home import JournalHome
from core.base.model.tables import Tables
from tests.core.base.database.test_table_statements import Shelf


class ShelvesTable(Migration):
    number = 1
    statements = ["CREATE TABLE shelves (id INTEGER PRIMARY KEY, label TEXT NOT NULL) STRICT"]


class BooksTable(Migration):
    number = 1
    statements = ["CREATE TABLE books (id INTEGER PRIMARY KEY, shelf_id INTEGER NOT NULL REFERENCES shelves(id) ON DELETE RESTRICT) STRICT"]


class BrokenSecondStatement(Migration):
    number = 2
    statements = ("CREATE TABLE half (id INTEGER PRIMARY KEY) STRICT", "CREATE TABLE half (id INTEGER PRIMARY KEY) STRICT")


class ShelvesLevelColumn(RebuildMigration):
    number = 2
    statements = ("CREATE TABLE shelves_new (id INTEGER PRIMARY KEY, label TEXT NOT NULL, level INTEGER NOT NULL DEFAULT 1) STRICT",
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
    plan = (ModuleMigrations("shelves", [ShelvesTable()]), ModuleMigrations("books", [BooksTable()]))
    assert Schema(database, Tables()).migrate(plan) == ["shelves 1", "books 1"]
    assert Schema(database, Tables()).migrate(plan) == []
    assert tables(database) == ["books", "migrations", "shelves"]


def test_a_failing_statement_undoes_its_whole_migration(database):
    with pytest.raises(sqlite3.OperationalError):
        Schema(database, Tables()).migrate([ModuleMigrations("shelves", (ShelvesTable(), BrokenSecondStatement()))])
    assert "half" not in tables(database)
    assert Schema(database, Tables()).migrate([ModuleMigrations("shelves", [ShelvesTable()])]) == []


def test_a_rebuild_keeps_every_row_that_points_at_the_table(database):
    schema = Schema(database, Tables())
    schema.migrate((ModuleMigrations("shelves", [ShelvesTable()]), ModuleMigrations("books", [BooksTable()])))
    database.insert(Statement("INSERT INTO shelves (label) VALUES ('top')"))
    database.insert(Statement("INSERT INTO books (shelf_id) VALUES (1)"))
    database.update(Statement("CREATE VIEW shelf_books AS SELECT shelves.id FROM shelves JOIN books ON books.shelf_id = shelves.id"))
    assert schema.migrate([ModuleMigrations("shelves", (ShelvesTable(), ShelvesLevelColumn()))]) == ["shelves 2"]
    assert database.rows(Statement("SELECT count(*) FROM books"))[0][0] == 1
    assert database.rows(Statement("SELECT level FROM shelves"))[0][0] == 1
    assert database.rows(Statement("PRAGMA foreign_keys"))[0][0] == 1


def test_a_view_is_made_again_from_its_declaration(database):
    schema = Schema(database, Tables())
    schema.migrate([ModuleMigrations("shelves", [ShelvesTable()])])
    schema.rebuild_views([View("shelf_labels", "SELECT label FROM shelves")])
    schema.rebuild_views([View("shelf_labels", "SELECT id, label FROM shelves")])
    assert [row["name"] for row in database.rows(Statement("PRAGMA table_info(shelf_labels)"))] == ["id", "label"]


def test_a_model_and_its_table_that_disagree_are_named_by_model_and_column(database):
    database.update(Statement("CREATE TABLE shelves (id INTEGER PRIMARY KEY, label TEXT, version INTEGER, metadata TEXT, created_at TEXT, updated_at TEXT, colour TEXT) STRICT"))
    with pytest.raises(SchemaMismatchError) as raised:
        Schema(database, Tables()).check_tables([Shelf])
    assert raised.value.differences == ("Shelf.level has no column in shelves", "shelves.colour has no field in Shelf")
