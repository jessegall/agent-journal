from dataclasses import dataclass

import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.model.model import Model
from engine.query.errors.unknown_operator_error import UnknownOperatorError
from engine.query.query import Query
from tests.unit.engine.model.test_table import LogEntry
from tests.unit.engine.query.test_query import entries  # noqa: F401  (the shared fixture)

TEST_ROWS_REASON = "the test reads every row it checks"

SELECT_ALL = "SELECT * FROM log_entries"


@dataclass(frozen=True, kw_only=True)
class Loan(Model):
    model_name = "loan"
    cli_name = "loan"

    entry_id: int
    returned_at: str | None = None


@pytest.fixture
def loans(entries: Query[LogEntry]) -> Query[Loan]:
    entries.database.update(Statement("CREATE TABLE loans (id INTEGER PRIMARY KEY, version INTEGER NOT NULL, metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL,"
                                      " updated_at TEXT NOT NULL, entry_id INTEGER NOT NULL, returned_at TEXT) STRICT"))
    return Query(entries.database, entries.tables, Loan)


@pytest.fixture
def statements_run(monkeypatch):
    executed: list[str] = []
    original = Database.rows

    def counted(database: Database, statement: Statement):
        executed.append(statement.sql)
        return original(database, statement)

    monkeypatch.setattr(Database, "rows", counted)
    return executed


def saved(query: Query) -> Statement:
    return query.scoped(query.select).statement()


def test_where_with_keywords_writes_equal_conditions_in_order(entries: Query[LogEntry]):
    assert saved(entries.where(title="Book 2", state="open")) == Statement(f"{SELECT_ALL} WHERE title = ? AND state = ?", ["Book 2", "open"])


def test_filter_still_gives_the_rows_where_gives(entries: Query[LogEntry]):
    assert [row.id for row in entries.filter(shelf_id=3).every_row(TEST_ROWS_REASON)] == [row.id for row in entries.where(shelf_id=3).every_row(TEST_ROWS_REASON)] == [2, 4, 6]


@pytest.mark.parametrize("operator", ["=", "!=", "<", "<=", ">", ">="])
def test_where_with_an_operator_compares(entries: Query[LogEntry], operator):
    assert saved(entries.where("id", operator, 4)) == Statement(f"{SELECT_ALL} WHERE id {'IS NOT' if operator == '!=' else operator} ?", [4])


def test_an_unknown_operator_is_refused_before_reading(entries: Query[LogEntry], statements_run):
    with pytest.raises(UnknownOperatorError, match="unknown operator ~=; use one of = != < <= > >="):
        entries.where("id", "~=", 4)
    assert statements_run == []


def test_where_in_a_list_writes_in_with_one_placeholder_each(entries: Query[LogEntry]):
    assert saved(entries.where_in("id", [1, 3, 5])) == Statement(f"{SELECT_ALL} WHERE id IN (?, ?, ?)", [1, 3, 5])


def test_where_in_an_empty_list_reads_nothing_and_runs_no_statement(entries: Query[LogEntry], statements_run):
    assert list(entries.where_in("id", []).every_row(TEST_ROWS_REASON)) == [] and statements_run == []


def test_where_in_another_query_writes_a_subselect_with_its_parameters_in_order(entries: Query[LogEntry], loans: Query[Loan]):
    inner = loans.where_null("returned_at").where("entry_id", ">", 2).select_columns("entry_id")
    assert saved(entries.where(state="open").where_in("id", inner)) == Statement(
        f"{SELECT_ALL} WHERE state = ? AND id IN (SELECT entry_id FROM loans WHERE returned_at IS NULL AND entry_id > ?)", ["open", 2])


def test_where_exists_writes_exists_and_where_not_exists_writes_not_exists(entries: Query[LogEntry], loans: Query[Loan]):
    open_loans = loans.where_column("entry_id", "log_entries.id").where_null("returned_at")
    assert saved(entries.where_exists(open_loans)) == Statement(f"{SELECT_ALL} WHERE EXISTS (SELECT 1 FROM loans WHERE entry_id = log_entries.id AND returned_at IS NULL)")
    assert saved(entries.where_not_exists(open_loans)) == Statement(f"{SELECT_ALL} WHERE NOT EXISTS (SELECT 1 FROM loans WHERE entry_id = log_entries.id AND returned_at IS NULL)")


def test_where_prefix_and_where_null_and_where_not_null_write_their_sql(entries: Query[LogEntry]):
    assert saved(entries.where_prefix("title", "Book")) == Statement(f"{SELECT_ALL} WHERE title GLOB ?", ["Book*"])
    assert saved(entries.where_null("due_at")) == Statement(f"{SELECT_ALL} WHERE due_at IS NULL")
    assert saved(entries.where_not_null("due_at")) == Statement(f"{SELECT_ALL} WHERE due_at IS NOT NULL")


def test_pluck_gives_a_list_of_plain_values_at_most_50(entries: Query[LogEntry]):
    assert entries.where("id", "<=", 3).pluck("title", str) == ["Book 1", "Book 2", "Book 3"]
