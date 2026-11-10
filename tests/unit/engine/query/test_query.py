from datetime import datetime, timezone

import pytest

from engine.container.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.database.table_statements import TableStatements
from engine.journal.journal_home import JournalHome
from engine.errors.missing_rows_error import MissingRowsError
from engine.model.tables import Tables
from engine.time.timestamp import Timestamp
from engine.query.conditions.greater import Greater
from engine.query.conditions.less import Less
from engine.query.queries import Queries
from engine.query.query import Query
from engine.query.unknown_column_error import UnknownColumnError
from tests.unit.engine.model.test_table import LogEntry

FIXED_TIME = Timestamp(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))


@pytest.fixture
def entries(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    tables = Tables()
    table = tables.table(LogEntry)
    database.update(Statement("CREATE TABLE log_entries (id INTEGER PRIMARY KEY, version INTEGER NOT NULL, metadata TEXT NOT NULL DEFAULT '{}',"
                              " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, title TEXT NOT NULL, shelf_id INTEGER, state TEXT NOT NULL,"
                              " is_rare INTEGER NOT NULL, due_at TEXT) STRICT"))
    statements = TableStatements(table)
    for number in range(1, 8):
        entry = LogEntry(title=f"Book {number}", shelf_id=None if number % 2 else 3)
        database.insert(statements.insert(table.row(entry, table.columns), FIXED_TIME))
    yield Queries(database, tables).query(LogEntry)
    database.close()


def test_a_row_is_found_by_its_id(entries: Query[LogEntry]):
    assert entries.find(3).title == "Book 3"


def test_many_rows_come_back_in_the_order_asked(entries: Query[LogEntry]):
    assert [entry.id for entry in entries.find_many((5, 2, 7))] == [5, 2, 7]


def test_missing_ids_are_named_by_the_noun_a_person_types(entries: Query[LogEntry]):
    with pytest.raises(MissingRowsError, match="no entry 9, 12"):
        entries.find_many((3, 9, 12))


def test_filtering_on_none_finds_the_rows_with_no_value(entries: Query[LogEntry]):
    assert [entry.id for entry in entries.filter(shelf_id=None).oldest().page().rows] == [1, 3, 5, 7]


def test_a_column_the_model_does_not_have_is_refused(entries: Query[LogEntry]):
    with pytest.raises(UnknownColumnError, match="colour"):
        entries.filter(colour="red")


def test_a_list_is_read_one_page_at_a_time_newest_first(entries: Query[LogEntry]):
    second = entries.newest().page(2, 3)
    assert ([entry.id for entry in second.rows], second.total, second.is_last) == ([4, 3, 2], 7, False)
    assert entries.newest().page(3, 3).is_last


def test_counting_and_asking_whether_any_exist(entries: Query[LogEntry]):
    assert entries.matching(Greater("id", 5)).count() == 2
    assert entries.matching(Greater("id", 5)).exists()
    assert not entries.matching(Greater("id", 7)).exists()


def test_every_row_is_walked_page_by_page_without_counting(entries: Query[LogEntry], monkeypatch: pytest.MonkeyPatch):
    counted: list[int] = []
    monkeypatch.setattr(Query, "count", lambda self: counted.append(1) or 0)
    assert [entry.id for entry in entries.oldest().all_rows(size=3)] == [1, 2, 3, 4, 5, 6, 7]
    assert counted == []


@pytest.mark.parametrize(("row_count", "statement_count"), [(0, 1), (3, 1), (25, 2), (26, 2)])
def test_all_rows_stops_after_a_short_page(entries: Query[LogEntry], row_count: int, statement_count: int):
    statements = TableStatements(entries.table)
    for number in range(8, row_count + 1):
        entry = LogEntry(title=f"Book {number}")
        entries.database.insert(statements.insert(entries.table.row(entry, entries.table.columns), FIXED_TIME))
    reads: list[str] = []
    entries.database.connection.set_trace_callback(reads.append)

    rows = list(entries.matching(Less("id", row_count + 1)).oldest().all_rows(size=25))

    entries.database.connection.set_trace_callback(None)
    assert [row.id for row in rows] == list(range(1, row_count + 1))
    assert len(reads) == statement_count


def test_all_rows_reads_a_long_table_without_a_statement_per_small_page(entries: Query[LogEntry]):
    statements = TableStatements(entries.table)
    for number in range(8, 61):
        entry = LogEntry(title=f"Book {number}")
        entries.database.insert(statements.insert(entries.table.row(entry, entries.table.columns), FIXED_TIME))
    reads: list[str] = []
    entries.database.connection.set_trace_callback(reads.append)

    rows = list(entries.oldest().all_rows())

    entries.database.connection.set_trace_callback(None)
    assert [row.id for row in rows] == list(range(1, 61))
    assert len(reads) == 1


class ShelfEntries(Query[LogEntry]):
    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, LogEntry)

    def shelved(self, shelf_id: int) -> "ShelfEntries":
        return self.filter(shelf_id=shelf_id)


def test_a_query_with_named_filters_is_a_plain_class_the_container_builds(entries: Query[LogEntry]):
    container = Container()
    container.bind(Database, entries.database)
    shelved = container.get(ShelfEntries).shelved(3).oldest().page().rows
    assert [entry.id for entry in shelved] == [2, 4, 6]
