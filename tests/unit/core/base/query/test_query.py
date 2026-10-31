from datetime import datetime, timezone

import pytest

from core.base.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.database.table_statements import TableStatements
from core.base.journal_home import JournalHome
from core.base.missing_rows import MissingRows
from core.base.model.tables import Tables
from core.base.timestamp import Timestamp
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.query.query import Query
from core.base.query.unknown_column_error import UnknownColumnError
from tests.unit.core.base.model.test_table import LogEntry

AT = Timestamp(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))


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
        database.insert(statements.insert(table.row(entry, table.columns), AT))
    yield Queries(database, tables).query(LogEntry)
    database.close()


def test_a_row_is_found_by_its_id(entries: Query[LogEntry]):
    assert entries.find(3).title == "Book 3"


def test_many_rows_come_back_in_the_order_asked(entries: Query[LogEntry]):
    assert [entry.id for entry in entries.find_many((5, 2, 7))] == [5, 2, 7]


def test_missing_ids_are_named_by_the_noun_a_person_types(entries: Query[LogEntry]):
    with pytest.raises(MissingRows, match="no entry 9, 12"):
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


class ShelfEntries(Query[LogEntry]):
    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, LogEntry)

    def on_shelf(self, shelf_id: int) -> "ShelfEntries":
        return self.filter(shelf_id=shelf_id)


def test_a_query_with_named_filters_is_a_plain_class_the_container_builds(entries: Query[LogEntry]):
    container = Container()
    container.bind(Database, entries.database)
    on_shelf = container.get(ShelfEntries).on_shelf(3).oldest().page().rows
    assert [entry.id for entry in on_shelf] == [2, 4, 6]
