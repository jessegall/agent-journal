from dataclasses import dataclass

import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.database.table_statements import TableStatements
from engine.model.tables import Tables
from engine.model.view_model import ViewModel
from engine.query.errors.query_limit_error import QueryLimitError
from engine.query.queries import Queries
from engine.query.query import Query
from tests.unit.engine.model.test_table import LogEntry
from tests.unit.engine.query.test_query import FIXED_TIME, entries  # noqa: F401  (the shared fixture)
from tests.unit.engine.query.test_query_on_view import queries  # noqa: F401  (the shared fixture)

WALK_REASON = "the test reads every entry"


@dataclass(frozen=True, kw_only=True)
class ShelfTotal(ViewModel):
    cli_name = "shelf-total"
    view = "shelf_counts"
    key = "id"

    book_count: int


def added(entries: Query[LogEntry], count: int) -> None:
    table = Tables().table(LogEntry)
    statements = TableStatements(table)
    for number in range(count):
        entries.database.insert(statements.insert(table.row(LogEntry(title=f"Added {number}"), table.columns), FIXED_TIME))


@pytest.fixture
def statements_run(monkeypatch):
    executed: list[str] = []
    original = Database.rows

    def counted(database: Database, statement: Statement):
        executed.append(statement.sql)
        return original(database, statement)

    monkeypatch.setattr(Database, "rows", counted)
    return executed


def test_a_walk_over_a_view_model_without_a_key_is_refused(queries: Queries):
    with pytest.raises(QueryLimitError, match="every_row needs a key column to read in order"):
        queries.query(ShelfTotal).every_row(WALK_REASON)


def test_a_walk_gives_each_row_once_while_rows_are_added(entries: Query[LogEntry]):
    added(entries, 53)
    walk = entries.every_row(WALK_REASON)
    first = [next(walk) for _ in range(50)]
    added(entries, 10)
    ids = [row.id for row in (*first, *walk)]
    assert len(ids) == len(set(ids)) == 70 and ids == sorted(ids)


def test_a_walk_reads_with_key_greater_than_last_and_never_with_offset(entries: Query[LogEntry], statements_run):
    added(entries, 53)
    rows = list(entries.every_row(WALK_REASON))
    assert len(rows) == 60 and len(statements_run) == 2
    assert "id > ?" in statements_run[1] and not any("OFFSET" in sql for sql in statements_run)


def test_a_walk_keeps_the_callers_order_with_empty_values_last_when_descending(entries: Query[LogEntry]):
    table = Tables().table(LogEntry)
    for number in range(60):
        entries.database.insert(TableStatements(table).insert(table.row(LogEntry(title=f"Shelved {number}", shelf_id=number % 4 or None), table.columns), FIXED_TIME))
    rows = list(entries.order_by("shelf_id", "desc").every_row(WALK_REASON))
    shelved = [row for row in rows if row.shelf_id is not None]
    expected = sorted(shelved, key=lambda row: (-row.shelf_id, row.id)) + sorted((row for row in rows if row.shelf_id is None), key=lambda row: row.id)
    assert len(rows) == len({row.id for row in rows}) == 67 and [row.id for row in rows] == [row.id for row in expected]
