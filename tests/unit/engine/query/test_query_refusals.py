from dataclasses import dataclass

import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.model.model import Model
from engine.query.errors.query_limit_error import QueryLimitError
from engine.query.errors.unknown_column_error import UnknownColumnError
from engine.query.errors.unknown_operator_error import UnknownOperatorError
from engine.query.errors.unknown_table_error import UnknownTableError
from engine.query.query import Query
from tests.unit.engine.model.test_table import LogEntry
from tests.unit.engine.query.test_query import entries  # noqa: F401  (the shared fixture)


@dataclass(frozen=True, kw_only=True)
class Keeper(Model):
    model_name = "agent"
    cli_name = "agent"

    given_name: str


@pytest.fixture
def statements_run(monkeypatch):
    ran: list[str] = []
    original = Database.rows

    def counted(database: Database, statement: Statement):
        ran.append(statement.sql)
        return original(database, statement)

    monkeypatch.setattr(Database, "rows", counted)
    return ran


UNKNOWN_COLUMN_READS = {
    "where": lambda query: query.where(titel="x"),
    "where_in": lambda query: query.where_in("titel", ["x"]),
    "where_not_in": lambda query: query.where_not_in("titel", ["x"]),
    "where_null": lambda query: query.where_null("titel"),
    "where_not_null": lambda query: query.where_not_null("titel"),
    "where_prefix": lambda query: query.where_prefix("titel", "x"),
    "where_column": lambda query: query.where_column("titel", "log_entries.id"),
    "order_by": lambda query: query.order_by("titel"),
    "group_by": lambda query: query.group_by("titel"),
    "pluck": lambda query: query.pluck("titel", str),
    "select": lambda query: query.select_columns("titel"),
}


@pytest.mark.parametrize("read", UNKNOWN_COLUMN_READS.values(), ids=UNKNOWN_COLUMN_READS.keys())
def test_an_unknown_column_is_refused_before_reading(entries: Query[LogEntry], statements_run, read):
    with pytest.raises(UnknownColumnError, match="LogEntry has no column titel"):
        read(entries)
    assert statements_run == []


def test_an_unknown_column_in_a_join_is_refused(entries: Query[LogEntry]):
    with pytest.raises(UnknownColumnError, match="agents has no column idd"):
        entries.join(Keeper, "agents.idd", "=", "log_entries.shelf_id")


def test_a_join_qualifier_that_is_no_table_of_the_read_is_refused(entries: Query[LogEntry]):
    with pytest.raises(UnknownTableError, match="shelves is not a table of this read"):
        entries.join(Keeper, "agents.id", "=", "shelves.id")


@pytest.mark.parametrize("rows", [0, -1])
def test_a_limit_of_zero_or_less_is_refused(entries: Query[LogEntry], rows):
    with pytest.raises(QueryLimitError, match="a limit is at least 1"):
        entries.limit(rows, "a test names the limit")


def test_a_where_with_a_column_alone_is_refused_with_how_to_write_it(entries: Query[LogEntry]):
    with pytest.raises(UnknownOperatorError, match="a column and a value, or a column, an operator and a value"):
        entries.where("id")


def test_a_limit_with_no_reason_is_refused(entries: Query[LogEntry]):
    with pytest.raises(QueryLimitError, match="say why the read needs that many rows"):
        entries.limit(200, " ")
