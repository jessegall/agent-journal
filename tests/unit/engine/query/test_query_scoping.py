from dataclasses import dataclass

import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome
from engine.model.agent_scoped import AgentScoped
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.model.removable import Removable
from engine.model.tables import Tables
from engine.query.query import Query
from engine.row.row_owner import RowOwner
from engine.time.timestamp import Timestamp

TEST_ROWS_REASON = "the test reads every row it checks"

COMMON = "version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL DEFAULT ''"
WALK_REASON = "the test reads every shelf"


@dataclass(frozen=True, kw_only=True)
class Shelf(EnvironmentScoped, Model):
    model_name = "shelf"
    table = "shelves"
    cli_name = "shelf"

    environment_id: int = 0
    name: str


@dataclass(frozen=True, kw_only=True)
class Card(Removable, Model):
    model_name = "card"
    cli_name = "card"

    shelf_id: int
    removed_at: Timestamp | None = None


@dataclass(frozen=True, kw_only=True)
class Note(AgentScoped, Model):
    model_name = "note"
    cli_name = "note"

    agent_id: int | None = None
    shelf_id: int


@pytest.fixture
def database(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    for sql in (f"CREATE TABLE shelves (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL, name TEXT NOT NULL, {COMMON}) STRICT",
                f"CREATE TABLE cards (id INTEGER PRIMARY KEY, shelf_id INTEGER NOT NULL, removed_at TEXT, {COMMON}) STRICT",
                f"CREATE TABLE notes (id INTEGER PRIMARY KEY, agent_id INTEGER, shelf_id INTEGER NOT NULL, {COMMON}) STRICT",
                "INSERT INTO shelves (id, environment_id, name) VALUES " + ", ".join(f"({number}, {1 + number % 2}, 'Shelf {number}')" for number in range(1, 61)),
                "INSERT INTO cards (shelf_id, removed_at) VALUES (1, NULL), (2, NULL), (3, '2026-11-12T00:00:00+00:00')",
                "INSERT INTO notes (agent_id, shelf_id) VALUES (7, 1), (8, 2)"):
        database.update(Statement(sql))
    database.row_owner = RowOwner(agent=7, environment_id=2)
    yield database
    database.close()


@pytest.fixture
def tables():
    return Tables()


@pytest.fixture
def statements_run(monkeypatch):
    ran: list[str] = []
    original = Database.rows

    def counted(database: Database, statement: Statement):
        ran.append(statement.sql)
        return original(database, statement)

    monkeypatch.setattr(Database, "rows", counted)
    return ran


def shelves(database, tables) -> Query[Shelf]:
    return Query(database, tables, Shelf)


def test_where_in_a_query_scopes_the_inner_query_by_environment(database, tables, statements_run):
    inner = shelves(database, tables).where("id", "<=", 4).select_columns("id")
    rows = list(Query(database, tables, Card).where_in("shelf_id", inner).every_row(TEST_ROWS_REASON))
    assert [row.shelf_id for row in rows] == [1] and "environment_id = ?" in statements_run[-1]


def test_where_exists_inner_query_hides_removed_rows(database, tables, statements_run):
    cards = Query(database, tables, Card).where_column("shelf_id", "shelves.id")
    names = [row.name for row in shelves(database, tables).where("id", "<=", 4).where_exists(cards).every_row(TEST_ROWS_REASON)]
    assert names == ["Shelf 1"] and "removed_at IS NULL" in statements_run[-1]


def test_where_not_exists_inner_query_hides_removed_rows(database, tables, statements_run):
    cards = Query(database, tables, Card).where_column("shelf_id", "shelves.id")
    ids = [row.id for row in shelves(database, tables).where("id", "<=", 4).where_not_exists(cards).every_row(TEST_ROWS_REASON)]
    assert ids == [3] and "removed_at IS NULL" in statements_run[-1]


@pytest.mark.parametrize("left", [False, True])
def test_a_join_to_a_removable_model_hides_its_removed_rows(database, tables, left):
    query = shelves(database, tables)
    joined = (query.left_join if left else query.join)(Card, "cards.shelf_id", "=", "shelves.id")
    assert "cards.removed_at IS NULL" in joined.scoped(joined.select).statement().sql


def test_a_join_to_an_environment_scoped_model_keeps_its_environment(database, tables):
    joined = Query(database, tables, Card).join(Shelf, "shelves.id", "=", "cards.shelf_id")
    statement = joined.scoped(joined.select).statement()
    assert "shelves.environment_id = ?" in statement.sql and 2 in statement.parameters


def test_count_by_applies_the_scope(database, tables):
    assert shelves(database, tables).group_by("environment_id").count_by() == {2: 30}


def test_pluck_applies_the_scope(database, tables):
    assert shelves(database, tables).where("id", "<=", 4).pluck("name", str) == ["Shelf 1", "Shelf 3"]


def test_get_applies_the_scope_and_the_default_limit_together(database, tables):
    rows = shelves(database, tables).get()
    assert len(rows) == 30 and all(row.environment_id == 2 for row in rows)


def test_every_row_applies_the_scope_on_each_statement(database, tables, statements_run):
    database.row_owner = RowOwner(agent=None, environment_id=None)
    database.update(Statement("INSERT INTO shelves (environment_id, name) VALUES " + ", ".join(f"(2, 'More {number}')" for number in range(40))))
    database.row_owner = RowOwner(agent=7, environment_id=2)
    rows = list(shelves(database, tables).every_row(WALK_REASON))
    assert len(rows) == 70 and len(statements_run) == 2 and all("environment_id = ?" in sql for sql in statements_run)


def test_an_agent_scoped_read_keeps_the_agents_rows(database, tables):
    database.row_owner = RowOwner(agent=7, environment_id=None)
    assert Query(database, tables, Note).pluck("shelf_id", int) == [1]
